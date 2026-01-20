import Image from "next/image"
import { Button } from "../ui/button"

interface ProductCardProps {
  id: string
  name: string
  image: string
  hoverImage: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
}

export const ProductCard = ({
  name,
  image,
  hoverImage,
  originalPrice,
  discountedPrice,
  discountPercentage,
}: ProductCardProps) => {
  return (
    <div className="group relative">
      {/* Product Image Container */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {/* Discount Badge */}
        <div className="absolute top-5 left-3 z-10">
          <span className="bg-[#FFA01C] text-black text-sm font-semibold px-3 py-2 rounded-lg">
            {discountPercentage}% OFF
          </span>
        </div>

        {/* Default Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />

        {/* Hover Product Image */}
        <Image
          src={hoverImage}
          alt={`${name} alternate view`}
          fill
          className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />
        <div className="size-full inset-0 absolute bg-linear-to-b from-transparent via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

        {/* Add to Cart Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 md:text-base"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 line-through">
            ${originalPrice}
          </span>
          <span className="text-lg font-semibold text-primary">
            ${discountedPrice}
          </span>
        </div>
      </div>
    </div>
  )
}
