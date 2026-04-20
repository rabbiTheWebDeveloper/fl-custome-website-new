"use client"
import React from "react"
import { IProduct } from "../types/product"
import ProductCard from "./product-card"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  ShoppingBag,
  Trophy,
} from "lucide-react"

type SectionVariant = "featured" | "new-arrival" | "flash" | "top-selling"

interface ProductSectionProps {
  products: IProduct[]
  variant?: SectionVariant
  title?: string
  subtitle?: string
  shopLink?: string
  sectionId?: string
}

const VARIANTS: Record<
  SectionVariant,
  {
    icon: React.ReactNode
    label: string
    accentClass: string
    titleWord: string
    titleSecondLine: string
    bg: string
    ctaBg: string
    mobileCta: string
    badgeBg?: string
    badgeText?: string
    badgeIcon?: React.ReactNode
  }
> = {
  "top-selling": {
    icon: <Trophy size={14} />,
    label: "Customer Favourites",
    accentClass: "text-violet-500 dark:text-violet-400",
    titleWord: "Top",
    titleSecondLine: "Sellers",
    bg: "bg-gray-50 dark:bg-zinc-950",
    ctaBg:
      "bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-900/30 border border-violet-100 dark:border-violet-900/50 text-violet-700 dark:text-violet-400",
    mobileCta: "bg-violet-600 dark:bg-violet-500 text-white",
    badgeBg:
      "bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/50",
    badgeText: "text-violet-700 dark:text-violet-400",
    badgeIcon: <Trophy size={16} className="text-violet-500 flex-shrink-0" />,
  },
  featured: {
    icon: <Sparkles size={14} />,
    label: "Handpicked for You",
    accentClass: "text-gray-400 dark:text-zinc-500",
    titleWord: "Featured",
    titleSecondLine: "Products",
    bg: "bg-white dark:bg-black",
    ctaBg:
      "bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white",
    mobileCta: "bg-black dark:bg-white text-white dark:text-black",
  },
  "new-arrival": {
    icon: <Star size={14} />,
    label: "Just Dropped",
    accentClass: "text-emerald-500 dark:text-emerald-400",
    titleWord: "New",
    titleSecondLine: "Arrivals",
    bg: "bg-gray-50 dark:bg-zinc-950",
    ctaBg:
      "bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400",
    mobileCta: "bg-emerald-600 dark:bg-emerald-500 text-white",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeIcon: (
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
    ),
  },
  flash: {
    icon: <Zap size={14} />,
    label: "Limited Time Only",
    accentClass: "text-amber-500 dark:text-amber-400",
    titleWord: "Flash",
    titleSecondLine: "Deals",
    bg: "bg-white dark:bg-black",
    ctaBg:
      "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400",
    mobileCta: "bg-amber-500 dark:bg-amber-400 text-white dark:text-black",
    badgeBg:
      "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeIcon: (
      <Zap size={16} className="text-amber-500 animate-pulse flex-shrink-0" />
    ),
  },
}

const BADGE_MESSAGES: Partial<Record<SectionVariant, string>> = {
  "top-selling": "Most loved by our customers — proven favourites",
  "new-arrival": "Fresh stock just added to the store",
  flash: "Flash Sale — Prices slashed on select items",
}

export default function ProductSection({
  products,
  variant = "featured",
  title,
  subtitle,
  shopLink = "/shop",
  sectionId,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null

  const v = VARIANTS[variant]
  const badgeMessage = BADGE_MESSAGES[variant]

  return (
    <section
      id={sectionId}
      className={`py-16 lg:py-24 ${v.bg} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <div className={`flex items-center gap-2 mb-3 ${v.accentClass}`}>
              {v.icon}
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {subtitle || v.label}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-[1.0]">
              {title || v.titleWord}
              <br />
              <span className="italic font-light text-gray-400 dark:text-zinc-600">
                {v.titleSecondLine}
              </span>
            </h2>
          </div>

          <Link
            href={shopLink}
            className={`self-start sm:self-auto hidden sm:inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-bold transition-all active:scale-95 group ${v.ctaBg}`}
          >
            View All
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Variant badge */}
        {badgeMessage && v.badgeBg && (
          <div
            className={`flex items-center gap-3 mb-8 p-3 pl-4 rounded-2xl w-fit ${v.badgeBg}`}
          >
            {v.badgeIcon}
            <span className={`text-sm font-bold ${v.badgeText}`}>
              {badgeMessage}
            </span>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 sm:hidden">
          <Link
            href={shopLink}
            className={`flex items-center justify-center gap-2 w-full py-4 font-black text-xs uppercase tracking-widest rounded-full hover:opacity-90 active:scale-95 transition-all shadow-xl ${v.mobileCta}`}
          >
            <ShoppingBag size={14} />
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
