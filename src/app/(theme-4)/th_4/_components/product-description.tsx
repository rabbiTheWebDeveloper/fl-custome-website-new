"use client"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
} from "lucide-react"
import { IAttributeValues, IProduct, IVariation } from "../types/product"
import { ProductCartControls } from "./product/product-cart-controls"
import ShareButtons from "./product/share-buttons"
import { useEffect, useMemo, useRef, useState } from "react"
import { tagManagerEvent } from "@/lib/tag-manager-event"

interface ProductDetailsClientProps {
  product: IProduct
  videoUrls: string[]
}

const normalize = (value: string) => value.trim().toLowerCase()
const normalizeComparable = (value: string) =>
  normalize(value).replace(/[^a-z0-9]/g, "")

function getDefaultAttributes(attributes: IAttributeValues[]) {
  return attributes.reduce<Record<string, string>>((acc, attribute) => {
    const firstValue = attribute.values[0]?.value
    if (firstValue) acc[attribute.key] = firstValue
    return acc
  }, {})
}

function getCheapestVariation(variations: IVariation[]) {
  return variations.reduce<IVariation | null>((lowest, current) => {
    if (!lowest) return current
    return current.price < lowest.price ? current : lowest
  }, null)
}

function mapVariationToAttributes(
  variation: IVariation,
  attributes: IAttributeValues[]
) {
  const mapped: Record<string, string> = {}
  if (attributes.length === 0) return mapped
  if (attributes.length === 1) {
    const attr = attributes[0]
    const exact = attr.values.find(
      (value) =>
        normalizeComparable(value.value) ===
        normalizeComparable(variation.variant)
    )
    mapped[attr.key] = exact?.value ?? variation.variant
    return mapped
  }
  const variationLabel = normalizeComparable(variation.variant)
  attributes.forEach((attribute) => {
    const match = attribute.values.find((value) =>
      variationLabel.includes(normalizeComparable(value.value))
    )
    if (match) mapped[attribute.key] = match.value
  })
  return mapped
}

function doesVariationMatchSelection(
  variation: IVariation,
  attributes: IAttributeValues[],
  selected: Record<string, string>
) {
  const mapped = mapVariationToAttributes(variation, attributes)
  return attributes.every((attribute) => {
    const selectedValue = selected[attribute.key]
    if (!selectedValue) return true
    return (
      normalizeComparable(mapped[attribute.key] ?? "") ===
      normalizeComparable(selectedValue)
    )
  })
}

