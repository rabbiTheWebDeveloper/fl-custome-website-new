"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Minus,
  Plus,
  X,
  CreditCard,
  Smartphone,
  User,
  Lock,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Home,
  TruckIcon,
  ShoppingBag as ShoppingBagIcon,
} from "lucide-react"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import React, { useMemo, useEffect, useState, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api-client"
import { prepareOrderData, getStoreUrlFromCookie } from "@/lib/order"
import type { IProduct } from "../../types/product"
import { ShippingSetting } from "../../types/shipping"
import { useTranslations } from "next-intl"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import CheckoutOtp from "./checkout-otp"
import { toast } from "sonner"
import { useDomain } from "../../store/domain"
import { tagManagerEvent } from "@/lib/tag-manager-event"
import { DomainInfo } from "@/utils/api-helpers"
import {
  isValidBangladeshPhone,
  normalizePhoneValue,
} from "@/utils/form-normalizers"

// Client-side function to get domain headers from cookies
export function getDomainHeadersFromCookies(): {
  "shop-id": string
  "user-id": string
} {
  if (typeof window === "undefined") {
    return { "shop-id": "", "user-id": "" }
  }

  try {
    const domainCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("domain="))

    if (domainCookie) {
      const cookieValue = domainCookie.substring("domain=".length)
      let domainValue: string
      try {
        domainValue = decodeURIComponent(cookieValue)
      } catch {
        domainValue = cookieValue
      }

      try {
        const domain = JSON?.parse(domainValue)
        if (
          domain &&
          typeof domain === "object" &&
          "state" in domain &&
          domain.state &&
          typeof domain.state === "object" &&
          "domain" in domain.state &&
          domain.state.domain &&
          typeof domain.state.domain === "object"
        ) {
          const domainObj = domain.state.domain as Record<string, unknown>
          return {
            "shop-id": domainObj.shop_id ? String(domainObj.shop_id) : "",
            "user-id": domainObj.id ? String(domainObj.id) : "",
          }
        }
      } catch {
        // If parsing fails, try regex extraction
        const shopIdMatch = domainValue.match(
          /shop_id["\s]*:["\s]*"?([^",}\s]+)"?/
        )
        const userIdMatch = domainValue.match(
          /["\s]*id["\s]*:["\s]*"?([^",}\s]+)"?/
        )
        return {
          "shop-id": shopIdMatch ? shopIdMatch[1] : "",
          "user-id": userIdMatch ? userIdMatch[1] : "",
        }
      }
    }
  } catch (error) {
    console.warn("Error parsing domain cookie:", error)
  }

  return { "shop-id": "", "user-id": "" }
}

// Function to create Zod schema with localized error messages
function createCheckoutFormSchema(tValidation: (key: string) => string) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(2, tValidation("fullNameMin"))
      .max(100, tValidation("fullNameMax"))
      .regex(/^[\p{L}\p{M}\s'-]+$/u, tValidation("fullNameRegex")),
    phone: z
      .string()
      .min(1, tValidation("phoneRequired"))
      .refine((val) => isValidBangladeshPhone(val), {
        message: tValidation("phoneInvalid"),
      }),
    deliveryAddress: z
      .string()
      .min(10, tValidation("deliveryAddressMin"))
      .max(500, tValidation("deliveryAddressMax")),
    orderNote: z.string().max(1000, tValidation("orderNoteMax")).optional(),
    shippingMethod: z.enum(["inside-dhaka", "subarea", "outside-dhaka"], {
      message: tValidation("shippingMethodRequired"),
    }),
    paymentMethod: z.enum(["sslcommerz", "cash-on-delivery", "bkash"], {
      message: tValidation("paymentMethodRequired"),
    }),
  })
}

type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutFormSchema>>

// Payment methods
const paymentMethods = [
  {
    id: "sslcommerz",
    name: "sslcommerz",
    description: "Pay via cards, mobile banking",
    icon: CreditCard,
    image: "/sslcommerz.png",
  },
  {
    id: "cash-on-delivery",
    name: "cash-on-delivery",
    description: "Pay when you receive the order",
    icon: TruckIcon,
  },
  {
    id: "bkash",
    name: "bkash",
    description: "bKash mobile payment",
    icon: Smartphone,
    image: "/bkash.png",
  },
]

