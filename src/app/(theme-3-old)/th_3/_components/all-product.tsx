import { IProduct } from "../types/product"
import Pagination from "./pagination"
import { ProductCard } from "./products/product-card"
import React from "react"

const AllProduct = ({
  products,
  totalPages,
}: {
  products: IProduct[]
  totalPages: number
}) => {
  return (
      <section className="py-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          All Products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md
                         hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination totalPages={totalPages || 10} />
    </section>
  )
}

export default AllProduct
