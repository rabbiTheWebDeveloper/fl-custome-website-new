import Image from "next/image";
import Link from "next/link";
import React from "react";

const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    brand: "SonicBeats",
    price: 2999,
    discounted_price: 1999,
    discount_percentage: 33,
    qty: 15,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    rating: 4.5,
    reviews: 128,
    tags: ["Best Seller", "Wireless"],
    description: "Noise cancelling over-ear headphones with 30hr battery",
    colors: ["#000000", "#3b82f6", "#ef4444"],
    isNew: true,
  },
  {
    id: 2,
    name: "Ultra Slim Laptop Pro",
    slug: "ultra-slim-laptop-pro",
    brand: "TechNova",
    price: 89999,
    discounted_price: 74999,
    discount_percentage: 17,
    qty: 8,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w-800&h=800&fit=crop",
    rating: 4.7,
    reviews: 89,
    tags: ["Hot Deal", "Limited Stock"],
    description: "13-inch laptop with 16GB RAM, 512GB SSD",
    colors: ["#1f2937", "#f3f4f6"],
    isNew: false,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    brand: "EcoWear",
    price: 1200,
    discounted_price: 899,
    discount_percentage: 25,
    qty: 0,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    rating: 4.2,
    reviews: 45,
    tags: ["Eco Friendly", "Sustainable"],
    description: "100% organic cotton, unisex fit",
    colors: ["#ffffff", "#000000", "#dc2626", "#2563eb"],
    isNew: true,
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    brand: "FitTrack",
    price: 6999,
    discounted_price: 5499,
    discount_percentage: 21,
    qty: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    rating: 4.4,
    reviews: 156,
    tags: ["Waterproof", "Heart Rate"],
    description: "Track workouts, sleep, and daily activities",
    colors: ["#000000", "#0ea5e9", "#10b981"],
    isNew: false,
  },
  {
    id: 5,
    name: "Premium Coffee Beans",
    slug: "premium-coffee-beans",
    brand: "BeanBliss",
    price: 1200,
    discounted_price: 999,
    discount_percentage: 17,
    qty: 50,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
    rating: 4.8,
    reviews: 203,
    tags: ["Organic", "Arabica"],
    description: "Single origin Colombian coffee beans",
    colors: [],
    isNew: true,
  },
  {
    id: 6,
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    brand: "ComfortPro",
    price: 18999,
    discounted_price: 15999,
    discount_percentage: 16,
    qty: 6,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
    rating: 4.6,
    reviews: 67,
    tags: ["Adjustable", "Lumbar Support"],
    description: "Premium mesh office chair with headrest",
    colors: ["#000000", "#6b7280"],
    isNew: false,
  },
  {
    id: 7,
    name: "Professional Camera Kit",
    slug: "professional-camera-kit",
    brand: "PhotoPro",
    price: 129999,
    discounted_price: 109999,
    discount_percentage: 15,
    qty: 3,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
    rating: 4.9,
    reviews: 34,
    tags: ["4K Video", "Bundle"],
    description: "Mirrorless camera with 24-70mm lens",
    colors: ["#000000"],
    isNew: true,
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    brand: "SoundWave",
    price: 3499,
    discounted_price: 2799,
    discount_percentage: 20,
    qty: 25,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
    rating: 4.3,
    reviews: 112,
    tags: ["Waterproof", "24h Battery"],
    description: "360° sound with IPX7 waterproof rating",
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    isNew: false,
  },
  {
    id: 9,
    name: "Natural Skincare Set",
    slug: "natural-skincare-set",
    brand: "PureGlow",
    price: 2499,
    discounted_price: 1999,
    discount_percentage: 20,
    qty: 18,
    image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=800&h=800&fit=crop",
    rating: 4.5,
    reviews: 89,
    tags: ["Cruelty Free", "Vegan"],
    description: "Complete skincare routine in one set",
    colors: [],
    isNew: true,
  },
  {
    id: 10,
    name: "Gaming Keyboard RGB",
    slug: "gaming-keyboard-rgb",
    brand: "GameMaster",
    price: 5999,
    discounted_price: 4499,
    discount_percentage: 25,
    qty: 12,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop",
    rating: 4.4,
    reviews: 78,
    tags: ["Mechanical", "RGB"],
    description: "Cherry MX switches with per-key RGB",
    colors: ["#000000", "#9333ea"],
    isNew: false,
  },
];

const AllProduct = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          All Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <Link href={`/details/${product.slug}`} className="relative w-full aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>

              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-sm sm:text-base font-semibold mb-1 truncate">
                  <Link href={`/details/${product.slug}`}>{product.name}</Link>
                </h4>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600 font-bold">৳{product.discounted_price}</span>
                  {product.price > product.discounted_price && (
                    <span className="text-gray-400 line-through text-sm">৳{product.price}</span>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    product.qty > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  } mb-3`}
                >
                  {product.qty > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <div className="mt-auto flex gap-2">
                  <button
                    className={`flex-1 border-2 rounded-md py-1 text-sm font-semibold transition ${
                      product.qty > 0
                        ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={product.qty === 0}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={`flex-1 rounded-md py-1 text-sm font-semibold text-white transition ${
                      product.qty > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={product.qty === 0}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProduct;