type GatewayConfig = {
  provider?: string
  status?: string
  full_payment?: boolean
  delivery_charge_only?: boolean
  percentage?: number
  fixed_amount?: number
}

const Checkout = ({ shopInfo }: { shopInfo: DomainInfo | null }) => {
  const gtmHead = shopInfo?.other_script?.gtm_head
  const { updateItem, removeItem, clearCart } = useCart()
  const items = useCartStore((state) => state.items)
  const cartTotals = useCartStore((state) => state.totals)
  const tValidation = useTranslations("Theme2.checkout.validation")
  const tCheckout = useTranslations("Theme2.checkout")
  const domain = useDomain((state) => state.domain)
  const [timeLeft, setTimeLeft] = useState(0)
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSetting | null>(null)
  const [loadingShippingSettings, setLoadingShippingSettings] = useState(true)
  // Product data cache for items missing metadata
  const [productDataCache, setProductDataCache] = useState<
    Map<
      number,
      { inside_dhaka: number; outside_dhaka: number; sub_area_charge: number }
    >
  >(new Map())
  const fetchedProductIdsRef = useRef<Set<number>>(new Set())

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [resendLoading, setResendLoading] = useState(false)
  // Incomplete order state
  const [incompleteOrderId, setIncompleteOrderId] = useState<number | null>(
    null
  )
  const incompleteOrderSentRef = useRef(false)

  const getVariantIdForOrder = useCallback((item: StoreCartItem): number => {
    if (!item.variants || item.variants.length === 0) return 0

    for (const variant of item.variants) {
      const rawId =
        variant.variationId ?? variant.variantId ?? variant.attributeId
      if (
        rawId !== undefined &&
        rawId !== null &&
        String(rawId).trim() !== ""
      ) {
        const parsed = Number(rawId)
        if (Number.isFinite(parsed) && parsed > 0) return parsed
      }
    }

    return 0
  }, [])

  // Create schema with localized messages
  const checkoutFormSchema = useMemo(
    () => createCheckoutFormSchema(tValidation),
    [tValidation]
  )
  const [visitorID, setVisitorID] = useState("")
  const setFp = async () => {
    const fp = await FingerprintJS.load()
    const { visitorId } = await fp.get()
    setVisitorID(visitorId)
  }
  useEffect(() => {
    setFp()
  }, [])
  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CheckoutFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(checkoutFormSchema as any),
    defaultValues: {
      fullName: "",
      phone: "",
      deliveryAddress: "",
      orderNote: "",
      shippingMethod: "inside-dhaka",
      paymentMethod: "cash-on-delivery",
    },
  })

  // Fetch shipping settings on mount
  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        setLoadingShippingSettings(true)
        const response = await api.get("/customer/shipping-setting/show", {
          headers: {
            "shop-id": shopInfo?.shop_id || "",
            "user-id": shopInfo?.user_id || "",
          },
        })

        // Check if data exists and is not empty string
        // API response structure: response.data.data or response.data
        let shippingData: unknown = null

        if (response.data && typeof response.data === "object") {
          // Check if it's nested: { data: {...} }
          if ("data" in response.data && response.data.data !== undefined) {
            const nestedData = (response.data as { data: unknown }).data
            // Skip if empty string
            if (nestedData !== "" && nestedData !== null) {
              shippingData = nestedData
            }
          } else if ("inside" in response.data || "outside" in response.data) {
            // Direct response with shipping fields
            shippingData = response.data
          }
        }

        // Type guard: check if it's a valid ShippingSetting
        if (
          shippingData &&
          typeof shippingData === "object" &&
          shippingData !== null &&
          !Array.isArray(shippingData) &&
          ("inside" in shippingData || "outside" in shippingData)
        ) {
          setShippingSettings(shippingData as ShippingSetting)
        }
      } catch (error) {
        console.error("Error fetching shipping settings:", error)
        // Continue with product-based shipping if API fails
      } finally {
        setLoadingShippingSettings(false)
      }
    }

    fetchShippingSettings()
  }, [shopInfo?.shop_id, shopInfo?.user_id])
  // Fetch product data for cart items missing shipping metadata (runs once after shipping settings load)
  useEffect(() => {
    if (loadingShippingSettings) return
    if (items.length === 0) return

    const itemsNeedingData = items.filter((item) => {
      const productId = Number(item.productId)
      if (fetchedProductIdsRef.current.has(productId)) return false
      return !item.metadata?.inside_dhaka || !item.metadata?.outside_dhaka
    })

    if (itemsNeedingData.length === 0) return

    const fetchMissingProductData = async () => {
      try {
        const fetchPromises = itemsNeedingData.map(async (item) => {
          const productId = Number(item.productId)
          // Mark as fetched immediately to prevent duplicate calls
          fetchedProductIdsRef.current.add(productId)

          try {
            const response = await api.get(`/customer/products/${productId}`, {
              headers: {
                "shop-id": shopInfo?.shop_id || "",
                "user-id": shopInfo?.user_id || "",
              },
            })
            const product = (response.data as { data: IProduct }).data
            if (product) {
              setProductDataCache((prev) => {
                const newCache = new Map(prev)
                newCache.set(productId, {
                  inside_dhaka: product.inside_dhaka,
                  outside_dhaka: product.outside_dhaka,
                  sub_area_charge: product.sub_area_charge,
                })
                return newCache
              })
            }
          } catch (error) {
            // Remove from fetched set so it can be retried
            fetchedProductIdsRef.current.delete(productId)
            console.error(`Failed to fetch product ${productId}:`, error)
          }
        })

        await Promise.all(fetchPromises)
      } catch (error) {
        console.error("Error fetching product data:", error)
      }
    }

    fetchMissingProductData()
  }, [loadingShippingSettings, items, shopInfo?.user_id, shopInfo?.shop_id])

  // Watch shipping and payment methods for real-time updates
  const shippingMethod = watch("shippingMethod")
  const paymentMethod = watch("paymentMethod")

  const selectedGateway = useMemo(() => {
    const domainGateways = ((domain as unknown as { gateways?: unknown })
      ?.gateways ?? null) as Array<GatewayConfig> | null
    if (!domainGateways || domainGateways.length === 0) return null
    return domainGateways.find((g) => g?.provider === paymentMethod) ?? null
  }, [domain, paymentMethod])

  // Watch name and phone for incomplete order check
  const customerName = watch("fullName")
  const customerPhone = watch("phone")
  const customerAddress = watch("deliveryAddress")

  // Format variants as a string for display
  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) {
      return undefined
    }
    return item.variants
      .map((v: { key: string; value: string }) => `${v.key}: ${v.value}`)
      .join(", ")
  }

  // status 1 = use API values (inside, outside, subarea); status 0 = use product response shipping cost
  const useApiShipping = useMemo(
    () => shippingSettings?.status === 1,
    [shippingSettings?.status]
  )

  // Helper function to get inside Dhaka price
  const getInsideDhakaPrice = useMemo(() => {
    // status 1: Use API settings only
    if (useApiShipping && shippingSettings?.inside) {
      const apiPrice = parseFloat(shippingSettings.inside)
      if (!isNaN(apiPrice)) return apiPrice
      return 0
    }

    // status 0: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          let price = item.metadata?.inside_dhaka as number | undefined
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.inside_dhaka
          }
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) return Math.max(...prices)
    }

    return 0
  }, [shippingSettings, items, productDataCache, useApiShipping])

  // Helper function to get subarea price
  const getSubareaPrice = useMemo(() => {
    // status 1: Use API settings only
    if (useApiShipping && shippingSettings?.subarea) {
      const apiPrice = parseFloat(shippingSettings.subarea)
      if (!isNaN(apiPrice)) return apiPrice
      return 0
    }

    // status 0: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          let price = item.metadata?.sub_area_charge as number | undefined
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.sub_area_charge
          }
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) return Math.max(...prices)
    }

    return 0
  }, [shippingSettings, items, productDataCache, useApiShipping])

  // Helper function to get outside Dhaka price
  const getOutsideDhakaPrice = useMemo(() => {
    // status 1: Use API settings only
    if (useApiShipping && shippingSettings?.outside) {
      const apiPrice = parseFloat(shippingSettings.outside)
      if (!isNaN(apiPrice)) return apiPrice
      return 0
    }

    // status 0: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          let price = item.metadata?.outside_dhaka as number | undefined
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.outside_dhaka
          }
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) return Math.max(...prices)
    }

    return 0
  }, [shippingSettings, items, productDataCache, useApiShipping])

  // Available shipping options: hide options where value is 0 (when all are 0, show free delivery)
  const availableShippingOptions = useMemo(() => {
    const options: {
      id: "inside-dhaka" | "subarea" | "outside-dhaka"
      price: number
      labelKey?: string
    }[] = []
    if (getInsideDhakaPrice > 0)
      options.push({ id: "inside-dhaka", price: getInsideDhakaPrice })
    if (getSubareaPrice > 0)
      options.push({ id: "subarea", price: getSubareaPrice })
    if (getOutsideDhakaPrice > 0)
      options.push({ id: "outside-dhaka", price: getOutsideDhakaPrice })
    if (options.length === 0) {
      return [
        { id: "inside-dhaka" as const, price: 0, labelKey: "freeDelivery" },
      ]
    }
    return options
  }, [getInsideDhakaPrice, getSubareaPrice, getOutsideDhakaPrice])

  // Set default shipping method to first available option when loading completes
  useEffect(() => {
    if (loadingShippingSettings) return
    const availableIds = availableShippingOptions.map((o) => o.id)
    if (availableIds.length > 0 && !availableIds.includes(shippingMethod)) {
      setValue("shippingMethod", availableIds[0])
    }
  }, [
    loadingShippingSettings,
    availableShippingOptions,
    shippingMethod,
    setValue,
  ])

  const shippingCost = useMemo(() => {
    if (loadingShippingSettings) {
      return 0 // Return 0 while loading to avoid showing incorrect values
    }

    if (shippingMethod === "inside-dhaka") {
      return getInsideDhakaPrice
    } else if (shippingMethod === "subarea") {
      return getSubareaPrice
    } else if (shippingMethod === "outside-dhaka") {
      return getOutsideDhakaPrice
    }
    return 0
  }, [
    shippingMethod,
    getInsideDhakaPrice,
    getSubareaPrice,
    getOutsideDhakaPrice,
    loadingShippingSettings,
  ])
  const finalTotals = useMemo(() => {
    const subtotal = cartTotals.subtotal
    const discount = cartTotals.discount || 0
    const tax = cartTotals.tax || 0
    const total = subtotal - discount + tax + shippingCost
    return {
      subtotal,
      discount,
      tax,
      shipping: shippingCost,
      total,
    }
  }, [cartTotals.subtotal, cartTotals.discount, cartTotals.tax, shippingCost])

  const onlinePaymentAmount = useMemo(() => {
    if (paymentMethod === "cash-on-delivery") return 0

    const total = finalTotals.total
    const shipping = finalTotals.shipping

    if (!selectedGateway) return total

    const fullPayment = Boolean(selectedGateway?.full_payment)
    const fixedAmount = Number(selectedGateway?.fixed_amount ?? 0)
    const percentage = Number(selectedGateway?.percentage ?? 0)
    const deliveryChargeOnly = Boolean(selectedGateway?.delivery_charge_only)

    if (fullPayment) return total
    if (fixedAmount > 0) return fixedAmount
    if (percentage > 0) return Math.round((total * percentage) / 100)
    if (deliveryChargeOnly) return shipping

    return total
  }, [finalTotals.shipping, finalTotals.total, paymentMethod, selectedGateway])

  // Create incomplete order function (uses refs to read latest values without re-creating)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const customerNameRef = useRef(customerName)
  customerNameRef.current = customerName
  const customerPhoneRef = useRef(customerPhone)
  customerPhoneRef.current = customerPhone
  const customerAddressRef = useRef(customerAddress)
  customerAddressRef.current = customerAddress
  const finalTotalsRef = useRef(finalTotals)
  finalTotalsRef.current = finalTotals

  const createIncompleteOrder = useCallback(
    async () => {
      if (itemsRef.current.length === 0) return

      try {
        const orderPayload = {
          customer_name: customerNameRef.current || "",
          customer_phone: normalizePhoneValue(customerPhoneRef.current || ""),
          customer_address: customerAddressRef.current || "",
          order_type: "website",
          products: itemsRef.current.map((item) => ({
            product_id: item.productId,
            variant_id: getVariantIdForOrder(item),
            qty: item.quantity,
            subtotal: (item.discountedPrice ?? item.price) * item.quantity,
          })),
          grand_total: finalTotalsRef.current.total,
        }

        const response = await api.post(
          "/customer/incomplete-order",
          orderPayload,
          {
            headers: {
              "shop-id": shopInfo?.shop_id || "",
              "user-id": shopInfo?.user_id || "",
            },
          }
        )

        const responseData = response.data as {
          success: boolean
          data: {
            incomplete_order_id: number
          }
        }

        if (responseData.success && responseData.data?.incomplete_order_id) {
          setIncompleteOrderId(responseData.data.incomplete_order_id)
        }
      } catch (error) {
        console.error("Error creating incomplete order:", error)
      }
    },
    [shopInfo?.user_id, shopInfo?.shop_id, getVariantIdForOrder] // stable — reads from refs
  )

  // Check incomplete order status ONCE when name and phone are first entered
  useEffect(() => {
    // Already sent once — skip
    if (incompleteOrderSentRef.current) return

    // Only check if both name and phone are filled
    if (
      !customerName ||
      !customerPhone ||
      customerName.length < 2 ||
      customerPhone.length < 10
    ) {
      return
    }

    const checkIncompleteOrderStatus = async () => {
      // Get shop ID from cookies
      const headers = getDomainHeadersFromCookies()
      const shopId = headers["shop-id"]

      if (!shopId) return

      try {
        const response = await api.get(`/incomplete-order/status/${shopId}`, {
          headers,
        })

        const responseData = response.data as {
          success: boolean
          data: {
            shop_id: number
            incomplete_order_status: number
          }
        }

        if (responseData.success && responseData.data) {
          const status = responseData.data.incomplete_order_status

          if (status === 1) {
            await createIncompleteOrder()
          } else {
            setIncompleteOrderId(null)
          }
        }
      } catch (error) {
        console.error("Error checking incomplete order status:", error)
      }

      // Mark as done regardless of outcome — only fires once
      incompleteOrderSentRef.current = true
    }

    // Debounce the check
    const timeoutId = setTimeout(checkIncompleteOrderStatus, 500)
    return () => clearTimeout(timeoutId)
  }, [
    customerName,
    customerPhone,
    createIncompleteOrder,
    shopInfo?.user_id,
    shopInfo?.shop_id,
  ])

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      return
    }

    try {
      const normalizedPhone = normalizePhoneValue(data.phone)
      // Get store URL from cookie
      const storeUrl = getStoreUrlFromCookie()
      const orderData = prepareOrderData({
        formData: {
          customer_name: data.fullName,
          customer_phone: normalizedPhone,
          customer_address: data.deliveryAddress,
          customer_note: data.orderNote || undefined,
        },
        items,
        shippingMethod: data.shippingMethod as "inside_dhaka" | "outside_dhaka",
        paymentMethod: data.paymentMethod,
        storeUrl: storeUrl || "fldemo.store",
        visitorId: visitorID,
        incomplete_order_id: incompleteOrderId ?? undefined,
        shipping_cost: shippingCost,
      })

      // Force variant IDs from live cart items for multi-variant products.
      const resolvedVariantIds = items.map((item) => getVariantIdForOrder(item))
      const requestOrderData = new FormData()
      Array.from(orderData.entries()).forEach(([key, value]) => {
        if (key !== "variant_id[]") {
          requestOrderData.append(key, value)
        }
      })
      resolvedVariantIds.forEach((id) => {
        requestOrderData.append("variant_id[]", String(id))
      })

      // Get shop-id and user-id from cookies for headers
      let shopId: string | undefined
      let userId: string | undefined

      try {
        const domainCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("domain="))

        if (domainCookie) {
          // Handle cookie value that might contain = signs
          const cookieValue = domainCookie.substring("domain=".length)

          // Try to decode the value
          let domainValue: string
          try {
            domainValue = decodeURIComponent(cookieValue)
          } catch {
            // If decode fails, use raw value
            domainValue = cookieValue
          }

          // Try to parse JSON with better error handling
          let domain: unknown
          try {
            domain = JSON?.parse(domainValue)
          } catch (parseError) {
            console.warn("Failed to parse domain cookie as JSON:", parseError)
            // Try to extract values from potentially malformed JSON
            const shopIdMatch = domainValue.match(
              /shop_id["\s]*:["\s]*"?([^",}\s]+)"?/
            )
            const userIdMatch = domainValue.match(
              /["\s]*id["\s]*:["\s]*"?([^",}\s]+)"?/
            )
            if (shopIdMatch) shopId = shopIdMatch[1]
            if (userIdMatch) userId = userIdMatch[1]
            // If we couldn't extract, continue without them
            if (!shopId && !userId) {
              throw parseError
            }
          }

          // Type guard for domain structure
          if (
            domain &&
            typeof domain === "object" &&
            "state" in domain &&
            domain.state &&
            typeof domain.state === "object" &&
            "domain" in domain.state &&
            domain.state.domain &&
            typeof domain.state.domain === "object"
          ) {
            const domainObj = domain.state.domain as Record<string, unknown>
            shopId = domainObj.shop_id ? String(domainObj.shop_id) : shopId
            userId = domainObj.id ? String(domainObj.id) : userId
          }
        }
      } catch (error) {
        console.warn("Error parsing domain cookie for headers:", error)
        // Continue without shop-id and user-id if parsing fails
      }

      // Submit order to API
      const response = await api.post(
        "/customer/order/store",
        requestOrderData,
        undefined,
        {
          headers: {
            ...(shopInfo?.shop_id && { "shop-id": String(shopInfo?.shop_id) }),
            ...(shopInfo?.user_id && { "user-id": String(shopInfo?.user_id) }),
          },
        }
      )

      // Type assertion for the response data
      const responseData = response?.data as {
        message?: string
        order?: {
          id?: number
          otp_sent?: boolean
        }
        data?:
          | {
              order?: {
                id?: number
              }
              payment_url?: string | undefined
            }
          | undefined

        success: boolean
      }
      const isHttpSuccess = response.status >= 200 && response.status < 300
      const isApiSuccess = responseData?.success !== false

      if (!isHttpSuccess || !isApiSuccess) {
        toast.error(
          responseData?.message || "Failed to place order. Please try again."
        )
        return
      }
      const { order, data: responseOrderData } = responseData

      if (response.data && typeof response.data === "object") {
        if (responseOrderData) {
          if (responseOrderData?.payment_url) {
            await clearCart()
            window.location.assign(responseOrderData?.payment_url)
          } else {
            const orderId = responseOrderData?.order?.id
            if (!orderId) {
              toast.error(
                "Order ID missing in response. Please contact support."
              )
              return
            }
            toast.success("Order placed successfully")
            await clearCart()
            window.location.assign(`/order-success/${orderId}`)
          }
        } else if (order?.otp_sent) {
          toast.success("OTP sent successfully")
          setTimeLeft(120)
          handleShow()
          // router.push(`/order-successfull/${order?.id}`)
        }
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      throw error // Re-throw to let react-hook-form handle it
    }
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateItem(itemId, { quantity: newQuantity })
  }

  const handleRemoveProduct = async (itemId: string) => {
    await removeItem(itemId)
  }

  const shippingMethods = useMemo(
    () =>
      availableShippingOptions.map((opt) => ({
        id: opt.id,
        label: opt.labelKey
          ? tCheckout(opt.labelKey)
          : opt.id === "inside-dhaka"
            ? "Inside Dhaka"
            : opt.id === "subarea"
              ? "Sub Area"
              : "Outside Dhaka",
        price: loadingShippingSettings ? 0 : opt.price,
      })),
    [availableShippingOptions, loadingShippingSettings, tCheckout]
  )

  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      const res = await api.post(
        "/customer/resend-otp",
        { phone: normalizePhoneValue(customerPhone) },
        undefined,
        {
          headers: {
            ...(shopInfo?.shop_id && { "shop-id": shopInfo?.shop_id }),
          },
        }
      )
      const responseData = res.data as {
        data: {
          otp_sent: boolean
        }
      }
      if (responseData.data.otp_sent) {
        toast.success("OTP sent successfully")
        setTimeLeft(120)
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
    } finally {
      setResendLoading(false)
    }
  }

  useEffect(() => {
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [show, timeLeft])
  const availablePaymentMethods = useMemo(() => {
    const domainGateways = ((domain as unknown as { gateways?: unknown })
      ?.gateways ?? null) as Array<GatewayConfig> | null

    if (!domainGateways || domainGateways.length === 0) {
      return paymentMethods.filter((m) => m.id === "cash-on-delivery")
    }

    const activeProviders = domainGateways
      .filter((g) => g.status === "active")
      .map((g) => g.provider)

    if (activeProviders.length === 0) {
      return paymentMethods.filter((m) => m.id === "cash-on-delivery")
    }

    return paymentMethods.filter(
      (m) => m.id === "cash-on-delivery" || activeProviders.includes(m.id)
    )
  }, [domain])

  useEffect(() => {
    if (items.length > 0 && gtmHead) {
      tagManagerEvent(
        "begin_checkout",
        finalTotals.total,
        items,
        "item_type_array"
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])
  // Show empty state if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-white dark:bg-black">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center mb-6 border border-gray-200 dark:border-zinc-800">
          <ShoppingBagIcon className="w-9 h-9 text-gray-400 dark:text-zinc-600" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 mb-8 text-center max-w-sm">
          Add some products to your cart to continue checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* ── Cinematic Page Header ── */}
      <div className="pt-32 pb-10 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-zinc-500">
            Almost there
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mt-8 max-w-xs mx-auto">
          {["Cart", "Details", "Payment"].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${
                      index < 2
                        ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-black"
                        : "bg-transparent border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-600"
                    }`}
                >
                  {index < 2 ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest
                  ${index < 2 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-zinc-600"}`}
                >
                  {step}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-0.5 mb-5 mx-1
                  ${index < 1 ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-zinc-800"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
            {/* ══ LEFT COLUMN ══ */}
            <div className="space-y-5">
              {/* Contact Information Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-gray-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                    Contact Information
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                      placeholder="e.g. Rahman Sabbir"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs font-medium mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      <input
                        type="tel"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                        placeholder="+880 1XXX-XXXXXX"
                        {...register("phone", {
                          onBlur: (event) => {
                            const normalized = normalizePhoneValue(
                              event.target.value
                            )
                            setValue("phone", normalized, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          },
                        })}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs font-medium mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-4 top-4 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                      <textarea
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all resize-none"
                        placeholder="House #123, Road #456, Area, City"
                        {...register("deliveryAddress")}
                      />
                    </div>
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-xs font-medium mt-1">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Order Note */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                      Order Notes{" "}
                      <span className="normal-case font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special instructions, delivery preferences…"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all resize-none"
                      {...register("orderNote")}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-gray-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <TruckIcon className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                    Shipping Method
                  </h2>
                </div>

                <div className="p-6">
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={(value) =>
                      setValue(
                        "shippingMethod",
                        value as CheckoutFormData["shippingMethod"]
                      )
                    }
                    className="space-y-3"
                  >
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        htmlFor={`ship-${method.id}`}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                          shippingMethod === method.id
                            ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white"
                            : "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={method.id}
                            id={`ship-${method.id}`}
                            className="hidden"
                          />
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                              shippingMethod === method.id
                                ? "border-white dark:border-black"
                                : "border-gray-400 dark:border-zinc-500"
                            )}
                          >
                            {shippingMethod === method.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-sm font-semibold transition-colors",
                              shippingMethod === method.id
                                ? "text-white dark:text-black"
                                : "text-gray-700 dark:text-zinc-300"
                            )}
                          >
                            {method.label}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-bold tracking-tight transition-colors",
                            shippingMethod === method.id
                              ? "text-white dark:text-black"
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          {method.price === 0
                            ? "Free"
                            : `৳${method.price.toFixed(0)}`}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                  {errors.shippingMethod && (
                    <p className="text-red-500 text-xs font-medium mt-3">
                      {errors.shippingMethod.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 pt-6 pb-5 border-b border-gray-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                  <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="p-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setValue(
                        "paymentMethod",
                        value as CheckoutFormData["paymentMethod"]
                      )
                    }
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {availablePaymentMethods.map((method) => (
                      <label
                        key={method.id}
                        htmlFor={`pay-${method.id}`}
                        className={cn(
                          "cursor-pointer border-2 rounded-2xl p-4 transition-all duration-200 group",
                          paymentMethod === method.id
                            ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white"
                            : "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={method.id}
                            id={`pay-${method.id}`}
                            className="hidden"
                          />
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              paymentMethod === method.id
                                ? "border-white dark:border-black"
                                : "border-gray-400 dark:border-zinc-500"
                            )}
                          >
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                            )}
                          </div>

                          <method.icon
                            className={cn(
                              "w-5 h-5 flex-shrink-0 transition-colors",
                              paymentMethod === method.id
                                ? "text-white dark:text-black"
                                : "text-gray-500 dark:text-zinc-400"
                            )}
                          />

                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "font-bold text-xs uppercase tracking-wider transition-colors",
                                paymentMethod === method.id
                                  ? "text-white dark:text-black"
                                  : "text-gray-900 dark:text-white"
                              )}
                            >
                              {method.name.replace(/-/g, " ")}
                            </p>
                            <p
                              className={cn(
                                "text-xs transition-colors mt-0.5",
                                paymentMethod === method.id
                                  ? "text-white/70 dark:text-black/60"
                                  : "text-gray-400 dark:text-zinc-500"
                              )}
                            >
                              {method.description}
                            </p>
                          </div>

                          {method.image && (
                            <Image
                              src={method.image}
                              alt={method.name}
                              width={60}
                              height={20}
                              className="flex-shrink-0 object-contain"
                            />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs font-medium mt-3">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ══ RIGHT COLUMN – Order Summary ══ */}
            <div className="lg:sticky lg:top-28 space-y-5">
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-zinc-800">
                  <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                    {items.length} item{items.length !== 1 ? "s" : ""} in your
                    cart
                  </p>
                </div>

                {/* Cart Items */}
                <div className="px-6 py-4 space-y-4 max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                        {item.metadata?.image ? (
                          <Image
                            src={item.metadata.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-300 dark:text-zinc-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                            aria-label="Remove item"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {formatVariants(item) && (
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                            {formatVariants(item)}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 border border-gray-200 dark:border-zinc-700 rounded-full overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3 text-gray-600 dark:text-zinc-400" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 dark:text-white w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                              disabled={
                                item.quantity >=
                                (item.metadata?.maxQuantity ?? 10)
                              }
                            >
                              <Plus className="w-3 h-3 text-gray-600 dark:text-zinc-400" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              ৳
                              {(
                                (item.discountedPrice ?? item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                            {item.discountedPrice &&
                              item.price > item.discountedPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  ৳
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="px-6 py-5 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ৳{finalTotals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {finalTotals.shipping === 0
                        ? "Free"
                        : `৳${finalTotals.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {finalTotals.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span className="font-semibold">
                        −৳{finalTotals.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {finalTotals.tax > 0 && (
                    <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
                      <span>Tax</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ৳{finalTotals.tax.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {paymentMethod !== "cash-on-delivery" && (
                    <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
                      <span>
                        Online Pay{" "}
                        {selectedGateway?.provider
                          ? `(${String(selectedGateway.provider)})`
                          : ""}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ৳{onlinePaymentAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between items-center">
                    <span className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                      ৳{finalTotals.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-zinc-600">
                    Including all taxes and fees
                  </p>
                </div>

                {/* Security badge */}
                <div className="px-6 pb-5">
                  <div className="flex items-center gap-2.5 p-3.5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700">
                    <ShieldCheck className="w-4 h-4 text-gray-400 dark:text-zinc-500 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      <span className="font-semibold text-gray-700 dark:text-zinc-300">
                        Secure checkout
                      </span>{" "}
                      · Encrypted & protected
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-900 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:p-0 lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:border-0">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || items.length === 0}
                  className={cn(
                    "w-full rounded-full px-6 py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-between shadow-xl",
                    isValid && items.length > 0 && !isSubmitting
                      ? "bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
                      : "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed shadow-none"
                  )}
                >
                  {isSubmitting ? (
                    <span className="w-full flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {items.length === 0 ? "Cart is empty" : "Place Order"}
                      </span>
                      {items.length > 0 && (
                        <span className="text-base font-black tracking-tight">
                          ৳{finalTotals.total.toLocaleString()}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>

              {/* Mobile spacer */}
              <div className="h-24 lg:hidden" />

              {/* Continue Shopping */}
              <div className="text-center hidden lg:block">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      <CheckoutOtp
        timeLeft={timeLeft}
        show={show}
        onClose={handleClose}
        customerPhone={customerPhone}
        resendLoading={resendLoading}
        onResendOtp={handleResendOtp}
      />
    </div>
  )
}

export default Checkout
