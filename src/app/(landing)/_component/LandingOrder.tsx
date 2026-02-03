"use client"
import {
  ShoppingCart,
  Banknote,
  CreditCard,
  Shield,
  Truck,
  Plus,
  Minus,
  Check,
} from "lucide-react"
import { useState, useEffect, useRef, CSSProperties } from "react"

interface ProductVariant {
  id: number
  product_id: number
  variant: string
  price: number
  quantity: number
  media?: string
  code?: string
  description?: string | null
}

interface SelectedVariant {
  id: number
  variant: string
  price: number
  quantity: number
  media?: string
}

interface ProductAttribute {
  id: string
  key: string
  values: string[]
}

interface ProductData {
  id: number
  product_name: string
  product_code: string
  price: number
  discount: number
  discounted_price: number
  delivery_charge: string
  inside_dhaka: number
  outside_dhaka: number
  short_description?: string
  long_description?: string
  main_image?: string
  wp_product_image_url?: string
  attributes?: ProductAttribute[] | null
  variations?: ProductVariant[]
  product_qty: number
}

interface LandingOrderProps {
  product: ProductData
  backgroundColor: string
  fontColor: string
  btnColor: string
  btnTextColor: string
  order_title?: string
  checkout_button_text?: string
  showShippingOptions?: boolean
}

interface OrderFormData {
  name: string
  phone: string
  address: string
  note: string
  deliveryArea: string
}