export default function ProductDescription({
  product,
  videoUrls,
}: ProductDetailsClientProps) {
  const attributes: IAttributeValues[] = useMemo(
    () =>
      Array.isArray(product.attributes)
        ? (product.attributes as IAttributeValues[])
        : [],
    [product.attributes]
  )
  const variations: IVariation[] = useMemo(
    () =>
      Array.isArray(product.variations)
        ? (product.variations as IVariation[])
        : [],
    [product.variations]
  )
  const hasVariations = variations.length > 0 && attributes.length > 0

  const cheapestVariation = useMemo(
    () => getCheapestVariation(variations),
    [variations]
  )
  const initialSelectedVariants = useMemo(() => {
    const defaults = getDefaultAttributes(attributes)
    if (!hasVariations || !cheapestVariation) return defaults
    return {
      ...defaults,
      ...mapVariationToAttributes(cheapestVariation, attributes),
    }
  }, [attributes, hasVariations, cheapestVariation])

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(initialSelectedVariants)

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    setSelectedVariants(initialSelectedVariants)
  }, [initialSelectedVariants])

  const selectedVariation = useMemo(() => {
    if (!hasVariations) return null
    return (
      variations.find((variation) =>
        doesVariationMatchSelection(variation, attributes, selectedVariants)
      ) ?? cheapestVariation
    )
  }, [
    hasVariations,
    variations,
    attributes,
    selectedVariants,
    cheapestVariation,
  ])

  const selectedPrice = hasVariations
    ? (selectedVariation?.price ?? cheapestVariation?.price ?? product.price)
    : product.price > product.discounted_price
      ? product.discounted_price
      : product.price

  const isStockOut = hasVariations
    ? (selectedVariation?.quantity ?? 0) <= 0
    : product.product_qty <= 0

  const selectedMainImage = selectedVariation?.media || product.main_image || ""
  const allImages = [
    selectedMainImage,
    ...product.other_images.filter((image) => image !== selectedMainImage),
  ].filter(Boolean)

  const handleVariantChange = (key: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [key]: value }))
    setActiveImageIdx(0)
  }

  const lastTrackedProductId = useRef<string | number | null>(null)

  useEffect(() => {
    if (!product?.id) return
    if (lastTrackedProductId.current === product.id) return
    tagManagerEvent("view_item", selectedPrice, product, "single_item")
    lastTrackedProductId.current = product.id
  }, [product, selectedPrice])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hasDiscount = product.price > product.discounted_price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discounted_price) / product.price) * 100
      )
    : 0

  return (
    <main className="min-h-screen bg-white dark:bg-black w-full pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-400 dark:text-zinc-600 uppercase mb-8 lg:mb-12">
          <Link
            href="/"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={10} />
          <Link
            href="/shop"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Shop
          </Link>
          <ChevronRight size={10} />
          <span className="text-gray-700 dark:text-zinc-300 truncate max-w-[180px] lowercase">
            {product.product_name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="flex flex-col xl:flex-row gap-10 xl:gap-20 items-start">
          {/* === LEFT: Image Gallery === */}
          <div className="w-full xl:w-[58%] flex flex-col gap-4">
            {/* Large Active Image */}
            <div className="relative w-full aspect-square rounded-[2.5rem] bg-gray-50 dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-zinc-800">
              {/* Badges */}
              <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="px-3.5 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-black rounded-full shadow-lg">
                    SAVE {discountPercent}%
                  </span>
                )}
                {product.product_qty <= 5 && product.product_qty > 0 && (
                  <span className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-black rounded-full shadow-lg">
                    ONLY {product.product_qty} LEFT
                  </span>
                )}
                {isStockOut && (
                  <span className="px-3.5 py-1.5 bg-red-500 text-white text-xs font-black rounded-full shadow-lg">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Share button */}
              <div className="absolute top-5 right-5 z-20">
                <button
                  onClick={() => setShowShare((p) => !p)}
                  className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-gray-100 dark:border-zinc-800 hover:scale-110 transition-transform"
                >
                  <Share2
                    size={16}
                    className="text-gray-700 dark:text-zinc-300"
                  />
                </button>
                {showShare && (
                  <div className="absolute right-0 top-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-4">
                    <ShareButtons title={product.product_name} compact />
                  </div>
                )}
              </div>

              {/* Main image or Video */}
              {allImages[activeImageIdx] ? (
                <Image
                  src={allImages[activeImageIdx]}
                  alt={`${product.product_name} - view ${activeImageIdx + 1}`}
                  fill
                  priority
                  className="object-contain p-6 md:p-10 hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              ) : videoUrls[0] ? (
                <iframe
                  src={videoUrls[0]}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImageIdx === idx
                        ? "border-black dark:border-white shadow-lg scale-105"
                        : "border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
                {/* Video thumbnails */}
                {videoUrls.map((_, idx) => (
                  <button
                    key={`v-${idx}`}
                    onClick={() => setActiveImageIdx(allImages.length + idx)}
                    className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all bg-black flex items-center justify-center"
                  >
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-black ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === RIGHT: Sticky Details === */}
          <div className="w-full xl:w-[42%] xl:sticky xl:top-32 flex flex-col gap-7 pb-12">
            {/* Category */}
            {product.category?.name && (
              <Link
                href={`/shop?category=${encodeURIComponent(product.category.name)}&id=${product.category.id}`}
                className="w-max text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              {product.product_name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                ৳{selectedPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl font-medium text-gray-400 dark:text-zinc-600 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full w-max text-sm font-bold ${
                isStockOut
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
              }`}
            >
              {!isStockOut ? (
                <>
                  <CheckCircle size={15} /> In Stock — Ready to Ship
                </>
              ) : (
                <>
                  <XCircle size={15} /> Out of Stock
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description &&
              product.short_description.trim() !== "" && (
                <div
                  className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm border-l-2 border-gray-200 dark:border-zinc-800 pl-4 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}

            {/* Variant Selector + Cart Controls */}
            <div className="bg-gray-50 dark:bg-zinc-900/60 rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-5 sm:p-6">
              <ProductCartControls
                product={product}
                selectedVariants={selectedVariants}
                onVariantChange={handleVariantChange}
                selectedVariation={selectedVariation}
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Secure Payment",
                  sub: "100% Protected",
                },
                { icon: Truck, label: "Fast Delivery", sub: "Inside Dhaka" },
                { icon: RotateCcw, label: "Easy Returns", sub: "Hassle Free" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-2 p-3.5 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800"
                >
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700">
                    <Icon
                      size={16}
                      className="text-gray-700 dark:text-zinc-300"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-900 dark:text-white leading-tight">
                      {label}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-100 dark:border-zinc-800 text-sm">
              {product.product_code && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-600 mb-1">
                    SKU
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.product_code}
                  </p>
                </div>
              )}
              {product.category?.name && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-600 mb-1">
                    Category
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.category.name}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-600 mb-2">
                  Share
                </p>
                <ShareButtons title={product.product_name} compact />
              </div>
            </div>
          </div>
        </div>

        {/* === Long Description === */}
        {product.long_description && product.long_description.trim() !== "" && (
          <div className="mt-24 lg:mt-32">
            <div className="flex items-center gap-6 mb-12">
              <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 whitespace-nowrap">
                Product Details
              </h2>
              <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
            </div>
            <div
              className="prose prose-lg dark:prose-invert max-w-4xl mx-auto prose-img:rounded-3xl prose-img:shadow-2xl prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-zinc-300 prose-headings:font-black prose-headings:tracking-tight"
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
