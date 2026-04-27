"use client"
import Link from "next/link"
import { XCircle, ArrowRight, RefreshCw, Home, ShoppingBag } from "lucide-react"

export default function OnlinePaymentFailed() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 p-10 sm:p-12 text-center">
          {/* Icon badge */}
          <div className="mx-auto w-16 h-16 mb-8 flex items-center justify-center border border-red-200 bg-red-50">
            <XCircle size={32} className="text-red-500" strokeWidth={1.5} />
          </div>

          {/* Label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-3">
            Payment Failed
          </p>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase text-black leading-tight mb-4">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto mb-8">
            We couldn&apos;t process your payment. This could be due to
            insufficient funds, an expired card, or a temporary issue with your
            bank.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              What to do
            </span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          {/* Tips */}
          <div className="text-left space-y-3 mb-8">
            {[
              "Check your card details and try again",
              "Ensure your card has sufficient balance",
              "Try a different payment method",
              "Contact your bank if the issue persists",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-gray-100 border border-gray-200 flex items-center justify-center mt-0.5">
                  <span className="text-[9px] font-bold text-gray-500">
                    {i + 1}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed uppercase tracking-wider">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors mb-3"
          >
            <RefreshCw size={14} />
            Try Again
          </Link>

          {/* Secondary CTAs */}
          <div className="flex gap-2">
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:border-black transition-colors"
            >
              <ShoppingBag size={12} />
              Shop
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:border-black transition-colors"
            >
              <Home size={12} />
              Home
            </Link>
          </div>
        </div>

        {/* Help text below card */}
        <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest">
          Need help?{" "}
          <Link
            href="/"
            className="font-bold text-black hover:underline transition-colors"
          >
            Contact support <ArrowRight size={10} className="inline" />
          </Link>
        </p>
      </div>
    </main>
  )
}
