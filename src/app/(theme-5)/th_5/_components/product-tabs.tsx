"use client"
import React, { useState } from "react"
import Link from "next/link"
import Th5ProductCard from "./product-card"
import { IProduct } from "../types/product"

interface ProductTabsProps {
  trendingProducts: IProduct[]
  newArrivalProducts: IProduct[]
}

export default function ProductTabs({
  trendingProducts,
  newArrivalProducts,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"trend" | "arrivals">("trend")

  const products = activeTab === "trend" ? trendingProducts : newArrivalProducts

  if (!trendingProducts.length && !newArrivalProducts.length) return null

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 mb-10">
          <button
            onClick={() => setActiveTab("trend")}
            className={`px-6 py-2 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all duration-200 ${
              activeTab === "trend"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            New in Trend
          </button>
          <button
            onClick={() => setActiveTab("arrivals")}
            className={`px-6 py-2 text-sm font-semibold tracking-widest uppercase border-b-2 transition-all duration-200 ${
              activeTab === "arrivals"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            New Arrivals
          </button>
        </div>

        {/* Product Grid — 5 columns on desktop like Patchee */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.slice(0, 10).map((product) => (
            <Th5ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All button */}
        {products.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-12 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
