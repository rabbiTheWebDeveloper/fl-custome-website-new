"use client"

import Link from "next/link"
import { Button } from "../_components/ui/button"
import { CheckCircle2, ShoppingBag, ArrowLeft } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <main className="bg-[#F9F9F9] min-h-[80vh] flex items-center justify-center">
      <div className="container py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
                <CheckCircle2
                  className="w-14 h-14 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-green-200 animate-ping opacity-20" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-base md:text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
            Thank you for your order. We&apos;ve received your order and will
            process it shortly. You&apos;ll receive a confirmation soon.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base font-semibold rounded-xl gap-2"
            >
              <Link href="/shop">
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold rounded-xl gap-2"
            >
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
