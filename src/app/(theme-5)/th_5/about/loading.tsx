export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-28 pb-24 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-12">
          <div className="h-3 w-12 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-3 w-3 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
        </div>

        {/* Hero skeleton */}
        <div className="mb-20 lg:mb-28">
          <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full mb-5" />
          <div className="space-y-4 max-w-3xl">
            <div className="h-16 sm:h-20 lg:h-24 bg-gray-100 dark:bg-zinc-900 rounded-2xl w-2/3" />
            <div className="h-16 sm:h-20 lg:h-24 bg-gray-100 dark:bg-zinc-900 rounded-2xl w-1/2" />
          </div>
          <div className="flex items-center gap-4 mt-8">
            <div className="w-12 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-4 bg-gray-100 dark:bg-zinc-900 rounded-full w-80" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20 lg:mb-28">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 sm:p-8 bg-gray-50 dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900"
            >
              <div className="w-11 h-11 bg-gray-200 dark:bg-zinc-800 rounded-full mb-4" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-800 rounded-xl mb-2" />
              <div className="h-3 w-14 bg-gray-100 dark:bg-zinc-900 rounded-full" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 mb-20 lg:mb-28">
          <div className="space-y-4">
            <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-8 w-full bg-gray-100 dark:bg-zinc-900 rounded-xl" />
            <div className="h-8 w-4/5 bg-gray-100 dark:bg-zinc-900 rounded-xl" />
            <div className="w-8 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full mt-6" />
          </div>
          <div className="bg-gray-50 dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 p-10 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 bg-gray-200 dark:bg-zinc-800 rounded-full ${i === 4 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </div>
        </div>

        {/* Values grid skeleton */}
        <div className="grid sm:grid-cols-2 gap-4 mb-20">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 sm:p-7 bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900"
            >
              <div className="flex-shrink-0 w-11 h-11 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
              <div className="flex-1 space-y-2.5 pt-1">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-full w-1/2" />
                <div className="h-3 bg-gray-100 dark:bg-zinc-900 rounded-full w-full" />
                <div className="h-3 bg-gray-100 dark:bg-zinc-900 rounded-full w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner skeleton */}
        <div className="bg-gray-100 dark:bg-zinc-900 rounded-[2.5rem] p-10 sm:p-14 lg:p-16 flex flex-col items-center gap-4">
          <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-10 w-80 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-12 w-36 bg-gray-300 dark:bg-zinc-700 rounded-full mt-2" />
        </div>
      </div>
    </div>
  )
}
