"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Minus,
  Plus,
  X,
  Banknote,
  CreditCard,
  Smartphone,
  User,
  Lock,
  AlertCircle,
  Check,
  ArrowRight,
  Wallet,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  Home,
  TruckIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
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


// Client-side function to get domain headers from cookies
function getDomainHeadersFromCookies(): {
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
        const domain = JSON.parse(domainValue)
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
      .min(2, tValidation("fullNameMin"))
      .max(100, tValidation("fullNameMax"))
      .regex(/^[a-zA-Z\s'-]+$/, tValidation("fullNameRegex")),
    phone: z
      .string()
      .min(1, tValidation("phoneRequired"))
      .refine(
        (val) => {
          // Remove spaces, hyphens, plus signs, and other formatting characters for validation
          const cleaned = val.replace(/[\s\-\(\)\+]/g, "")

          // Bangladesh phone number patterns:
          // 1. 11 digits starting with 01 (e.g., 01712345678)
          // 2. 880 followed by 10 digits (e.g., 8801712345678)
          // Mobile prefixes: 013, 014, 015, 016, 017, 018, 019
          const bangladeshPhoneRegex = /^(880|0)?1[3-9]\d{8}$/

          return bangladeshPhoneRegex.test(cleaned)
        },
        {
          message: tValidation("phoneInvalid"),
        }
      ),
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
];


const Checkout = () => {
  const router = useRouter()
  const { updateItem, removeItem } = useCart()
  const items = useCartStore((state) => state.items)
  const cartTotals = useCartStore((state) => state.totals)
  const tValidation = useTranslations("Theme2.checkout.validation")
  const [selectedPayment, setSelectedPayment] = useState("cash")
  // Shipping settings state
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

  // Incomplete order state
  const [incompleteOrderId, setIncompleteOrderId] = useState<number | null>(
    null
  )
  const incompleteOrderSentRef = useRef(false)

  // Create schema with localized messages
  const checkoutFormSchema = useMemo(
    () => createCheckoutFormSchema(tValidation),
    [tValidation]
  )

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
      paymentMethod: "bkash",
    },
  })

  // Fetch shipping settings on mount
  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        setLoadingShippingSettings(true)
        const headers = getDomainHeadersFromCookies()
        const response = await api.get("/customer/shipping-setting/show", {
          headers,
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
  }, [])
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
        const headers = getDomainHeadersFromCookies()
        const fetchPromises = itemsNeedingData.map(async (item) => {
          const productId = Number(item.productId)
          // Mark as fetched immediately to prevent duplicate calls
          fetchedProductIdsRef.current.add(productId)

          try {
            const response = await api.get(`/customer/products/${productId}`, {
              headers,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingShippingSettings])

  // Watch shipping and payment methods for real-time updates
  const shippingMethod = watch("shippingMethod")
  const paymentMethod = watch("paymentMethod")

  // Watch name and phone for incomplete order check
  const customerName = watch("fullName")
  const customerPhone = watch("phone")
  const customerAddress = watch("deliveryAddress")

  // Format variants as a string for display
  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) {
      return undefined
    }
    return item.variants.map((v) => `${v.key}: ${v.value}`).join(", ")
  }

  // Helper function to get inside Dhaka price
  const getInsideDhakaPrice = useMemo(() => {
    // Priority 1: Use API settings if available
    if (shippingSettings && shippingSettings.inside) {
      const apiPrice = parseFloat(shippingSettings.inside)
      if (!isNaN(apiPrice) && apiPrice > 0) {
        return apiPrice
      }
    }

    // Priority 2: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          // Try metadata first
          let price = item.metadata?.inside_dhaka as number | undefined

          // If not in metadata, try cache
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.inside_dhaka
          }

          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items, productDataCache])

  // Helper function to get subarea price
  const getSubareaPrice = useMemo(() => {
    // Priority 1: Use API settings if available
    if (shippingSettings && shippingSettings.subarea) {
      const apiPrice = parseFloat(shippingSettings.subarea)
      if (!isNaN(apiPrice) && apiPrice > 0) {
        return apiPrice
      }
    }

    // Priority 2: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          // Try metadata first
          let price = item.metadata?.sub_area_charge as number | undefined

          // If not in metadata, try cache
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.sub_area_charge
          }

          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items, productDataCache])


  // Helper function to get outside Dhaka price
  const getOutsideDhakaPrice = useMemo(() => {
    // Priority 1: Use API settings if available
    if (shippingSettings && shippingSettings.outside) {
      const apiPrice = parseFloat(shippingSettings.outside)
      if (!isNaN(apiPrice) && apiPrice > 0) {
        return apiPrice
      }
    }

    // Priority 2: Use product data from cart items (metadata or cache)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          // Try metadata first
          let price = item.metadata?.outside_dhaka as number | undefined

          // If not in metadata, try cache
          if (!price || price === 0) {
            const productId = Number(item.productId)
            const cachedData = productDataCache.get(productId)
            price = cachedData?.outside_dhaka
          }

          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items, productDataCache])
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
    async (shopId: string, userId: string) => {
      if (itemsRef.current.length === 0) return

      try {
        const orderPayload = {
          customer_name: customerNameRef.current || "",
          customer_phone: customerPhoneRef.current,
          customer_address: customerAddressRef.current || "",
          order_type: "website",
          products: itemsRef.current.map((item) => ({
            product_id: item.productId,
            variant_id:
              item.variants && item.variants.length > 0
                ? Number(item.variants[0]?.attributeId || 0)
                : 0,
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
              "shop-id": shopId,
              "user-id": userId,
            },
          }
        )

        const responseData = response.data as {
          success: boolean
          data: {
            incomplete_order_id: number
          }
        }
        console.log("Incomplete order created:", responseData)

        if (responseData.success && responseData.data?.incomplete_order_id) {
          setIncompleteOrderId(responseData.data.incomplete_order_id)
        }
      } catch (error) {
        console.error("Error creating incomplete order:", error)
      }
    },
    [] // stable — reads from refs
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
            await createIncompleteOrder(headers["shop-id"], headers["user-id"])
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
  }, [customerName, customerPhone, createIncompleteOrder])


  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      return
    }

    try {
      // Get store URL from cookie
      const storeUrl = getStoreUrlFromCookie()

      // Prepare order data
      console.log(
        "Submitting order with incomplete_order_id:",
        incompleteOrderId
      )
      const orderData = prepareOrderData({
        formData: {
          customer_name: data.fullName,
          customer_phone: data.phone,
          customer_address: data.deliveryAddress,
          customer_note: data.orderNote || undefined,
        },
        items,
        shippingMethod: data.shippingMethod as "inside_dhaka" | "outside_dhaka",
        paymentMethod: data.paymentMethod,
        storeUrl: storeUrl || "fldemo.store",
        visitorId: "1234567890",
        incomplete_order_id: incompleteOrderId ?? undefined,
        shipping_cost: shippingCost,
      })

      // Debug: Check if incomplete_order_id is in FormData
      if (incompleteOrderId) {
        console.log(
          "incomplete_order_id should be included:",
          incompleteOrderId
        )
        const formDataEntries = Array.from(orderData.entries())
        const hasIncompleteOrderId = formDataEntries.some(
          ([key]) => key === "incomplete_order_id"
        )
        console.log("incomplete_order_id in FormData:", hasIncompleteOrderId)
        console.log(
          "All FormData entries:",
          formDataEntries.map(([key]) => key)
        )
      }

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
            domain = JSON.parse(domainValue)
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
        orderData,
        undefined,
        {
          headers: {
            ...(shopId && { "shop-id": String(shopId) }),
            ...(userId && { "user-id": String(userId) }),
          },
        }
      )

      console.log("Order submitted successfully:", response.data)

      // TODO: Handle success (redirect to order confirmation, clear cart, etc.)
      alert("Order placed successfully!")
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

  // Show empty state if cart is empty
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart to continue checkout.
        </p>
        <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md" asChild>
          <Link href="/shop">{"continueShopping"}</Link>
        </Button>
      </div>
    )
  }
  console.log("Cart:", items)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress Bar - Mobile Optimized */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl">
              {["Cart", "Information", "Payment"].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base
          ${index < 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {index < 2 ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span
                      className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline
          ${index < 2 ? "text-green-600" : "text-gray-600"}`}
                    >
                      {step}
                    </span>
                  </div>

                  {index < 2 && (
                    <div
                      className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4
          ${index < 1 ? "bg-green-600" : "bg-gray-200"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
         <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
         
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="John"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="+880 1XXX-XXXXXX"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                        placeholder="House #123, Road #456, Mirpur"
                        {...register("deliveryAddress")}

                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special instructions, delivery notes, etc."
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                      {...register("orderNote")}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
          <div className="space-y-6 bg-white rounded-2xl pb-5">
  <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
    Payment Method
  </h3>

  <div className="px-5">
    <RadioGroup
      value={paymentMethod}
      onValueChange={(value) =>
        setValue("paymentMethod", value as CheckoutFormData["paymentMethod"])
      }
      className="grid sm:grid-cols-2 gap-4"
    >
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          htmlFor={method.id}
          className={cn(
            "cursor-pointer border-2 rounded-xl p-4 transition-all",
            paymentMethod === method.id
              ? "border-[#3bb77e] bg-[#3bb77e] text-white"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value={method.id}
              id={method.id}
              className="hidden"
            />

            {/* Custom radio */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                paymentMethod === method.id
                  ? "border-white"
                  : "border-gray-400"
              )}
            >
              {paymentMethod === method.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>

            <method.icon className="w-5 h-5" />

            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">
                {method.name}
              </h3>
              <p className="text-xs sm:text-sm opacity-80">
                {method.description}
              </p>
            </div>

            {method.image && (
              <Image
                src={method.image}
                alt={method.name}
                width={80}
                height={24}
              />
            )}
          </div>
        </label>
      ))}
    </RadioGroup>

    {errors.paymentMethod && (
      <p className="text-red-500 text-sm mt-2">
        {errors.paymentMethod.message}
      </p>
    )}
  </div>
</div>

            </div>

            {/* Right Column - Order Summary */}
            {/* Right Column - Order Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <Image
                          src={item.metadata?.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Header with Name and Remove Button */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 pr-2">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {formatVariants(item)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-1 p-0.5 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <span className="px-3 py-1.5 font-medium text-sm text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              disabled={
                                item.quantity >=
                                (item.metadata?.maxQuantity ?? 10)
                              }
                            >
                              <Plus className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              ৳{((item.discountedPrice ?? item.price) * item.quantity).toLocaleString()}
                            </div>
                            {item.discountedPrice && item.price > item.discountedPrice && (
                              <div className="text-xs text-gray-400 line-through">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Breakdown */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span className="font-medium">৳{finalTotals.subtotal.toLocaleString()}</span>
                  </div>

                  {/* Shipping Method */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Shipping Method
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: "inside_dhaka", label: "Inside Dhaka", price: 60 },
                        { value: "outside_dhaka", label: "Outside Dhaka", price: 120 },
                        { value: "sub_area", label: "Sub Area", price: 150 }
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${shippingCost === method.price
                            ? "border-[#3bb77e] bg-green-50"
                            : "border-gray-200 hover:border-[#3bb77e]"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${shippingCost === method.price
                              ? "border-[#3bb77e] bg-[#3bb77e]"
                              : "border-gray-300"
                              }`}>
                              {shippingCost === method.price && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-sm text-gray-700">{method.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            ৳{method.price}
                          </span>
                          <input
                            type="radio"
                            name="shipping"
                            value={method.value}
                            className="hidden"
                            checked={shippingCost === method.price}
                            onChange={() => setShippingCost(method.price)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Discount */}

                  <div className="flex justify-between text-[#3bb77e] text-sm sm:text-base">
                    <span>Discount</span>
                    <span className="font-medium">-৳100</span>
                  </div>


                  {/* Divider and Total */}
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
                      <span>Total</span>
                      <span>৳{finalTotals.total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes and fees
                    </p>
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 sm:mb-6">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#3bb77e]" />
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Secure checkout</span> • Your information is encrypted and protected
                  </span>
                </div>
                {/* Place Order Button */}

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || items.length === 0}
                  className={`w-full py-3.5 sm:py-4 rounded-lg font-semibold text-base transition-all duration-200 ${isValid && items.length > 0
                    ? "bg-gradient-to-r from-[#3bb77e] to-green-600 hover:from-green-600 hover:to-[#3bb77e] text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>{items.length === 0 ? "Cart is Empty" : "Place Order"}</span>
                      {items.length > 0 && (
                        <span className="ml-auto font-bold">
                          ৳{finalTotals.total.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </button>


                {/* Return Policy */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link
                    href="/return-policy"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#3bb77e] transition-colors group"
                  >
                    <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    <span className="font-medium">30-Day Return Policy</span>
                    <span className="text-gray-400 group-hover:text-[#3bb77e]">→</span>
                  </Link>
                </div>
              </div>
            </div>
        
        </div>
  </form>
        {/* Continue Shopping */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Checkout