const LandingOrder = ({
  product,
  backgroundColor,
  fontColor,
  btnColor,
  btnTextColor,
  order_title = "Your Order",
  checkout_button_text = "Place Order",
  showShippingOptions = true,
}: LandingOrderProps) => {
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "bkash">("cod")
  const [deliveryArea, setDeliveryArea] = useState<string>("inside")
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    phone: "",
    address: "",
    note: "",
    deliveryArea: "inside",
  })

  // For products WITHOUT variants
  const [simpleProductQuantity, setSimpleProductQuantity] = useState<number>(1)

  // For products WITH variants
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    () => {
      if (product.variations && product.variations.length > 0) {
        return product.variations.map((variant) => ({
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

  const [prevProductId, setPrevProductId] = useState(product.id)

  if (product.id !== prevProductId) {
    setPrevProductId(product.id)
    if (product.variations && product.variations.length > 0) {
      const initialVariants = product.variations.map((variant) => ({
        id: variant.id,
        variant: variant.variant,
        price: variant.price,
        quantity: 0,
        media: variant.media,
      }))
      setSelectedVariants(initialVariants)
    } else {
      setSelectedVariants([])
    }
  }

  // Calculate totals
  const calculateTotals = () => {
    if (product.variations && product.variations.length > 0) {
      // For products WITH variants
      const subtotal = selectedVariants.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const shippingCharge =
        deliveryArea === "inside"
          ? product.inside_dhaka || 0
          : product.outside_dhaka || 0
      const isFreeShipping = product.delivery_charge === "free"
      const total = subtotal + (isFreeShipping ? 0 : shippingCharge)

      return { subtotal, shippingCharge, total, isFreeShipping }
    } else {
      // For products WITHOUT variants
      const price = product.discounted_price || product.price
      const subtotal = price * simpleProductQuantity
      const shippingCharge =
        deliveryArea === "inside"
          ? product.inside_dhaka || 0
          : product.outside_dhaka || 0
      const isFreeShipping = product.delivery_charge === "free"
      const total = subtotal + (isFreeShipping ? 0 : shippingCharge)

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
          const availableStock =
            product.variations?.find((v) => v.id === variantId)?.quantity || 0
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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "deliveryArea") {
      setDeliveryArea(value)
    }
  }

  // Handle place order
  const handlePlaceOrder = () => {
    const orderData = {
      ...formData,
      productId: product.id,
      productName: product.product_name,
      productCode: product.product_code,
      ...(product.variations && product.variations.length > 0
        ? { variants: selectedVariants.filter((v) => v.quantity > 0) }
        : { quantity: simpleProductQuantity }),
      subtotal,
      shippingCharge: isFreeShipping ? 0 : shippingCharge,
      total,
      paymentMethod: selectedPayment,
      deliveryArea,
    }

    console.log("Order placed:", orderData)

    // Validate if any items are selected
    const hasItems =
      product.variations && product.variations.length > 0
        ? selectedVariants.some((v) => v.quantity > 0)
        : simpleProductQuantity > 0

    if (!hasItems) {
      alert("Please add at least one item to your order!")
      return
    }

    // Here you would typically send this to your backend
    alert(`Order placed for ${product.product_name}! Total: ৳${total}`)
  }

  // Check if any variant is selected (for products with variants)
  const hasSelectedVariants = selectedVariants.some((v) => v.quantity > 0)

  return (
    <section className="py-12 min-h-screen" style={{ backgroundColor }}>
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
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src={getProductImage()}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: fontColor }}
                  >
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.product_code}
                  </p>
                </div>
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* PRODUCT WITH VARIANTS */}
              {product.variations && product.variations.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: fontColor }}
                    >
                      Select Variants
                    </h4>
                    <span className="text-sm text-gray-600">
                      {selectedVariants.filter((v) => v.quantity > 0).length}{" "}
                      selected
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedVariants.map((variant) => {
                      const availableStock =
                        product.variations?.find((v) => v.id === variant.id)
                          ?.quantity || 0
                      return (
                        <div
                          key={variant.id}
                          className={`p-4 border rounded-xl transition-all ${variant.quantity > 0 ? "ring-2 ring-offset-1" : "hover:border-gray-400"}`}
                          style={
                            {
                              borderColor:
                                variant.quantity > 0 ? btnColor : "#e5e7eb",
                              "--tw-ring-color": btnColor,
                            } as CSSProperties
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden">
                                <img
                                  src={getProductImage(variant.media)}
                                  alt={variant.variant}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold">{variant.variant}</p>
                                  {variant.quantity > 0 && (
                                    <Check
                                      size={16}
                                      className="text-green-600"
                                    />
                                  )}
                                </div>
                                <p
                                  className="font-bold text-lg mt-1"
                                  style={{ color: btnColor }}
                                >
                                  ৳ {variant.price}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Available: {availableStock} units
                                </p>
                              </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleVariantQuantityChange(variant.id, -1)
                                  }
                                  disabled={variant.quantity <= 0}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    variant.quantity > 0
                                      ? "bg-gray-200 hover:bg-gray-300"
                                      : "bg-gray-100 cursor-not-allowed"
                                  }`}
                                >
                                  <Minus size={16} />
                                </button>

                                <span className="text-lg font-semibold w-8 text-center">
                                  {variant.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    handleVariantQuantityChange(variant.id, 1)
                                  }
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
                                <p className="font-bold">
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
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">Standard Product</p>
                      <p
                        className="font-bold text-2xl mt-2"
                        style={{ color: btnColor }}
                      >
                        ৳ {product.discounted_price || product.price}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
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
                          <span className="text-2xl font-bold">
                            {simpleProductQuantity}
                          </span>
                          <span className="text-xs text-gray-600 mt-1">
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

                      <p className="font-bold text-lg">
                        Total: ৳{" "}
                        {(product.discounted_price || product.price) *
                          simpleProductQuantity}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Subtotal</p>
                  <p className="font-semibold">৳ {subtotal}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <p className="text-gray-700">Shipping</p>
                  </div>
                  <p
                    className={`font-semibold ${isFreeShipping ? "text-green-600" : ""}`}
                  >
                    {isFreeShipping ? "Free" : `৳ ${shippingCharge}`}
                  </p>
                </div>

                {product.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">Discount</p>
                    <p className="font-semibold text-green-600">
                      -{product.discount}%
                    </p>
                  </div>
                )}

                <div className="h-px bg-gray-200 my-3"></div>

                <div className="flex justify-between items-center pt-3">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-2xl font-bold" style={{ color: btnColor }}>
                    ৳ {total}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Card (same as before) */}
            {/* ... Keep the same payment method section from previous code ... */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h3
                className="text-xl font-bold mb-6 pb-4 border-b"
                style={{ color: fontColor }}
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
                        selectedPayment === "cod" ? btnColor : "#e5e7eb",
                      "--tw-ring-color": btnColor,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
                        <Banknote size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">Cash on Delivery</p>
                        <p className="text-gray-600 text-sm">
                          Pay after receiving your order
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === "cod" ? "" : "border-gray-300"}`}
                      style={{
                        backgroundColor:
                          selectedPayment === "cod" ? btnColor : "transparent",
                        borderColor:
                          selectedPayment === "cod" ? btnColor : "#d1d5db",
                      }}
                    >
                      {selectedPayment === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Online Payment */}
              <div>
                <button
                  onClick={() => setSelectedPayment("bkash")}
                  className={`w-full p-4 rounded-xl border-2 transition-all mb-4 ${selectedPayment === "bkash" ? "ring-2 ring-offset-2" : "hover:border-gray-400"}`}
                  style={
                    {
                      borderColor:
                        selectedPayment === "bkash" ? btnColor : "#e5e7eb",
                      "--tw-ring-color": btnColor,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold"
                        style={{ backgroundColor: btnColor }}
                      >
                        bK
                      </div>
                      <div className="text-left">
                        <p className="font-bold">bKash Payment</p>
                        <p className="text-gray-600 text-sm">
                          Secure online payment
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === "bkash" ? "" : "border-gray-300"}`}
                      style={{
                        backgroundColor:
                          selectedPayment === "bkash"
                            ? btnColor
                            : "transparent",
                        borderColor:
                          selectedPayment === "bkash" ? btnColor : "#d1d5db",
                      }}
                    >
                      {selectedPayment === "bkash" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-6 pt-6 border-t flex items-start gap-3">
                <Shield className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p className="text-gray-600 text-sm">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Billing Details */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg sticky top-8">
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: fontColor }}
              >
                Billing Details
              </h3>

              <div className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: fontColor }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition"
                    style={
                      {
                        borderColor: fontColor,
                        "--tw-ring-color": btnColor,
                      } as CSSProperties
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: fontColor }}
                  >
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition"
                    style={
                      {
                        borderColor: fontColor,
                        "--tw-ring-color": btnColor,
                      } as CSSProperties
                    }
                    required
                  />
                </div>

                {showShippingOptions && product.delivery_charge !== "free" && (
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: fontColor }}
                    >
                      Delivery Area *
                    </label>
                    <select
                      name="deliveryArea"
                      value={formData.deliveryArea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition"
                      style={
                        {
                          borderColor: fontColor,
                          "--tw-ring-color": btnColor,
                        } as CSSProperties
                      }
                    >
                      <option value="inside">
                        Inside Dhaka (৳{product.inside_dhaka || 0})
                      </option>
                      <option value="outside">
                        Outside Dhaka (৳{product.outside_dhaka || 0})
                      </option>
                    </select>
                  </div>
                )}

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: fontColor }}
                  >
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House #, Road #, Area, City"
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                    style={
                      {
                        borderColor: fontColor,
                        "--tw-ring-color": btnColor,
                      } as CSSProperties
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: fontColor }}
                  >
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Add any special instructions for delivery"
                    rows={2}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                    style={
                      {
                        borderColor: fontColor,
                        "--tw-ring-color": btnColor,
                      } as CSSProperties
                    }
                  />
                </div>

                {/* Order Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-3">Order Summary:</p>

                  {product.variations && product.variations.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVariants
                        .filter((v) => v.quantity > 0)
                        .map((variant, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {product.product_name} - {variant.variant} ×{" "}
                              {variant.quantity}
                            </span>
                            <span>৳ {variant.price * variant.quantity}</span>
                          </div>
                        ))}
                      {selectedVariants.filter((v) => v.quantity > 0).length ===
                        0 && (
                        <p className="text-sm text-gray-500">
                          No items selected
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span>
                        {product.product_name} × {simpleProductQuantity}
                      </span>
                      <span>৳ {subtotal}</span>
                    </div>
                  )}

                  <div className="h-px bg-gray-300 my-3"></div>

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span style={{ color: btnColor }}>৳ {total}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={
                  !formData.name ||
                  !formData.phone ||
                  !formData.address ||
                  (product.variations &&
                    product.variations.length > 0 &&
                    !hasSelectedVariants)
                }
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  background: btnColor,
                  color: btnTextColor,
                }}
              >
                <ShoppingCart size={24} />
                {checkout_button_text} ৳ {total}
              </button>

              {/* Additional Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  <p>Estimated delivery: 2-5 business days</p>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <p>Secure SSL encrypted payment</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} All Rights Reserved
                  <br />
                  Designed by{" "}
                  <a
                    href="https://funnelliner.com"
                    className="font-semibold hover:underline transition"
                    style={{ color: btnColor }}
                  >
                    Funmel Liner
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingOrder
