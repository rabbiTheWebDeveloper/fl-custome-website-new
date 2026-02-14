export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Mobile Sticky Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sticky top-24 space-y-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />

              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
                    />
                  ))}
                </div>
              ))}

              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-5 w-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Desktop Toolbar */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex gap-3">
                  <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Mobile Stats Bar */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-lg shadow p-3 mb-4 flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 flex flex-col gap-3"
                >
                  <div className="h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
