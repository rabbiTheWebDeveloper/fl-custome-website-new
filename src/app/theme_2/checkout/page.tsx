import { Metadata } from "next"
import { CheckoutForm } from "./checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
}

export default function CheckoutPage() {
  return (
    <main className="bg-[#F9F9F9]">
      <div className="container py-16 md:pt-24 md:pb-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Checkout</h1>
          <p className="text-base max-w-3xl md:text-[22px] leading-[140%] mx-auto">
            Almost there — complete your order securely.
          </p>
        </div>

        {/* Checkout Form */}
        <CheckoutForm />
      </div>
    </main>
  )
}
