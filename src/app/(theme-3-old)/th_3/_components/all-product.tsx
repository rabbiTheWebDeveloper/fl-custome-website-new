import { IProduct } from "../types/product"
import Pagination from "./pagination"
import { Fragment } from "react/jsx-runtime"
import { ProductCard } from "./products/product-card"

const AllProduct = ({
  products = [],
  totalPages,
}: {
  products: IProduct[]
  totalPages: number
}) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          All Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <Fragment key={product.id}>
              <ProductCard {...product} />
            </Fragment>
          ))}
        </div>
      </div>
      <Pagination totalPages={totalPages || 10} />
    </section>
  )
}

export default AllProduct
