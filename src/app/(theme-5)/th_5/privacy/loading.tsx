export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-full animate-pulse">
      {/* Banner Skeleton */}
      <div className="relative w-full">
        <div className="w-full h-[220px] md:h-[300px] bg-gray-300 rounded-lg" />

        {/* Overlay Skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 w-full text-center">
            <div className="space-y-2">
              <div className="h-8 md:h-10 bg-gray-400 rounded w-1/3 mx-auto" />{" "}
              {/* Title */}
              <div className="flex justify-center items-center gap-1 mt-2">
                <div className="h-4 w-10 bg-gray-400 rounded" />
                <div className="h-4 w-4 bg-gray-400 rounded" /> {/* Chevron */}
                <div className="h-4 w-16 bg-gray-400 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-12" />

      {/* About Content Skeleton */}
      <section>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  )
}
