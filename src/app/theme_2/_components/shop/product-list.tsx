"use client"

import { ProductCard } from "../products/product-card"
import { Button } from "../ui/button"

// TODO: Remove this mock data when the actual data model is available
const mockProducts = [
  {
    id: "1",
    name: "Essential Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 120,
    discountedPrice: 99,
    discountPercentage: 20,
  },
  {
    id: "2",
    name: "Classic T-Shirt",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 45,
    discountedPrice: 35,
    discountPercentage: 22,
  },
  {
    id: "3",
    name: "Casual Shirt",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 80,
    discountedPrice: 60,
    discountPercentage: 25,
  },
  {
    id: "4",
    name: "Comfort Pant",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 90,
    discountedPrice: 70,
    discountPercentage: 22,
  },
  {
    id: "5",
    name: "Summer Shorts",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 55,
    discountedPrice: 42,
    discountPercentage: 24,
  },
  {
    id: "6",
    name: "Winter Jacket",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 150,
    discountedPrice: 120,
    discountPercentage: 20,
  },
  {
    id: "7",
    name: "Cozy Sweater",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 85,
    discountedPrice: 68,
    discountPercentage: 20,
  },
  {
    id: "8",
    name: "Premium Hoodie",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 130,
    discountedPrice: 104,
    discountPercentage: 20,
  },
  {
    id: "9",
    name: "Designer T-Shirt",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 50,
    discountedPrice: 40,
    discountPercentage: 20,
  },
  {
    id: "10",
    name: "Slim Fit Pant",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 95,
    discountedPrice: 76,
    discountPercentage: 20,
  },
  {
    id: "11",
    name: "Sport Shorts",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 60,
    discountedPrice: 48,
    discountPercentage: 20,
  },
  {
    id: "12",
    name: "Denim Jacket",
    image: "/temp/temp-slider-1.png",
    hoverImage: "/product-placeholder.png",
    originalPrice: 140,
    discountedPrice: 112,
    discountPercentage: 20,
  },
]

export const ProductList = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          size="lg"
          className="px-12 py-6 text-base font-semibold rounded-[12px]"
        >
          See More
        </Button>
      </div>
    </div>
  )
}
