import React from "react"
import Link from "next/link"

const FEATURED_PRODUCTS = [
  { id: 1, name: "Prime Bags", href: "/shop" },
  { id: 2, name: "Prime Shoes", href: "/shop" },
]

export default function PrimeBadgeLinks() {
  return (
    <div className="flex items-center justify-center gap-6 py-4 bg-white border-b border-gray-100">
      {FEATURED_PRODUCTS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-700 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}
