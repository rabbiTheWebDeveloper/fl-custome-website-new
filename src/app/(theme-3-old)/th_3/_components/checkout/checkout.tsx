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
                    className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${selectedPayment === method.id
                      ? "border-[#3bb77e] bg-[#3bb77e]"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id
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
                  <span className="font-medium">৳{subtotal.toLocaleString()}</span>
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
                    <span>৳{total.toLocaleString()}</span>
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
              <Link href="/order-successfull/123456" className="block">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid || isProcessing || items.length === 0}
                  className={`w-full py-3.5 sm:py-4 rounded-lg font-semibold text-base transition-all duration-200 ${isFormValid && items.length > 0
                      ? "bg-gradient-to-r from-[#3bb77e] to-green-600 hover:from-green-600 hover:to-[#3bb77e] text-white shadow-md hover:shadow-lg"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {isProcessing ? (
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
                          ৳{total.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </Link>

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
