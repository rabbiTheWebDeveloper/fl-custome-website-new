export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Banner */}
      <div className="h-64 w-full bg-gray-200 rounded-xl animate-pulse" />

      {/* Categories */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Promo Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="border rounded-xl p-3 space-y-3">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />

            <div className="flex justify-between gap-2">
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
