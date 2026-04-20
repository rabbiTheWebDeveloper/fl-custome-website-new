import React from "react"
export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      {/* Progress Bar Skeleton */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl gap-4">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300" />
                      <div className="hidden sm:block w-12 h-4 bg-gray-300 rounded" />
                    </div>
                    {index < 2 && (
                      <div className="flex-1 h-1 bg-gray-300 rounded mx-2 sm:mx-4" />
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Contact Information Skeleton */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
            <div className="h-6 sm:h-8 w-1/3 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-20 bg-gray-200 rounded w-full" />
            <div className="h-14 bg-gray-200 rounded w-full" />
          </div>

          {/* Payment Method Skeleton */}
          <div className="space-y-4 bg-white rounded-2xl pb-5 p-4 sm:p-6">
            <div className="h-6 sm:h-8 w-1/3 bg-gray-300 rounded mb-4" />
            <div className="space-y-3">
              {Array(2)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg w-full" />
                ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton - Order Summary */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sticky top-4 sm:top-6">
            <div className="h-6 sm:h-8 w-1/3 bg-gray-300 rounded" />
            {/* Cart Items Skeleton */}
            <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-300 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Order Breakdown Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-300 rounded w-full mt-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
