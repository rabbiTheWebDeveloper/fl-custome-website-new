"use client"
import React from "react"
import { IProduct } from "../types/product"
import ProductCard from "./product-card"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import Pagination from "./pagination"

export default function FeaturedProducts({
  products,
  title,
  totalPages = 1,
}: {
  products: IProduct[]
  title?: string
  totalPages?: number
}) {
  if (!products || products.length === 0) return null

  return (
    <section
      id="product-list"
      className="py-16 lg:py-24 bg-white dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                size={14}
                className="text-gray-400 dark:text-zinc-500"
              />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-zinc-500">
                Handpicked for You
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-[1.0]">
              {title || "Featured"}
              <br />
              <span className="italic font-light text-gray-400 dark:text-zinc-600">
                Products
              </span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="self-start sm:self-auto hidden sm:inline-flex items-center gap-3 px-6 py-3.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-sm font-bold text-gray-900 dark:text-white transition-all active:scale-95 group border border-gray-100 dark:border-zinc-800"
          >
            View All
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 lg:mt-10">
          <Pagination totalPages={totalPages || 10} />
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 sm:hidden">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-90 active:scale-98 transition-all shadow-xl shadow-black/10"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
