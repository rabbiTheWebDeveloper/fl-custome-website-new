export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <section className="w-full py-12 bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-3 h-12 w-12 bg-gray-200 rounded-full" />
          <div className="h-8 w-72 bg-gray-200 rounded mx-auto mb-3" />
          <div className="h-4 w-80 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Order Info Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-32 bg-gray-300 rounded" />
              </li>
            ))}
          </ul>
        </div>

        {/* Order Details Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </th>
                  <th className="py-3 text-right">
                    <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded border" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-gray-200 rounded" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))}

                {/* Shipping Row */}
                <tr className="border-t">
                  <td className="py-3">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                  </td>
                </tr>

                {/* Total Row */}
                <tr className="border-t">
                  <td className="py-4">
                    <div className="h-5 w-24 bg-gray-300 rounded" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="h-5 w-28 bg-gray-300 rounded ml-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
