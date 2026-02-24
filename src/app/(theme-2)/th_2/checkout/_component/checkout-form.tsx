"use client"

import { useMemo, useEffect, useState, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../../_components/ui/button"
import { Input } from "../../_components/ui/input"
import { Textarea } from "../../_components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CartItem } from "../../_components/carts/cart-item"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { prepareOrderData, getStoreUrlFromCookie } from "@/lib/order"
import { useTranslations } from "next-intl"
import type { ShippingSetting } from "../../types/shipping"
import { useDomain } from "../../store/domain"
import type { PaymentGateway } from "../../types/shop"
import CheckoutOtp from "./checkout-otp"
import { toast } from "sonner"
import { trackBeginCheckout, trackPurchase } from "@/lib/gtm"

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

// Known payment provider display config
const PAYMENT_PROVIDER_CONFIG: Record<
  string,
  { label: string; logo: string | null; logoWidth: number; logoHeight: number }
> = {
  bkash: {
    label: "bKash",
    logo: "/bkash.png",
    logoWidth: 68,
    logoHeight: 24,
  },
  nagad: {
    label: "Nagad",
    logo: "/nagad.png",
    logoWidth: 68,
    logoHeight: 24,
  },
  sslcommerz: {
    label: "SSLCommerz",
    logo: "/sslcommerz.png",
    logoWidth: 111,
    logoHeight: 24,
  },
  stripe: {
    label: "Stripe",
    logo: "/stripe.png",
    logoWidth: 68,
    logoHeight: 24,
  },
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
    paymentMethod: z
      .string({
        message: tValidation("paymentMethodRequired"),
      })
      .min(1, tValidation("paymentMethodRequired")),
  })
}

type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutFormSchema>>

