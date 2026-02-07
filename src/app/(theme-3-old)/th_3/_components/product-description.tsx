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
import { IProduct } from "../types/product"
import { ProductCartControls } from "./product/product-cart-controls"
import { ProductImageCarousel } from "./product/product-image-carousel"
const swatches = [
  {
    type: "color" as const,
    key: "colors",
    label: "Colors",
    options: [
      { label: "Black", color: "#000000", selected: true },
      { label: "Blue", color: "#ADD8E6" },
      { label: "Green", color: "#90EE90" },
      { label: "Pink", color: "#FFB6C1" },
      { label: "Yellow", color: "#FFFFE0" },
    ],
  },
  {
    type: "size" as const,
    key: "sizes",
    label: "Size",
    options: [
      { label: "XS", selected: true },
      { label: "S" },
      { label: "M" },
      { label: "L" },
      { label: "XL" },
    ],
  },
]
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

        <ProductImageCarousel
          images={[product.main_image ?? "", ...product.other_images]}
        />

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
          <ProductCartControls product={product} swatches={swatches} />

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
