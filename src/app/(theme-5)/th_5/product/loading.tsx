export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image Skeleton */}
        <div className="w-full h-[420px] bg-gray-200 dark:bg-gray-700 rounded-xl" />

        {/* Product Details Skeleton */}
        <div className="space-y-4">
          {/* Stock Status */}
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Product Name */}
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Price */}
          <div className="flex gap-3">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Cart Controls */}
          <div className="flex gap-3 mt-4">
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>

          {/* Social Share */}
          <div className="flex gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-10">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-10/12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
