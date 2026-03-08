import { XCircle, AlertTriangle, HelpCircle, ArrowLeft, RefreshCw, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentFailedRedesigned() {
  // Generate a random transaction reference
  const transactionRef = `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Top accent bar for visual hierarchy */}
        <div className="h-1.5 w-24 mx-auto mb-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full" />
        
        {/* Main card with refined shadows and border */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/80 dark:border-gray-800/80 rounded-3xl shadow-2xl p-8 md:p-10">
          
          {/* Header section with icon and status */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Animated icon container */}
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 p-4 rounded-2xl border border-red-200/50 dark:border-red-800/50 shadow-inner">
                <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" strokeWidth={1.75} />
              </div>
            </div>
            
            {/* Status badge */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 mb-4">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Transaction Declined
            </span>
            
            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
              Payment couldn't be processed
            </h1>
            
            {/* Descriptive message */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Your bank declined the transaction. No charges have been made.
            </p>
          </div>

          {/* Error details card - professional troubleshooting */}
          <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-200/80 dark:border-gray-700/80">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Common reasons
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {[
                "Insufficient funds in your account",
                "Temporary hold by your bank",
                "Incorrect CVV or expiration date",
                "Card not authorized for online transactions"
              ].map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="block w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

       
          {/* Footer links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to home
            </Link>
            
          
          </div>

          {/* Transaction reference (mock) */}
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
            Transaction reference: {transactionRef}
          </p>
        </div>
        
        {/* Trust badge */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          🔒 Secure connection • No funds were deducted
        </p>
      </div>
    </div>
  )
}