export function CheckoutForm() {
  const router = useRouter()

  // Get cart data from store
  const { updateItem, removeItem, clearCart } = useCart()
  const items = useCartStore((state) => state.items)
  const cartTotals = useCartStore((state) => state.totals)
  const t = useTranslations("Theme2.buttons")
  const tCheckout = useTranslations("Theme2.checkout")
  const tValidation = useTranslations("Theme2.checkout.validation")

  // Payment gateways from domain store
  const domain = useDomain((state) => state.domain)
  const activeGateways: PaymentGateway[] = useMemo(() => {
    if (!domain?.gateways || !Array.isArray(domain.gateways)) return []
    return domain.gateways.filter((g) => g.status === "active")
  }, [domain?.gateways])

  // Shipping settings state
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSetting | null>(null)
  const [loadingShippingSettings, setLoadingShippingSettings] = useState(true)

  // Incomplete order state
  const [incompleteOrderId, setIncompleteOrderId] = useState<number | null>(
    null
  )
  const incompleteOrderSentRef = useRef(false)

  // OTP state
  const [showOtp, setShowOtp] = useState(false)
  const [otpTimeLeft, setOtpTimeLeft] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const [otpPhone, setOtpPhone] = useState("")

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
    formState: { errors, isSubmitting },
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

    // Priority 2: Use product data from cart items (metadata)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          const price = item.metadata?.inside_dhaka as number | undefined
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items])

  // Helper function to get subarea price
  const getSubareaPrice = useMemo(() => {
    // Priority 1: Use API settings if available
    if (shippingSettings && shippingSettings.subarea) {
      const apiPrice = parseFloat(shippingSettings.subarea)
      if (!isNaN(apiPrice) && apiPrice > 0) {
        return apiPrice
      }
    }

    // Priority 2: Use product data from cart items (metadata)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          const price = item.metadata?.sub_area_charge as number | undefined
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items])

  // Helper function to get outside Dhaka price
  const getOutsideDhakaPrice = useMemo(() => {
    // Priority 1: Use API settings if available
    if (shippingSettings && shippingSettings.outside) {
      const apiPrice = parseFloat(shippingSettings.outside)
      if (!isNaN(apiPrice) && apiPrice > 0) {
        return apiPrice
      }
    }

    // Priority 2: Use product data from cart items (metadata)
    if (items.length > 0) {
      const prices = items
        .map((item) => {
          const price = item.metadata?.outside_dhaka as number | undefined
          return price && price > 0 ? price : 0
        })
        .filter((price) => price > 0)

      if (prices.length > 0) {
        return Math.max(...prices)
      }
    }

    // Priority 3: Default fallback
    return 0
  }, [shippingSettings, items])

  // Calculate shipping cost based on selected method
  // Priority: API settings > Product data > Default fallback
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

  // Calculate final totals
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

  const shippingMethodLabel = (method: string) => {
    if (method === "inside-dhaka") return "Inside Dhaka City"
    if (method === "subarea") return "Sub Area"
    return "Outside Dhaka City"
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      return
    }

    const cartItemsForGTM = items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.discountedPrice ?? item.price,
      quantity: item.quantity,
    }))

    trackBeginCheckout(
      cartItemsForGTM,
      finalTotals.total,
      {
        first_name: data.fullName,
        phone: data.phone,
      },
      shippingMethodLabel(data.shippingMethod)
    )

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response?.data as any
      const responseOrderData = responseData?.data
      const responseOrder = responseData?.order

      // Check if OTP verification is required
      if (responseOrder?.otp_sent) {
        toast.success(responseData?.message || "OTP sent successfully")
        setOtpPhone(data.phone)
        setOtpTimeLeft(120)
        setShowOtp(true)
        return
      }

      trackPurchase(
        cartItemsForGTM,
        finalTotals.total,
        {
          first_name: data.fullName,
          phone: data.phone,
        },
        data.paymentMethod === "cash-on-delivery" ? "COD" : data.paymentMethod,
        shippingMethodLabel(data.shippingMethod)
      )

      // Clear cart after successful order
      await clearCart()

      // If payment_url exists in response, redirect to payment gateway
      const paymentUrl = responseOrderData?.payment_url
      if (paymentUrl && typeof paymentUrl === "string") {
        window.location.href = paymentUrl
      } else {
        router.push("/order-success")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      throw error // Re-throw to let react-hook-form handle it
    }
  }

  // OTP timer countdown
  useEffect(() => {
    if (!otpTimeLeft) return
    const intervalId = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [showOtp, otpTimeLeft])

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      const shopId = domain?.shop_id
      const res = await api.post(
        "/customer/resend-otp",
        { phone: otpPhone },
        undefined,
        {
          headers: {
            ...(shopId && { "shop-id": String(shopId) }),
          },
        }
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resData = res.data as any
      if (resData?.data?.otp_sent) {
        toast.success("OTP sent successfully")
        setOtpTimeLeft(120)
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("Failed to resend OTP")
    } finally {
      setResendLoading(false)
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
        <Button asChild>
          <Link href="/shop">{t("continueShopping")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Billing Details */}
            <div className="space-y-6 bg-white rounded-2xl pb-5">
              <h2 className="text-lg md:text-xl font-bold p-5 border-b">
                {tCheckout("billingDetails")}
              </h2>

              <div className="space-y-4 px-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block font-medium mb-2">
                    {tCheckout("fullName")}
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={tCheckout("fullNamePlaceholder")}
                    className={cn(
                      "w-full px-4 py-6 text-base",
                      errors.fullName &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block font-medium mb-2">
                    {tCheckout("phoneNumber")}
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={tCheckout("phoneNumberPlaceholder")}
                    className={cn(
                      "w-full px-4 py-6 text-base",
                      errors.phone &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label
                    htmlFor="deliveryAddress"
                    className="block font-medium mb-2"
                  >
                    {tCheckout("deliveryAddress")}
                  </label>
                  <Input
                    id="deliveryAddress"
                    type="text"
                    placeholder={tCheckout("deliveryAddressPlaceholder")}
                    className={cn(
                      "w-full px-4 py-6 text-base",
                      errors.deliveryAddress &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("deliveryAddress")}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                {/* Order Note */}
                <div>
                  <label htmlFor="orderNote" className="block font-medium mb-2">
                    {tCheckout("orderNote")}
                  </label>
                  <Textarea
                    id="orderNote"
                    placeholder={tCheckout("orderNotePlaceholder")}
                    className={cn(
                      "w-full min-h-[100px]",
                      errors.orderNote &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("orderNote")}
                  />
                  {errors.orderNote && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.orderNote.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="space-y-6 bg-white rounded-2xl pb-5">
              <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
                {tCheckout("shippingMethod")}
              </h3>
              <div className="px-5">
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={(value) =>
                    setValue(
                      "shippingMethod",
                      value as CheckoutFormData["shippingMethod"]
                    )
                  }
                  className="gap-0 rounded-xl border overflow-hidden divide-y"
                >
                  <label
                    htmlFor="inside-dhaka"
                    className={cn(
                      "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                      shippingMethod === "inside-dhaka" && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="inside-dhaka" id="inside-dhaka" />
                      <span className="text-muted-foreground">
                        {tCheckout("insideDhaka")}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ৳
                      {loadingShippingSettings
                        ? "0.00"
                        : getInsideDhakaPrice.toFixed(2)}
                    </span>
                  </label>

                  <label
                    htmlFor="subarea"
                    className={cn(
                      "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                      shippingMethod === "subarea" && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="subarea" id="subarea" />
                      <span className="text-muted-foreground">
                        {tCheckout("subarea")}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ৳
                      {loadingShippingSettings
                        ? "0.00"
                        : getSubareaPrice.toFixed(2)}
                    </span>
                  </label>

                  <label
                    htmlFor="outside-dhaka"
                    className={cn(
                      "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                      shippingMethod === "outside-dhaka" && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="outside-dhaka"
                        id="outside-dhaka"
                      />
                      <span className="text-muted-foreground">
                        {tCheckout("outsideDhaka")}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ৳
                      {loadingShippingSettings
                        ? "0.00"
                        : getOutsideDhakaPrice.toFixed(2)}
                    </span>
                  </label>
                </RadioGroup>
                {errors.shippingMethod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingMethod.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Your Order */}
          <div className="space-y-6">
            {/* Your Order Container */}
            <div className="space-y-6 bg-white rounded-2xl pb-5">
              <h2 className="text-lg md:text-xl font-bold p-5 border-b">
                {tCheckout("yourOrder")}
              </h2>

              <div className="px-5 space-y-6">
                {/* Cart Items List */}
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    size={formatVariants(item)}
                    price={item.discountedPrice ?? item.price}
                    quantity={item.quantity}
                    image={
                      (item.metadata?.image as string) ||
                      "/product-placehoder.png"
                    }
                    maxQuantity={
                      (item.metadata?.maxQuantity as number) ?? undefined
                    }
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(item.id, quantity)
                    }
                    onRemove={() => handleRemoveProduct(item.id)}
                  />
                ))}

                {/* Order Summary */}
                <div className="rounded-xl border overflow-hidden divide-y">
                  <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                    <span>{tCheckout("subtotal")}</span>
                    <span className="font-semibold">
                      ৳{finalTotals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {finalTotals.discount > 0 && (
                    <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                      <span>{tCheckout("discount")}</span>
                      <span className="font-semibold text-green-600">
                        -৳{finalTotals.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {finalTotals.tax > 0 && (
                    <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                      <span>{tCheckout("tax")}</span>
                      <span className="font-semibold">
                        ৳{finalTotals.tax.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                    <span>{tCheckout("shipping")}</span>
                    <span className="font-semibold">
                      ৳{finalTotals.shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm font-bold border-t pt-2 mt-2">
                    <span>{tCheckout("total")}</span>
                    <span className="font-bold">
                      ৳{finalTotals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 bg-white rounded-2xl pb-5">
              <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
                {tCheckout("paymentMethod")}
              </h3>
              <div className="px-5">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setValue(
                      "paymentMethod",
                      value as CheckoutFormData["paymentMethod"]
                    )
                  }
                  className="gap-0 rounded-xl border overflow-hidden divide-y"
                >
                  {/* Cash on Delivery - always shown */}
                  <label
                    htmlFor="cash-on-delivery"
                    className={cn(
                      "px-4 py-2 flex items-center justify-between text-lg cursor-pointer",
                      paymentMethod === "cash-on-delivery" && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="cash-on-delivery"
                        id="cash-on-delivery"
                      />
                      <span className="text-muted-foreground max-md:text-sm">
                        {tCheckout("cashOnDelivery")}
                      </span>
                    </div>
                  </label>

                  {/* Dynamic payment gateways from domain store */}
                  {activeGateways.map((gateway) => {
                    const providerConfig =
                      PAYMENT_PROVIDER_CONFIG[gateway.provider]
                    if (!providerConfig) return null
                    return (
                      <label
                        key={gateway.provider}
                        htmlFor={gateway.provider}
                        className={cn(
                          "px-4 py-2 flex items-center justify-between text-lg cursor-pointer",
                          paymentMethod === gateway.provider && "bg-primary/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={gateway.provider}
                            id={gateway.provider}
                          />
                          <span className="text-muted-foreground max-md:text-sm">
                            {providerConfig.label}
                          </span>
                        </div>
                        {providerConfig.logo && (
                          <figure>
                            <Image
                              src={providerConfig.logo}
                              alt={providerConfig.label}
                              width={providerConfig.logoWidth}
                              height={providerConfig.logoHeight}
                            />
                          </figure>
                        )}
                      </label>
                    )
                  })}
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Place Order Button - sticky on mobile */}
          <div className="md:sticky md:relative fixed bottom-0 left-0 right-0 z-40 bg-background p-4 md:p-0 border-t md:border-t-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
            <Button
              type="submit"
              className="w-full h-12 text-base rounded-2xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("placingOrder") : t("placeOrder")}
            </Button>
          </div>
        </div>
        {/* Spacer for fixed button on mobile */}
        <div className="h-20 md:hidden" />
      </form>

      {/* OTP Modal */}
      <CheckoutOtp
        show={showOtp}
        onClose={() => setShowOtp(false)}
        customerPhone={otpPhone}
        timeLeft={otpTimeLeft}
        resendLoading={resendLoading}
        onResendOtp={handleResendOtp}
      />
    </>
  )
}
