import { XCircle } from "lucide-react"
import Link from "next/link"

export default function OnlinePaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
        {/* Icon */}
        <XCircle className="mx-auto w-16 h-16 text-red-600 dark:text-red-400 mb-4" />

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Failed
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We were unable to process your payment. Please try again or use a
          different payment method.
        </p>

        {/* Retry Button */}
        <Link
          href="/checkout"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
        >
          Retry Payment
        </Link>

        {/* Optional: Back to Home */}
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
