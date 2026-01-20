import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"

interface CategoryCardProps {
  name: string
  image: string
  href: string
}

export const CategoryCard = ({ name, image, href }: CategoryCardProps) => {
  return (
    <Link href={href} className="group relative block">
      <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
        {/* Category Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-center">
          <h3 className="text-white text-2xl font-semibold mb-3">{name}</h3>
          <Button
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 md:text-base font-medium"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </Link>
  )
}
