"use client"
import {
  ShoppingCart,
  Banknote,
  Shield,
  Truck,
  Plus,
  Minus,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect, CSSProperties, useCallback, useRef } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LandingOrderProps } from "@/type/landing"
import CheckoutOtp from "@/components/checkout-otp"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { tagManagerEvent } from "@/lib/tag-manager-event"
// Define form validation schema
const orderFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(14, "Phone number too long"),
  address: z.string().min(10, "Address is required"),
  note: z.string().optional(),
  deliveryArea: z.enum(["inside", "outside", "sub_area"]),
})

type OrderFormData = z.infer<typeof orderFormSchema>

// This represents the actual product variant options with pricing/stock
// (different from IProductVariation which is for variation attributes)
interface ProductVariantOption {
  id: number
  variant: string
  price: number
  quantity: number
  media?: string
}

type SelectedVariant = ProductVariantOption

const LandingOrder = ({
  product,
  fb,
  shopId,
  twitter,
  linkedin,
  instagram,
  youtube,
  other_script,
  footer_text_color,
  footer_link_color,
  footer_b_color,
  footer_heading_color,
  checkout_text_color,
  checkout_link_color,
  checkout_b_color,
  checkout_button_color,
  checkout_button_text_color,
  backgroundColor,
  fontColor,
  btnColor,
  btnTextColor,
  order_title = "Your Order",
  checkout_button_text = "Place Order",
  showShippingOptions = true,
  storeUrl = typeof window !== "undefined" ? window.location.origin : "",
}: LandingOrderProps) => {
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "bkash">("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIncompleteOrderLoading, setIsIncompleteOrderLoading] =
    useState(false)
  const router = useRouter()
  // OTP Modal State
  const [timeLeft, setTimeLeft] = useState(0)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [resendLoading, setResendLoading] = useState(false)
  const [incompleteOrderId, setIncompleteOrderId] = useState<number | null>(
    null
  )
  const incompleteOrderSentRef = useRef(false)
  // For products WITHOUT variants
  const [simpleProductQuantity, setSimpleProductQuantity] = useState<number>(1)
  // For products WITH variants
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    () => {
      if (
        product &&
        Array.isArray(product.variations) &&
        product.variations.length > 0
      ) {
        const variants = product.variations as unknown as ProductVariantOption[]
        return variants.map((variant) => ({
          id: variant.id,
          variant: variant.variant,
          price: variant.price,
          quantity: 0,
          media: variant.media,
        }))
      }
      return []
    }
  )

  const [prevProductId, setPrevProductId] = useState(product?.id)
  const [visitorID, setVisitorID] = useState<string | null>(null)
  useEffect(() => {
    let isMounted = true

    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load()
        const { visitorId } = await fp.get()

        if (isMounted) {
          setVisitorID(visitorId)
        }
      } catch (error) {
        console.error("FingerprintJS initialization failed:", error)

        // Optional fallback (keeps app working)
        if (isMounted) {
          setVisitorID(null)
        }
      }
    }

    initFingerprint()

    return () => {
      isMounted = false
    }
  }, [])
  // Reset when product changes
  useEffect(() => {
    if (product && product.id !== prevProductId) {
      setPrevProductId(product.id)
      if (Array.isArray(product.variations) && product.variations.length > 0) {
        const variants = product.variations as unknown as ProductVariantOption[]
        const initialVariants = variants.map((variant) => ({
          id: variant.id,
          variant: variant.variant,
          price: variant.price,
          quantity: 0,
          media: variant.media,
        }))
        setSelectedVariants(initialVariants)
      } else {
        setSelectedVariants([])
        setSimpleProductQuantity(1)
      }
    }
  }, [product, prevProductId])

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      note: "",
      deliveryArea: (product?.default_delivery_location === "sub_area"
        ? "sub_area"
        : "inside") as OrderFormData["deliveryArea"],
    },
    mode: "onChange",
  })

  const deliveryArea = watch("deliveryArea")

  const customerName = watch("name")
  const customerPhone = watch("phone")
  const customerAddress = watch("address")

  // OTP timer effect - must be before early return
  useEffect(() => {
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [show, timeLeft])

  useEffect(() => {
    if (typeof window === "undefined") return

    const isOrderHash = (hash: string) => {
      const normalized = hash.replace(/^#/, "").toLowerCase()
      return normalized === "placeanorder" || normalized === "checkout"
    }

    const scrollToOrderSection = () => {
      if (!isOrderHash(window.location.hash)) return

      const section =
        document.getElementById("placeAnOrder") ||
        document.getElementById("placeanorder")

      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    // Initial run after paint for first page load with hash.
    const timeoutId = window.setTimeout(scrollToOrderSection, 0)
    // Runtime run when hash changes on the same page.
    window.addEventListener("hashchange", scrollToOrderSection)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener("hashchange", scrollToOrderSection)
    }
  }, [])

  useEffect(() => {
    if (product && other_script?.gtm_head) {
      tagManagerEvent(
        "begin_checkout",
        product.discounted_price || product.price,
        product,
        "single_item"
      )
    }
  }, [product])
  // if (!product) {
  //   return (
  //     <div
  //       className="py-12 min-h-screen flex items-center justify-center"
  //       style={{ backgroundColor }}
  //     >
  //       <div className="text-center">
  //         <p className="text-xl font-semibold" style={{ color: fontColor }}>
  //           Product information is not available
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  // Calculate shipping charge based on delivery area
  const getShippingCharge = () => {
    if (product.delivery_charge === "free") return 0

    switch (deliveryArea) {
      case "inside":
        return product.inside_dhaka || 0
      case "outside":
        return product.outside_dhaka || 0
      case "sub_area":
        return product.sub_area_charge || product.outside_dhaka || 0
      default:
        return product.inside_dhaka || 0
    }
  }

  // Calculate totals
  const calculateTotals = () => {
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      // For products WITH variants
      const subtotal = selectedVariants.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const shippingCharge = getShippingCharge()
      const isFreeShipping = product.delivery_charge === "free"
      const total = subtotal + shippingCharge

      return { subtotal, shippingCharge, total, isFreeShipping }
    } else {
      // For products WITHOUT variants
      const price = product.discounted_price || product.price
      const subtotal = price * simpleProductQuantity
      const shippingCharge = getShippingCharge()
      const isFreeShipping = product.delivery_charge === "free"
      const total = subtotal + shippingCharge

      return { subtotal, shippingCharge, total, isFreeShipping }
    }
  }

  const { subtotal, shippingCharge, total, isFreeShipping } = calculateTotals()

  // Handle variant quantity changes
  const handleVariantQuantityChange = (variantId: number, change: number) => {
    setSelectedVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          const newQuantity = variant.quantity + change
          // Check available stock
          const variants = Array.isArray(product.variations)
            ? (product.variations as unknown as ProductVariantOption[])
            : []
          const availableStock =
            variants.find((v) => v.id === variantId)?.quantity || 0
          if (newQuantity >= 0 && newQuantity <= availableStock) {
            return { ...variant, quantity: newQuantity }
          }
        }
        return variant
      })
    )
  }

  // Handle simple product quantity changes
  const handleSimpleProductQuantityChange = (change: number) => {
    const newQuantity = simpleProductQuantity + change
    if (newQuantity >= 1 && newQuantity <= product.product_qty) {
      setSimpleProductQuantity(newQuantity)
    }
  }

  // Get product image
  const getProductImage = (variantMedia?: string) => {
    if (variantMedia) return variantMedia
    if (product.main_image) return product.main_image
    if (product.wp_product_image_url) return product.wp_product_image_url
    return "https://via.placeholder.com/150"
  }

  // Check if any variant is selected (for products with variants)
  const hasSelectedVariants = selectedVariants.some((v) => v.quantity > 0)

  // Prepare order payload according to your prepareOrderData function
  const prepareOrderPayload = (formData: OrderFormData) => {
    const formDataObj = new FormData()

    // Customer information
    formDataObj.append("customer_name", formData.name)
    formDataObj.append("customer_phone", formData.phone)
    formDataObj.append("customer_address", formData.address)

    // Customer note (optional)
    if (formData.note) {
      formDataObj.append("customer_note", formData.note)
    }

    // Payment method (gateway)
    // const gateway = selectedPayment === "cod" ? "cod" : selectedPayment
    // formDataObj.append("gateway", "bkash")

    // Store URL
    const storeUrlWithProtocol = storeUrl.startsWith("http")
      ? storeUrl
      : `https://${storeUrl}`
    formDataObj.append("store_url", storeUrlWithProtocol)

    // Product arrays
    if (Array.isArray(product.variations) && product.variations.length > 0) {
      // For variant products
      selectedVariants
        .filter((v) => v.quantity > 0)
        .forEach((variant) => {
          formDataObj.append("product_id[]", String(product.id))
          formDataObj.append("product_qty[]", String(variant.quantity))
          formDataObj.append("variant_id[]", String(variant.id))
        })
    } else {
      // For simple products
      formDataObj.append("product_id[]", String(product.id))
      formDataObj.append("product_qty[]", String(simpleProductQuantity))
      formDataObj.append("variant_id[]", "0")
    }

    // Delivery location - map to inside_dhaka/outside_dhaka
    let deliveryLocation = "inside_dhaka"
    if (formData.deliveryArea === "outside") {
      deliveryLocation = "outside_dhaka"
    } else if (formData.deliveryArea === "sub_area") {
      deliveryLocation = "sub_area" // This should match your backend
    }
    formDataObj.append("delivery_location", deliveryLocation)

    // Shipping cost

    formDataObj.append("shipping_cost", String(shippingCharge || 0))

    // Order type
    formDataObj.append("order_type", "landing")
    // Visitor ID

    formDataObj.append("visitor_id", visitorID || "unknown")
    if (incompleteOrderId) {
      formDataObj.append("incomplete_order_id", String(incompleteOrderId))
    }

    return formDataObj
  }

  const getOrderItems = useCallback(() => {
    if (!product) return []

    if (Array.isArray(product.variations) && product.variations.length > 0) {
      return selectedVariants
        .filter((v) => v.quantity > 0)
        .map((variant) => ({
          productId: product.id,
          variantId: variant.id,
          quantity: variant.quantity,
          price: variant.price,
          subtotal: variant.price * variant.quantity,
        }))
    } else {
      const price = product.discounted_price || product.price
      return [
        {
          productId: product.id,
          variantId: 0,
          quantity: simpleProductQuantity,
          price: price,
          subtotal: price * simpleProductQuantity,
        },
      ]
    }
  }, [product, selectedVariants, simpleProductQuantity])

  const createIncompleteOrder = useCallback(async () => {
    const items = getOrderItems()
    if (items.length === 0 || !customerPhone) return
    try {
      const orderPayload = {
        customer_name: customerName || "",
        customer_phone: customerPhone,
        customer_address: customerAddress || "",
        order_type: "landing",
        products: items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          qty: item.quantity,
          subtotal: item.subtotal,
        })),
        grand_total: total,
      }

      const response = await api.post(
        "/customer/incomplete-order",
        orderPayload,
        {
          headers: {
            "shop-id": String(shopId),
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
  }, [
    shopId,
    customerName,
    customerPhone,
    customerAddress,
    total,
    getOrderItems,
  ])

  // Check incomplete order status when name and phone are entered
  useEffect(() => {
    // Already sent once — skip
    if (incompleteOrderSentRef.current) return

    // Only check if both name and phone are filled with valid length
    if (
      !customerName ||
      !customerPhone ||
      customerName.length < 2 ||
      customerPhone.length < 11
    ) {
      return
    }

    // Only create incomplete order if at least one item is selected
    const items = getOrderItems()
    if (items.length === 0) {
      return
    }

    const checkIncompleteOrderStatus = async () => {
      if (!shopId) return

      setIsIncompleteOrderLoading(true)
      try {
        const response = await api.get(`/incomplete-order/status/${shopId}`, {
          headers: {
            "shop-id": String(shopId),
          },
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
      } finally {
        setIsIncompleteOrderLoading(false)
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
    shopId,
    createIncompleteOrder,
    getOrderItems,
  ])
  // Handle form submission
  const onSubmit: SubmitHandler<OrderFormData> = async (formData) => {
    // Validate if any items are selected
    const hasItems =
      Array.isArray(product.variations) && product.variations.length > 0
        ? hasSelectedVariants
        : simpleProductQuantity > 0

    if (!hasItems) {
      toast.error("Please add at least one item to your order!")
      return
    }

    setIsSubmitting(true)

    try {
      const formDataPayload = prepareOrderPayload(formData)

      // Call your API
      const response = await api.post(
        "/customer/order/store",
        formDataPayload,
        undefined,
        {
          headers: {
            ...(shopId && { "shop-id": String(shopId) }),
          },
        }
      )

      const responseData = response?.data as {
        message?: string
        order?: {
          id?: number
          otp_sent?: boolean
        }
        data?: {
          order?: {
            id?: number
          }
          payment_url?: string
        }
      }

      if (response.data && typeof response.data === "object") {
        const { order, data: responseOrderData } = responseData

        if (responseOrderData?.order?.id) {
          toast.success("Order placed successfully")
          router.push(`/order-success/${responseOrderData.order.id}`)
        } else if (responseOrderData?.payment_url) {
          window.location.href = responseOrderData.payment_url
        } else if (order?.otp_sent) {
          toast.success("OTP sent successfully")
          toast.success("OTP sent successfully")
          setTimeLeft(120)
          handleShow()
        } else if (responseData.message) {
          toast.success(responseData.message)
        }
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error)
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            error.message ||
            "An error occurred while placing your order. Please try again."
          : "An error occurred while placing your order. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get delivery options based on product
  const getDeliveryOptions = () => {
    const options = []

    // Only show delivery options if delivery_charge is 'paid'
    if (product.delivery_charge === "paid") {
      if (product.inside_dhaka !== undefined && product.inside_dhaka !== null) {
        options.push({
          value: "inside",
          label: `Inside Dhaka (৳${product.inside_dhaka})`,
        })
      }

      if (
        product.outside_dhaka !== undefined &&
        product.outside_dhaka !== null
      ) {
        options.push({
          value: "outside",
          label: `Outside Dhaka (৳${product.outside_dhaka})`,
        })
      }

      if (
        product.sub_area_charge !== undefined &&
        product.sub_area_charge !== null
      ) {
        options.push({
          value: "sub_area",
          label: `Sub Area (৳${product.sub_area_charge})`,
        })
      }
    }

    return options
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      const res = await api.post(
        "/customer/resend-otp",
        { phone: customerPhone },
        undefined,
        {
          headers: {
            ...(shopId && { "shop-id": String(shopId) }),
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

  const hasSocialMedia = fb || twitter || linkedin || instagram || youtube

  return (
    <section
      id="placeAnOrder"
      data-section="place-an-order"
      className="py-12 min-h-screen scroll-mt-24"
      style={{ backgroundColor }}
    >
      <span id="placeanorder" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold mb-10 text-center"
          style={{ color: fontColor }}
        >
          {order_title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - Product & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Product Summary Card */}
            <div
              className="p-4 md:p-8 rounded-2xl shadow-lg"
              style={{
                backgroundColor: checkout_b_color || "#ffffff",
                borderColor: checkout_b_color
                  ? `${checkout_b_color}20`
                  : "#e5e7eb",
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                  <Image
                    src={getProductImage()}
                    alt={product.product_name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: checkout_text_color || fontColor }}
                  >
                    {product.product_name}
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: checkout_text_color
                        ? `${checkout_text_color}90`
                        : "#6b7280",
                    }}
                  >
                    {product.product_code}
                  </p>
                </div>
                {/* {product.discount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {product.discount}% OFF
                  </span>
                )} */}
              </div>

              {/* PRODUCT WITH VARIANTS */}
              {Array.isArray(product.variations) &&
              product.variations.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Select Variants
                    </h4>
                    <span
                      className="text-sm"
                      style={{
                        color: checkout_text_color
                          ? `${checkout_text_color}90`
                          : "#6b7280",
                      }}
                    >
                      {selectedVariants.filter((v) => v.quantity > 0).length}{" "}
                      selected
                    </span>
                  </div>

                  <div className="space-y-5">
                    {selectedVariants.map((variant) => {
                      const variants = Array.isArray(product.variations)
                        ? (product.variations as unknown as ProductVariantOption[])
                        : []
                      const availableStock =
                        variants.find((v) => v.id === variant.id)?.quantity || 0
                      return (
                        <div
                          key={variant.id}
                          className={`p-5 md:p-6 border rounded-xl transition-all ${
                            variant.quantity > 0
                              ? "ring-2 ring-offset-1"
                              : "hover:border-gray-400 cursor-pointer"
                          }`}
                          onClick={() => {
                            if (variant.quantity === 0) {
                              if (availableStock > 0) {
                                handleVariantQuantityChange(variant.id, 1)
                              }
                            } else {
                              handleVariantQuantityChange(
                                variant.id,
                                -variant.quantity
                              )
                            }
                          }}
                          style={
                            {
                              borderColor:
                                variant.quantity > 0
                                  ? checkout_button_color || btnColor
                                  : "#e5e7eb",
                              "--tw-ring-color":
                                checkout_button_color || btnColor,
                            } as CSSProperties
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden relative">
                                <Image
                                  src={getProductImage(variant.media)}
                                  alt={variant.variant}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p
                                    className="font-bold"
                                    style={{
                                      color: checkout_text_color || fontColor,
                                    }}
                                  >
                                    Variant : {variant.variant}
                                  </p>
                                  {variant.quantity > 0 && (
                                    <Check
                                      size={16}
                                      className="text-green-600"
                                    />
                                  )}
                                </div>
                                <p
                                  className="font-bold text-lg mt-1"
                                  style={{
                                    color: checkout_button_color || btnColor,
                                  }}
                                >
                                  ৳ {variant.price}
                                </p>
                                <p
                                  className="text-sm mt-1"
                                  style={{
                                    color: checkout_text_color
                                      ? `${checkout_text_color}90`
                                      : "#6b7280",
                                  }}
                                >
                                  Available: {availableStock} units
                                </p>
                              </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVariantQuantityChange(variant.id, -1)
                                  }}
                                  disabled={variant.quantity <= 0}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    variant.quantity > 0
                                      ? "bg-gray-200 hover:bg-gray-300"
                                      : "bg-gray-100 cursor-not-allowed"
                                  }`}
                                >
                                  <Minus size={16} />
                                </button>

                                <span
                                  className="text-lg font-semibold w-8 text-center"
                                  style={{
                                    color: checkout_text_color || fontColor,
                                  }}
                                >
                                  {variant.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVariantQuantityChange(variant.id, 1)
                                  }}
                                  disabled={variant.quantity >= availableStock}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    variant.quantity < availableStock
                                      ? "bg-gray-200 hover:bg-gray-300"
                                      : "bg-gray-100 cursor-not-allowed"
                                  }`}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              {variant.quantity > 0 && (
                                <p
                                  className="font-bold"
                                  style={{
                                    color: checkout_text_color || fontColor,
                                  }}
                                >
                                  ৳ {variant.price * variant.quantity}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {!hasSelectedVariants && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Please select at least one variant to continue
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* SIMPLE PRODUCT WITHOUT VARIANTS */
                <div>
                  <div
                    className="flex items-center justify-between p-5 md:p-6 border rounded-xl"
                    style={{
                      borderColor: checkout_b_color
                        ? `${checkout_b_color}30`
                        : "#e5e7eb",
                    }}
                  >
                    <div className="flex-1">
                      <p
                        className="font-semibold text-lg"
                        style={{ color: checkout_text_color || fontColor }}
                      >
                        Standard Product
                      </p>
                      <p
                        className="font-bold text-2xl mt-2"
                        style={{ color: checkout_button_color || btnColor }}
                      >
                        ৳ {product.discounted_price || product.price}
                      </p>
                      {product.discount > 0 && (
                        <p
                          className="text-sm line-through mt-1"
                          style={{
                            color: checkout_text_color
                              ? `${checkout_text_color}70`
                              : "#9ca3af",
                          }}
                        >
                          ৳ {product.price}
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSimpleProductQuantityChange(-1)}
                          disabled={simpleProductQuantity <= 1}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            simpleProductQuantity > 1
                              ? "bg-gray-200 hover:bg-gray-300"
                              : "bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          <Minus size={20} />
                        </button>

                        <div className="flex flex-col items-center">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: checkout_text_color || fontColor }}
                          >
                            {simpleProductQuantity}
                          </span>
                          <span
                            className="text-xs mt-1"
                            style={{
                              color: checkout_text_color
                                ? `${checkout_text_color}90`
                                : "#6b7280",
                            }}
                          >
                            Available: {product.product_qty}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSimpleProductQuantityChange(1)}
                          disabled={
                            simpleProductQuantity >= product.product_qty
                          }
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            simpleProductQuantity < product.product_qty
                              ? "bg-gray-200 hover:bg-gray-300"
                              : "bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      <p
                        className="font-bold text-lg"
                        style={{ color: checkout_text_color || fontColor }}
                      >
                        Total: ৳{" "}
                        {(product.discounted_price || product.price) *
                          simpleProductQuantity}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div
                className="mt-8 pt-6 border-t space-y-3"
                style={{
                  borderColor: checkout_b_color
                    ? `${checkout_b_color}30`
                    : "#e5e7eb",
                }}
              >
                <div className="flex justify-between items-center">
                  <p style={{ color: checkout_text_color || fontColor }}>
                    Subtotal
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: checkout_text_color || fontColor }}
                  >
                    ৳ {subtotal}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck
                      size={16}
                      style={{ color: checkout_text_color || fontColor }}
                    />
                    <p style={{ color: checkout_text_color || fontColor }}>
                      Shipping
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${isFreeShipping ? "text-green-600" : ""}`}
                    style={
                      !isFreeShipping
                        ? { color: checkout_text_color || fontColor }
                        : {}
                    }
                  >
                    {isFreeShipping ? (
                      <span className="text-green-600">Free Shipping</span>
                    ) : (
                      `৳ ${shippingCharge}`
                    )}
                  </p>
                </div>

                {/* {product.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <p style={{ color: checkout_text_color || fontColor }}>
                      Discount
                    </p>
                    <p className="font-semibold text-green-600">
                      -{product.discount}%
                    </p>
                  </div>
                )} */}

                <div
                  className="h-px my-3"
                  style={{
                    backgroundColor: checkout_b_color
                      ? `${checkout_b_color}30`
                      : "#e5e7eb",
                  }}
                ></div>

                <div className="flex justify-between items-center pt-3">
                  <p
                    className="text-xl font-bold"
                    style={{ color: checkout_text_color || fontColor }}
                  >
                    Total
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: checkout_button_color || btnColor }}
                  >
                    ৳ {total}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div
              className="p-6 md:p-8 rounded-2xl shadow-lg"
              style={{
                backgroundColor: checkout_b_color || "#ffffff",
                borderColor: checkout_b_color
                  ? `${checkout_b_color}20`
                  : "#e5e7eb",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 pb-4 border-b"
                style={{
                  color: checkout_text_color || fontColor,
                  borderColor: checkout_b_color
                    ? `${checkout_b_color}30`
                    : "#e5e7eb",
                }}
              >
                Payment Method
              </h3>

              {/* Cash on Delivery */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedPayment("cod")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${selectedPayment === "cod" ? "ring-2 ring-offset-2" : "hover:border-gray-400"}`}
                  style={
                    {
                      borderColor:
                        selectedPayment === "cod"
                          ? checkout_button_color || btnColor
                          : "#e5e7eb",
                      "--tw-ring-color": checkout_button_color || btnColor,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: checkout_button_color
                            ? `${checkout_button_color}10`
                            : "#f3f4f6",
                          color: checkout_button_color || btnColor,
                        }}
                      >
                        <Banknote size={24} />
                      </div>
                      <div className="text-left">
                        <p
                          className="font-bold text-lg"
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          Cash on Delivery
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: checkout_text_color
                              ? `${checkout_text_color}90`
                              : "#6b7280",
                          }}
                        >
                          Pay after receiving your order
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === "cod" ? "" : "border-gray-300"}`}
                      style={{
                        backgroundColor:
                          selectedPayment === "cod"
                            ? checkout_button_color || btnColor
                            : "transparent",
                        borderColor:
                          selectedPayment === "cod"
                            ? checkout_button_color || btnColor
                            : "#d1d5db",
                      }}
                    >
                      {selectedPayment === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
              {/* Security Note */}
              <div
                className="mt-6 pt-6 border-t flex items-start gap-3"
                style={{
                  borderColor: checkout_b_color
                    ? `${checkout_b_color}30`
                    : "#e5e7eb",
                }}
              >
                <Shield className="text-green-600 mt-1" size={20} />
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: checkout_text_color || fontColor }}
                  >
                    Secure Payment
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: checkout_text_color
                        ? `${checkout_text_color}90`
                        : "#6b7280",
                    }}
                  >
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Billing Details */}
          <div className="lg:col-span-5 px-4 md:px-6">
            <div
              className="p-8 md:p-10 rounded-2xl shadow-lg sticky top-8"
              style={{
                backgroundColor: checkout_b_color || "#ffffff",
                borderColor: checkout_b_color
                  ? `${checkout_b_color}20`
                  : "#e5e7eb",
              }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: checkout_text_color || fontColor }}
              >
                Billing Details
              </h3>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-500" : ""}`}
                      style={
                        {
                          borderColor: errors.name
                            ? "#ef4444"
                            : checkout_b_color
                              ? `${checkout_b_color}50`
                              : "#e5e7eb",
                          "--tw-ring-color": checkout_button_color || btnColor,
                          color: checkout_text_color || fontColor,
                          backgroundColor: checkout_b_color
                            ? `${checkout_b_color}05`
                            : "#ffffff",
                        } as CSSProperties
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder="01XXXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.phone ? "border-red-500" : ""}`}
                      style={
                        {
                          borderColor: errors.phone
                            ? "#ef4444"
                            : checkout_b_color
                              ? `${checkout_b_color}50`
                              : "#e5e7eb",
                          "--tw-ring-color": checkout_button_color || btnColor,
                          color: checkout_text_color || fontColor,
                          backgroundColor: checkout_b_color
                            ? `${checkout_b_color}05`
                            : "#ffffff",
                        } as CSSProperties
                      }
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Shipping Options - ONLY show if delivery_charge is 'paid' */}
                  {showShippingOptions &&
                    product.delivery_charge === "paid" &&
                    getDeliveryOptions().length > 0 && (
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          Delivery Area *
                        </label>
                        <select
                          {...register("deliveryArea")}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition"
                          style={
                            {
                              borderColor: checkout_b_color
                                ? `${checkout_b_color}50`
                                : "#e5e7eb",
                              "--tw-ring-color":
                                checkout_button_color || btnColor,
                              color: checkout_text_color || fontColor,
                              backgroundColor: checkout_b_color
                                ? `${checkout_b_color}05`
                                : "#ffffff",
                            } as CSSProperties
                          }
                        >
                          {getDeliveryOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {product.delivery_charge === "paid" && (
                          <p
                            className="text-sm mt-2"
                            style={{
                              color: checkout_text_color
                                ? `${checkout_text_color}90`
                                : "#6b7280",
                            }}
                          >
                            Shipping charges apply based on your location
                          </p>
                        )}
                      </div>
                    )}

                  {/* Show message for free shipping */}
                  {showShippingOptions &&
                    product.delivery_charge === "free" && (
                      <div
                        className="p-3 rounded-lg border"
                        style={{
                          backgroundColor: checkout_b_color
                            ? `${checkout_b_color}10`
                            : "#f0fdf4",
                          borderColor: checkout_b_color
                            ? `${checkout_b_color}30`
                            : "#bbf7d0",
                        }}
                      >
                        <div
                          className="flex items-center gap-2"
                          style={{
                            color: checkout_button_color
                              ? `${checkout_button_color}80`
                              : "#16a34a",
                          }}
                        >
                          <Truck size={18} />
                          <p className="font-medium">
                            Free Shipping Available!
                          </p>
                        </div>
                        <p
                          className="text-sm mt-1"
                          style={{
                            color: checkout_button_color
                              ? `${checkout_button_color}70`
                              : "#15803d",
                          }}
                        >
                          This product includes free delivery anywhere in
                          Bangladesh.
                        </p>
                      </div>
                    )}

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Full Address *
                    </label>
                    <textarea
                      {...register("address")}
                      placeholder="House #, Road #, Area, City"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${errors.address ? "border-red-500" : ""}`}
                      style={
                        {
                          borderColor: errors.address
                            ? "#ef4444"
                            : checkout_b_color
                              ? `${checkout_b_color}50`
                              : "#e5e7eb",
                          "--tw-ring-color": checkout_button_color || btnColor,
                          color: checkout_text_color || fontColor,
                          backgroundColor: checkout_b_color
                            ? `${checkout_b_color}05`
                            : "#ffffff",
                        } as CSSProperties
                      }
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Note (Optional)
                    </label>
                    <textarea
                      {...register("note")}
                      placeholder="Add any special instructions for delivery"
                      rows={2}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                      style={
                        {
                          borderColor: checkout_b_color
                            ? `${checkout_b_color}50`
                            : "#e5e7eb",
                          "--tw-ring-color": checkout_button_color || btnColor,
                          color: checkout_text_color || fontColor,
                          backgroundColor: checkout_b_color
                            ? `${checkout_b_color}05`
                            : "#ffffff",
                        } as CSSProperties
                      }
                    />
                  </div>

                  {/* Order Summary */}
                  <div
                    className="mt-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: checkout_b_color
                        ? `${checkout_b_color}10`
                        : "#f9fafb",
                      borderColor: checkout_b_color
                        ? `${checkout_b_color}30`
                        : "#e5e7eb",
                    }}
                  >
                    <p
                      className="font-semibold mb-3"
                      style={{ color: checkout_text_color || fontColor }}
                    >
                      Order Summary:
                    </p>

                    {Array.isArray(product.variations) &&
                    product.variations.length > 0 ? (
                      <div className="space-y-2">
                        {selectedVariants
                          .filter((v) => v.quantity > 0)
                          .map((variant, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span
                                style={{
                                  color: checkout_text_color || fontColor,
                                }}
                              >
                                {product.product_name} - {variant.variant} ×{" "}
                                {variant.quantity}
                              </span>
                              <span
                                style={{
                                  color: checkout_text_color || fontColor,
                                }}
                              >
                                ৳ {variant.price * variant.quantity}
                              </span>
                            </div>
                          ))}
                        {selectedVariants.filter((v) => v.quantity > 0)
                          .length === 0 && (
                          <p
                            className="text-sm"
                            style={{
                              color: checkout_text_color
                                ? `${checkout_text_color}70`
                                : "#9ca3af",
                            }}
                          >
                            No items selected
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          {product.product_name} × {simpleProductQuantity}
                        </span>
                        <span
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          ৳ {subtotal}
                        </span>
                      </div>
                    )}

                    {/* Shipping Info in Summary */}
                    <div
                      className="mt-2 pt-2 border-t"
                      style={{
                        borderColor: checkout_b_color
                          ? `${checkout_b_color}30`
                          : "#d1d5db",
                      }}
                    >
                      <div className="flex justify-between text-sm">
                        <span
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          Shipping
                        </span>
                        <span
                          style={{ color: checkout_text_color || fontColor }}
                        >
                          {isFreeShipping ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `৳ ${shippingCharge}`
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className="h-px my-3"
                      style={{
                        backgroundColor: checkout_b_color
                          ? `${checkout_b_color}30`
                          : "#d1d5db",
                      }}
                    ></div>

                    <div className="flex justify-between font-bold">
                      <span style={{ color: checkout_text_color || fontColor }}>
                        Total
                      </span>
                      <span
                        style={{ color: checkout_button_color || btnColor }}
                      >
                        ৳ {total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isIncompleteOrderLoading ||
                    !isValid ||
                    (Array.isArray(product.variations) &&
                      product.variations.length > 0 &&
                      !hasSelectedVariants) ||
                    (!product.variations && simpleProductQuantity === 0)
                  }
                  className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{
                    background: checkout_button_color || btnColor,
                    color: checkout_button_text_color || btnTextColor,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Order Processing...
                    </>
                  ) : isIncompleteOrderLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Preparing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      {checkout_button_text
                        ? checkout_button_text
                        : "Place Order"}{" "}
                      ৳ {total}
                    </>
                  )}
                </button>
              </form>

              {/* Social Media Links */}
              {hasSocialMedia && (
                <div className="mt-6 pt-6 border-t">
                  <p
                    className="font-semibold mb-3 text-center"
                    style={{
                      color:
                        footer_heading_color ||
                        checkout_text_color ||
                        fontColor,
                    }}
                  >
                    Follow Us
                  </p>
                  <div className="flex justify-center gap-4">
                    {fb && (
                      <a
                        href={fb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:opacity-80 transition"
                        style={{
                          backgroundColor: footer_b_color
                            ? `${footer_b_color}20`
                            : checkout_b_color
                              ? `${checkout_b_color}20`
                              : "#f3f4f6",
                          color:
                            footer_link_color ||
                            checkout_link_color ||
                            btnColor,
                        }}
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                    {twitter && (
                      <a
                        href={twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:opacity-80 transition"
                        style={{
                          backgroundColor: footer_b_color
                            ? `${footer_b_color}20`
                            : checkout_b_color
                              ? `${checkout_b_color}20`
                              : "#f3f4f6",
                          color:
                            footer_link_color ||
                            checkout_link_color ||
                            btnColor,
                        }}
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:opacity-80 transition"
                        style={{
                          backgroundColor: footer_b_color
                            ? `${footer_b_color}20`
                            : checkout_b_color
                              ? `${checkout_b_color}20`
                              : "#f3f4f6",
                          color:
                            footer_link_color ||
                            checkout_link_color ||
                            btnColor,
                        }}
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:opacity-80 transition"
                        style={{
                          backgroundColor: footer_b_color
                            ? `${footer_b_color}20`
                            : checkout_b_color
                              ? `${checkout_b_color}20`
                              : "#f3f4f6",
                          color:
                            footer_link_color ||
                            checkout_link_color ||
                            btnColor,
                        }}
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {youtube && (
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:opacity-80 transition"
                        style={{
                          backgroundColor: footer_b_color
                            ? `${footer_b_color}20`
                            : checkout_b_color
                              ? `${checkout_b_color}20`
                              : "#f3f4f6",
                          color:
                            footer_link_color ||
                            checkout_link_color ||
                            btnColor,
                        }}
                      >
                        <Youtube size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                className="mt-8 pt-6 border-t text-center"
                style={{
                  borderColor: footer_b_color
                    ? `${footer_b_color}30`
                    : checkout_b_color
                      ? `${checkout_b_color}30`
                      : "#e5e7eb",
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color:
                      footer_text_color || checkout_text_color || fontColor,
                  }}
                >
                  © {new Date().getFullYear()} All Rights Reserved
                  <br />
                  Designed by{" "}
                  <a
                    href="https://funnelliner.com"
                    className="font-semibold hover:underline transition"
                    style={{
                      color:
                        footer_link_color || checkout_link_color || btnColor,
                    }}
                  >
                    Funmel Liner
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutOtp
        timeLeft={timeLeft}
        show={show}
        onClose={handleClose}
        customerPhone={customerPhone}
        resendLoading={resendLoading}
        onResendOtp={handleResendOtp}
      />
    </section>
  )
}

export default LandingOrder
