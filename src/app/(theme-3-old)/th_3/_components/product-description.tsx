"use client"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  ShoppingBag,
  Eye,
  ChevronRight,
} from "lucide-react"
import { IAttributeValues, IProduct, IVariation } from "../types/product"
import { ProductCartControls } from "./product/product-cart-controls"
import { ProductImageCarousel } from "./product/product-image-carousel"
import ShareButtons from "./product/share-buttons"
import { useEffect, useMemo, useState } from "react"

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

const ProductDescription = ({
  product,
  videoUrls,
}: ProductDetailsClientProps) => {
  // sample theme color
  const relatedProducts = product?.relatedProducts || []
  const attributes: IAttributeValues[] = Array.isArray(product.attributes)
    ? (product.attributes as IAttributeValues[])
    : []
  const variations: IVariation[] = Array.isArray(product.variations)
    ? (product.variations as IVariation[])
    : []
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
  const hasBaseDiscount =
    !hasVariations && product.price > product.discounted_price

  const selectedMainImage = selectedVariation?.media || product.main_image || ""
  const images = [
    selectedMainImage,
    ...product.other_images.filter((image) => image !== selectedMainImage),
  ].filter(Boolean)

  const handleVariantChange = (key: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [key]: value }))
  }

  if (!product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3BB77E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }
  // Use product.relatedProducts if available, otherwise empty array

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image with Badges */}
        <div className="relative">
          {product.discounted_price < product.price && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {Math.round(
                ((product.price - product.discounted_price) / product.price) *
                  100
              )}
              % OFF
            </div>
          )}
          {product.product_qty <= 5 && product.product_qty > 0 && (
            <div className="absolute top-4 right-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Only {product.product_qty} left
            </div>
          )}
          <ProductImageCarousel images={images} videoUrls={videoUrls} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#3BB77E] transition">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-[#3BB77E] transition">
              Shop
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {product.product_name}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.product_name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#3BB77E]">
              ৳ {selectedPrice.toLocaleString()}
            </span>
            {product.price > product.discounted_price && (
              <>
                <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                  ৳ {product.price}
                </span>
                <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  Save ৳ {product.price - product.discounted_price}
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-4">
            <h4
              className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg ${
                product.product_qty > 0
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              }`}
            >
              {!isStockOut ? (
                <>
                  <CheckCircle size={20} /> In Stock ({product.product_qty}{" "}
                  available)
                </>
              ) : (
                <>
                  <XCircle size={20} /> Out of Stock
                </>
              )}
            </h4>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <div
                style={{
                  maxWidth: "100%",
                  overflowX: "hidden",
                  overflowY: "visible",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "normal",
                }}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            </div>
          )}
          {/* Cart Controls */}
          <ProductCartControls
            product={product}
            selectedVariants={selectedVariants}
            onVariantChange={handleVariantChange}
            selectedVariation={selectedVariation}
          />
          {/* Social Share */}
          <ShareButtons title={product?.product_name} />
          {/* Product Meta */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm border-t border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-gray-500 dark:text-gray-400">SKU:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">
                {product.product_code || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Category:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">
                {product?.category?.name || "Uncategorized"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Tags:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-medium">
                {product?.tags?.map((tag) => tag.name).join(", ") || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            <button className="px-1 py-4 border-b-2 border-[#3BB77E] text-[#3BB77E] font-semibold">
              Description
            </button>
          </div>
        </div>
        <div className="py-8">
          {product.long_description && (
            <div
              style={{
                maxWidth: "100%",
                overflowX: "hidden",
                overflowY: "visible",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                whiteSpace: "normal",
              }}
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          )}
        </div>
      </div>

      {/* Related Products - Professional Design */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                You might also like
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-picked products based on your interest
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-[#3BB77E] hover:text-[#2a9d64] font-medium transition group"
            >
              View All
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </Link>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.ulid}?${p.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-[#3BB77E] dark:hover:border-[#3BB77E]">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
                    {p.main_image ? (
                      <Image
                        src={p.main_image}
                        alt={p.product_name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <ShoppingBag
                          size={40}
                          className="text-gray-400 dark:text-gray-600"
                        />
                      </div>
                    )}

                    {/* Overlay with Quick View */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye size={16} />
                        Quick View
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {p.price > p.discounted_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -
                        {Math.round(
                          ((p.price - p.discounted_price) / p.price) * 100
                        )}
                        %
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#3BB77E] transition">
                      {p.product_name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#3BB77E]">
                          ৳ {p.price}
                        </span>
                        {p.price > p.discounted_price && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-2">
                            ৳ {p.price}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-8 h-8 bg-[#3BB77E] hover:bg-[#2a9d64] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile View All Link */}
          <div className="sm:hidden text-center mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#3BB77E] font-medium"
            >
              View All Related Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDescription
