import Image from "next/image"
import Link from "next/link"
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  XCircle,
  Facebook,
  Twitter,
  Smartphone,
} from "lucide-react"
import { IProduct } from "../../types/product"
import { ProductCartControls } from "./product-cart-controls"

const ProductDescription = ({ product }: { product: IProduct | null }) => {
  const colorFromAPI = "#3BB77E" // sample theme color

  if (!product) {
    return <div className="p-10 text-center">Loading product...</div>
  }

  // Use product.relatedProducts if available, otherwise empty array
  const relatedProducts = product?.relatedProducts || []

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-center items-center">
          {product.main_image ? (
            <Image
              src={product.main_image}
              alt={product.product_name}
              width={400}
              height={400}
              className="object-contain"
            />
          ) : (
            <div className="w-[400px] h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h4
            className={
              product.product_qty < 1
                ? "text-red-500 font-bold flex items-center gap-1"
                : "text-green-600 font-bold flex items-center gap-1"
            }
          >
            {product.product_qty > 0 ? (
              <>
                <CheckCircle size={18} /> In Stock
              </>
            ) : (
              <>
                <XCircle size={18} /> Out of Stock
              </>
            )}
          </h4>

          <h3 className="text-2xl font-bold" style={{ color: colorFromAPI }}>
            {product.product_name}
          </h3>
          <h3 className="text-xl font-semibold">
            ৳ {product.discounted_price}{" "}
            {product.price > product.discounted_price && (
              <span className="line-through text-gray-500 ml-2">
                ৳ {product.price}
              </span>
            )}
          </h3>

          {/* Short Description */}
          {product.short_description && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.short_description,
              }}
            />
          )}

          {/* Variations */}

          <ProductCartControls product={product} />

          {Array.isArray(product.variations) &&
            product.variations.length > 0 && (
              <div className="space-y-4">
                {product.variations.map(
                  (attr: {
                    id: number
                    key?: string
                    name?: string
                    values: (string | { label: string })[]
                  }) => (
                    <div key={attr.id}>
                      <h5 className="font-semibold mb-2">
                        {attr.key || attr.name}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(attr.values) &&
                          attr.values.map(
                            (val: string | { label: string }, idx: number) => (
                              <span
                                key={idx}
                                className="cursor-pointer px-3 py-1 rounded-lg border border-gray-300 hover:bg-green-500 hover:text-white transition"
                              >
                                {typeof val === "string"
                                  ? val
                                  : val.label || JSON.stringify(val)}
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          {/* Add to Cart Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              <ShoppingCart size={20} /> ADD TO CART
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition">
              <CreditCard size={20} /> Buy Now
            </button>
          </div>

          {/* Social Share */}
          <div className="flex gap-4 mt-4">
            <div className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition">
              <Facebook size={20} />
            </div>
            <div className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition">
              <Smartphone size={20} /> {/* Placeholder for WhatsApp */}
            </div>
            <div className="p-2 bg-sky-400 rounded-full text-white hover:bg-sky-500 transition">
              <Twitter size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="border-b border-gray-300 mb-4">
          <button className="px-4 py-2 border-b-2 border-green-500 text-green-500 font-semibold">
            Description
          </button>
        </div>
        {product.long_description && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.long_description }}
          />
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3
            className="text-xl font-bold mb-6"
            style={{ color: colorFromAPI }}
          >
            Related Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/details/${p.slug}?id=${p.id}`}>
                <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col">
                  <div className="h-40 mb-4 flex items-center justify-center">
                    {p.main_image ? (
                      <Image
                        src={p.main_image}
                        alt={p.product_name}
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-[150px] h-[150px] bg-gray-200"></div>
                    )}
                  </div>
                  <h5 className="text-sm font-medium mb-2 line-clamp-2">
                    {p.product_name}
                  </h5>
                  <div className="font-bold text-green-500 text-lg">
                    ৳ {p.discounted_price}{" "}
                    {p.price > p.discounted_price && (
                      <span className="text-gray-400 line-through text-sm ml-1">
                        ৳ {p.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDescription
