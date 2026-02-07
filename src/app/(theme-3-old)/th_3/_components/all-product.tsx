import Image from "next/image"
import Link from "next/link"
import { IProduct } from "../types/product"
import Pagination from "./pagination"

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
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <Link
                href={`/product/${product.slug}?id=${product.id}`}
                className="relative w-full aspect-square"
              >
                <Image
                  src={
                    product?.wp_product_image_url || product?.main_image || ""
                  }
                  alt={product?.product_name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>

              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-sm sm:text-base font-semibold mb-1 truncate">
                  <Link href={`/product/${product?.id}?name=${product?.slug}`}>
                    {product?.product_name}
                  </Link>
                </h4>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600 font-bold">
                    ৳{product.discounted_price}
                  </span>
                  {product.price > product.discounted_price && (
                    <span className="text-gray-400 line-through text-sm">
                      ৳{product.price}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    product?.product_qty > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  } mb-3`}
                >
                  {product?.product_qty > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <div className="mt-auto flex gap-2">
                  <button
                    className={`flex-1 border-2 rounded-md py-1 text-sm font-semibold transition ${
                      product?.product_qty > 0
                        ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={product?.product_qty === 0}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={`flex-1 rounded-md py-1 text-sm font-semibold text-white transition ${
                      product?.product_qty > 0
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={product?.product_qty === 0}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination totalPages={totalPages || 10} />
    </section>
  )
}

export default AllProduct
