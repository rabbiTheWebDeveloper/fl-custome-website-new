export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-5xl rounded-xl p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE - Image Section */}
          <div>
            {/* Main Image */}
            <div className="w-full h-[400px] bg-gray-200 rounded-lg" />

            {/* Thumbnail Images */}
            <div className="flex gap-3 mt-4">
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
            </div>
          </div>

          {/* RIGHT SIDE - Details Section */}
          <div className="space-y-4">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />

            {/* Price */}
            <div className="h-6 bg-gray-200 rounded w-1/3" />

            {/* Stock badge */}
            <div className="h-8 bg-gray-200 rounded w-1/2" />

            {/* Size Buttons */}
            <div className="flex gap-2 mt-4">
              <div className="w-12 h-10 bg-gray-200 rounded" />
              <div className="w-12 h-10 bg-gray-200 rounded" />
              <div className="w-12 h-10 bg-gray-200 rounded" />
              <div className="w-12 h-10 bg-gray-200 rounded" />
              <div className="w-12 h-10 bg-gray-200 rounded" />
            </div>

            {/* Quantity & Buttons */}
            <div className="flex gap-4 mt-6">
              <div className="w-28 h-12 bg-gray-200 rounded" />
              <div className="w-40 h-12 bg-gray-200 rounded" />
              <div className="w-40 h-12 bg-gray-200 rounded" />
            </div>

            {/* Description */}
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
