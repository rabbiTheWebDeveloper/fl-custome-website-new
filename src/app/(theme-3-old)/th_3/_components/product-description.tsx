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

const ProductDescription = () => {
  const colorFromAPI = "#3BB77E" // sample theme color

  const sampleProduct = {
    product_name: "Sample Product",
    product_qty: 10,
    discounted_price: 1200,
    price: 1500,
    short_description: "<p>This is a short description of the product.</p>",
    long_description:
      "<p>This is a detailed long description of the product.</p>",
    main_image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    variations: [
      {
        id: 1,
        key: "Color",
        values: ["Red", "Blue", "Green"],
      },
      {
        id: 2,
        key: "Size",
        values: ["S", "M", "L"],
      },
    ],
  }

  const relatedProducts = [
    {
      id: 1,
      product_name: "Related Product 1",
      discounted_price: 800,
      price: 1000,
      main_image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      slug: "related-1",
    },
    {
      id: 2,
      product_name: "Related Product 2",
      discounted_price: 900,
      price: 1200,
      main_image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      slug: "related-2",
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-center items-center">
          <Image
            src={sampleProduct.main_image}
            alt={sampleProduct.product_name}
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h4
            className={
              sampleProduct.product_qty < 1
                ? "text-red-500 font-bold flex items-center gap-1"
                : "text-green-600 font-bold flex items-center gap-1"
            }
          >
            {sampleProduct.product_qty > 0 ? (
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
            {sampleProduct.product_name}
          </h3>
          <h3 className="text-xl font-semibold">
            ৳ {sampleProduct.discounted_price}{" "}
            {sampleProduct.price > sampleProduct.discounted_price && (
              <span className="line-through text-gray-500 ml-2">
                ৳ {sampleProduct.price}
              </span>
            )}
          </h3>

          {/* Short Description */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: sampleProduct.short_description,
            }}
          />

          {/* Variations */}
          {sampleProduct.variations.length > 0 && (
            <div className="space-y-4">
              {sampleProduct.variations.map((attr) => (
                <div key={attr.id}>
                  <h5 className="font-semibold mb-2">{attr.key}</h5>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val, idx) => (
                      <span
                        key={idx}
                        className="cursor-pointer px-3 py-1 rounded-lg border border-gray-300 hover:bg-green-500 hover:text-white transition"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sampleProduct.long_description }}
        />
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6" style={{ color: colorFromAPI }}>
          Related Products
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <Link
              key={product?.id}
              href={`/details/${product.slug}?id=${product.id}`}
            >
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col">
                <div className="h-40 mb-4 flex items-center justify-center">
                  <Image
                    src={product.main_image}
                    alt={product.product_name}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <h5 className="text-sm font-medium mb-2 line-clamp-2">
                  {product.product_name}
                </h5>
                <div className="font-bold text-green-500 text-lg">
                  ৳ {product.discounted_price}{" "}
                  {product.price > product.discounted_price && (
                    <span className="text-gray-400 line-through text-sm ml-1">
                      ৳ {product.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDescription
