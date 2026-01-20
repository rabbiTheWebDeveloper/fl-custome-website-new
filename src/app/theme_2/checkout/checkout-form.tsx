"use client"

import { useState } from "react"
import { Button } from "../_components/ui/button"
import { Input } from "../_components/ui/input"
import { Textarea } from "../_components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CartItem } from "../_components/carts/cart-item"
import { cn } from "@/lib/utils"
import Image from "next/image"

const DEFAULT_FORM_DATA = {
  fullName: "",
  phone: "",
  deliveryAddress: "",
  orderNote: "",
}

const DEFAULT_SHIPPING_METHOD = "inside-dhaka"
const DEFAULT_PAYMENT_METHOD = "bkash"
const DEFAULT_QUANTITY = 1

export function CheckoutForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const [shippingMethod, setShippingMethod] = useState(DEFAULT_SHIPPING_METHOD)
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD)
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Checkout:", {
      formData,
      shippingMethod,
      paymentMethod,
      quantity,
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleRemoveProduct = () => {
    // Handle product removal
    console.log("Product removed")
  }

  const productPrice = 500
  const shippingCost =
    shippingMethod === "inside-dhaka"
      ? 80
      : shippingMethod === "around-dhaka"
        ? 110
        : 150
  const subtotal = productPrice * quantity
  const total = subtotal + shippingCost

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Billing Details */}
          <div className="space-y-6 bg-white rounded-2xl pb-5">
            <h2 className="text-lg md:text-xl font-bold p-5 border-b">
              Billing Details
            </h2>

            <div className="space-y-4 px-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-6 text-base"
                  required
                />
              </div>
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block font-medium mb-2">
                  Phone number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+880123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-6 text-base"
                  required
                />
              </div>
              {/* Delivery Address */}
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="block font-medium mb-2"
                >
                  Delivery Address
                </label>
                <Input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  type="text"
                  placeholder="Write here"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-6 text-base"
                  required
                />
              </div>
              {/* Order Note */}
              <div>
                <label htmlFor="orderNote" className="block font-medium mb-2">
                  Order Note(Optional)
                </label>
                <Textarea
                  id="orderNote"
                  name="orderNote"
                  placeholder="Write here"
                  value={formData.orderNote}
                  onChange={handleChange}
                  className="w-full min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="space-y-6 bg-white rounded-2xl pb-5">
            <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
              Shipping method
            </h3>
            <div className="px-5">
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="gap-0 rounded-xl border overflow-hidden divide-y"
              >
                <label
                  htmlFor="inside-dhaka"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                    shippingMethod === "inside-dhaka" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="inside-dhaka" id="inside-dhaka" />
                    <span className="text-[#595959]">Inside Dhaka</span>
                  </div>
                  <span className="font-semibold">৳80.00</span>
                </label>

                <label
                  htmlFor="around-dhaka"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                    shippingMethod === "around-dhaka" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="around-dhaka" id="around-dhaka" />
                    <span className="text-[#595959]">Around Dhaka</span>
                  </div>
                  <span className="font-semibold">৳110.00</span>
                </label>

                <label
                  htmlFor="outside-dhaka"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between md:text-lg cursor-pointer text-sm",
                    shippingMethod === "outside-dhaka" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="outside-dhaka" id="outside-dhaka" />
                    <span className="text-[#595959]">Outside Dhaka</span>
                  </div>
                  <span className="font-semibold">৳150.00</span>
                </label>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Right Column - Your Order */}
        <div className="space-y-6">
          {/* Your Order Container */}
          <div className="space-y-6 bg-white rounded-2xl pb-5">
            <h2 className="text-lg md:text-xl font-bold p-5 border-b">
              Your Order
            </h2>

            <div className="px-5 space-y-6">
              {/* Product Item */}
              <CartItem
                id="1"
                name="Product Name"
                size="L"
                price={productPrice}
                quantity={quantity}
                image="/temp/temp-slider-1.png"
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveProduct}
              />

              {/* Order Summary */}
              <div className="rounded-xl border overflow-hidden divide-y">
                <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    ঢাকার বাইরে: ৳{shippingCost}
                  </span>
                </div>
                <div className="flex justify-between text-lg px-4 py-2 max-md:text-sm">
                  <span>Total</span>
                  <span className="font-bold">৳{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6 bg-white rounded-2xl pb-5">
            <h3 className="text-lg md:text-xl font-bold mb-4 p-5 border-b">
              Payment Methhod
            </h3>
            <div className="px-5">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="gap-0 rounded-xl border overflow-hidden divide-y"
              >
                <label
                  htmlFor="sslcommerz"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between text-lg cursor-pointer",
                    paymentMethod === "sslcommerz" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="sslcommerz" id="sslcommerz" />
                    <span className="text-[#595959] max-md:text-sm">
                      SSLCOMMERZ(Free Delivery)
                    </span>
                  </div>
                  <figure>
                    <Image
                      src="/sslcommerz.png"
                      alt="SSLCommerz"
                      width="111"
                      height="24"
                    />
                  </figure>
                </label>

                <label
                  htmlFor="cash-on-delivery"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between text-lg cursor-pointer",
                    paymentMethod === "cash-on-delivery" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="cash-on-delivery"
                      id="cash-on-delivery"
                    />
                    <span className="text-[#595959] max-md:text-sm">
                      Cash on delivery
                    </span>
                  </div>
                </label>

                <label
                  htmlFor="bkash"
                  className={cn(
                    "px-4 py-2 flex items-center justify-between text-lg cursor-pointer",
                    paymentMethod === "bkash" && "bg-[#F6E5FF]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <span className="text-[#595959] max-md:text-sm">
                      bKash(Free Delivery)
                    </span>
                  </div>
                  <figure>
                    <Image
                      src="/bkash.png"
                      alt="BKash"
                      width="68"
                      height="24"
                    />
                  </figure>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Place Order Button */}
          <Button type="submit" className="w-full h-12 text-base rounded-2xl">
            Place Order
          </Button>
        </div>
      </div>
    </form>
  )
}
