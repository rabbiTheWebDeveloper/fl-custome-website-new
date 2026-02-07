"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"

// Shipping methods
// const shippingMethods = [
//   {
//     id: "standard",
//     name: "Standard Delivery",
//     description: "3-5 business days",
//     price: 120,
//     icon: Package,
//   },
//   {
//     id: "express",
//     name: "Express Delivery",
//     description: "1-2 business days",
//     price: 300,
//     icon: Truck,
//   },
//   {
//     id: "same-day",
//     name: "Same Day Delivery",
//     description: "Within 24 hours",
//     price: 500,
//     icon: Clock,
//   },
// ]

// Payment methods
const paymentMethods = [
  {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
    fees: 0,
    available: true,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: CreditCard,
    fees: 0,
    available: true,
  },
  {
    id: "mobile",
    name: "Mobile Banking",
    description: "bKash, Nagad, Rocket",
    icon: Smartphone,
    fees: 0,
    available: true,
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    description: "ShopHub Wallet, PayPal",
    icon: Wallet,
    fees: 0,
    available: true,
  },
]

const Checkout = () => {
  const router = useRouter()
  const { updateItem, removeItem } = useCart()
  const items = useCartStore((state) => state.items)
  const cartTotals = useCartStore((state) => state.totals)
  const [selectedPayment, setSelectedPayment] = useState("cash")

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  )
  const shippingCost = 0
  const tax = 0.05 // 5% tax
  const total = subtotal + shippingCost + tax - cartTotals

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        items: cart,
        shipping: selectedShipping,
        payment: selectedPayment,
        total,
        customer: formData,
        timestamp: new Date().toISOString(),
      }

      console.log("Order placed:", orderData)
      setIsProcessing(false)
      router.push(`/order-confirmation/${orderData.orderId}`)
    }, 2000)
  }

  // Check if form is valid
  const isFormValid = formData.firstName && formData.phone && formData.address

  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) {
      return undefined
    }
    return item.variants.map((v) => `${v.key}: ${v.value}`).join(", ")
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateItem(itemId, { quantity: newQuantity })
  }

  const handleRemoveProduct = async (itemId: string) => {
    await removeItem(itemId)
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
          ${
            index < 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
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
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="John"
                    required
                  />
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="+880 1XXX-XXXXXX"
                      required
                    />
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
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                      placeholder="House #123, Road #456, Mirpur"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-1 gap-3 sm:gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Special instructions, delivery notes, etc."
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#3bb77e]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-[#3bb77e] bg-[#3bb77e]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id
                            ? "border-[#3bb77e] bg-[#3bb77e]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {method.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPayment === "cash" && (
                <div className="mt-4 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 text-sm sm:text-base">
                        Cash on Delivery Instructions
                      </p>
                      <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                        Please keep exact change ready. Our delivery agent will
                        collect payment upon delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
                    className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.metadata?.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 pr-2">
                          <h4 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {formatVariants(item)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-1"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 sm:px-3 sm:py-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="px-2 py-1 sm:px-3 sm:py-1 font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 sm:px-3 sm:py-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={
                              item.quantity >=
                              (item.metadata?.maxQuantity ?? 10)
                            }
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-sm sm:text-base">
                            ৳
                            {(
                              (item.discountedPrice ?? item.price) *
                              item.quantity
                            ).toLocaleString()}
                          </div>
                          {item.discountedPrice &&
                            item.price > item.discountedPrice && (
                              <div className="text-xs sm:text-sm text-gray-400 line-through">
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
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Tax (5%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#3bb77e] text-sm sm:text-base">
                    <span>Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
                    <span>Total</span>
                    <span>৳{cartTotals.toLocaleString()}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Including all taxes and fees
                  </p>
                </div>
              </div>

              {/* Security Info */}
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg mb-4 sm:mb-6">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#3bb77e] flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Secure checkout</span> • Your
                  information is protected
                </span>
              </div>

              {/* Place Order Button */}
              <Link href="/order-successfull/123456">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid || isProcessing || cart.length === 0}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all ${
                    isFormValid && cart.length > 0
                      ? "bg-gradient-to-r from-green-600 to-[#3bb77e] hover:from-[#3bb77e] hover:to-[#3bb77e] text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="text-sm sm:text-base">
                        Processing...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        {cart.length === 0 ? "Cart is Empty" : "Place Order"}
                      </span>
                      {cart.length > 0 && (
                        <span className="ml-1 sm:ml-2 text-sm sm:text-base">
                          • ৳{total.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </Link>
              {/* Return Policy */}
              <div className="mt-3 sm:mt-4 text-center">
                <Link
                  href="/return-policy"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-[#3bb77e] transition-colors"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  30-Day Return Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

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
