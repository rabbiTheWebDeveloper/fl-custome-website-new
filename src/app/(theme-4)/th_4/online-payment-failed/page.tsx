"use client"
import Link from "next/link"
import { XCircle, ArrowRight, RefreshCw, Home, ShoppingBag } from "lucide-react"

export default function OnlinePaymentFailed() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 py-20">
      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-red-50 dark:bg-red-950/20 blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-gray-100 dark:border-zinc-900 shadow-2xl shadow-black/5 dark:shadow-black/40 p-10 sm:p-12 text-center">
          {/* Icon badge */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900/40">
              <XCircle
                size={36}
                className="text-red-500 dark:text-red-400"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Label */}
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 dark:text-red-500 mb-3">
            Payment Failed
          </p>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight mb-4">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto mb-8">
            We couldn&apos;t process your payment. This could be due to
            insufficient funds, an expired card, or a temporary issue with your
            bank.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-zinc-700">
              What to do
            </span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
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
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center mt-0.5">
                  <span className="text-[9px] font-black text-gray-500 dark:text-zinc-500">
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform shadow-xl mb-3"
          >
            <RefreshCw size={14} />
            Try Again
          </Link>

          {/* Secondary CTAs */}
          <div className="flex gap-2">
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBag size={12} />
              Shop
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Home size={12} />
              Home
            </Link>
          </div>
        </div>

        {/* Help text below card */}
        <p className="text-center text-xs text-gray-400 dark:text-zinc-600 mt-6">
          Need help?{" "}
          <Link
            href="/"
            className="font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Contact support <ArrowRight size={10} className="inline" />
          </Link>
        </p>
      </div>
    </main>
  )
}
