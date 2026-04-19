"use client"

import { useEffect, useMemo, useState } from "react"
import { ProductImageCarousel } from "./product-image-carousel"
import { ProductCartControls } from "./product-cart-controls"
import { SocialShareButtons } from "./social-share-buttons"
import { StickyMobileBar } from "./sticky-mobile-bar"
import { useTrackViewItem } from "@/lib/gtm-hooks"
import type {
  IAttributeValues,
  IProduct,
  IVariation,
} from "../../types/product"

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

export function ProductDetailsClient({
  product,
  videoUrls,
}: ProductDetailsClientProps) {
  const attributes = Array.isArray(product.attributes) ? product.attributes : []
  const variations = Array.isArray(product.variations) ? product.variations : []
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

  useTrackViewItem(product, selectedPrice)
  console.log("product", product?.long_description)
  return (
    <>
      {/* Mobile: full-width carousel outside container */}
      <div className="w-full md:hidden">
        <ProductImageCarousel images={images} videoUrls={videoUrls} />
      </div>

      {/* Desktop: grid layout | Mobile: details only */}
      <div className="container py-0 pb-6 md:pb-12">
        <div className="grid md:grid-cols-7 gap-6 md:gap-12 lg:gap-24">
          {/* Desktop carousel - hidden on mobile */}
          <div className="hidden md:block col-span-3 min-w-0">
            <ProductImageCarousel images={images} videoUrls={videoUrls} />
          </div>
          <div className="overflow-hidden col-span-full md:col-span-4 px-4 sm:px-6 md:px-0">
            <div>
              {isStockOut && (
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg mb-3">
                  STOCK OUT
                </span>
              )}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-semibold mt-1 leading-tight">
                {product.product_name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                {hasBaseDiscount ? (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xl md:text-3xl font-semibold text-primary">
                      ৳{product.discounted_price.toLocaleString()}
                    </span>
                    <span className="bg-[#FFA01C] text-black text-xs font-semibold px-2 py-1 rounded-md">
                      {product.flat_discount_percent} OFF
                    </span>
                  </>
                ) : (
                  <span className="text-xl md:text-3xl font-semibold text-primary">
                    ৳{selectedPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <ProductCartControls
              product={product}
              selectedVariants={selectedVariants}
              onVariantChange={handleVariantChange}
              selectedVariation={selectedVariation}
            />

            <SocialShareButtons productName={product.product_name} />

            {product.short_description &&
              product.short_description
                .replace(/<[^>]*>/g, "")
                .trim()
                .toLowerCase() !== "null" && (
                <div
                  className="mt-6 md:mt-8 prose prose-sm max-w-3xl wrap-break-word"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}

            {product?.long_description &&
              product.long_description
                .replace(/<[^>]*>/g, "")
                .trim()
                .toLowerCase() !== "null" && (
                <div
                  className="mt-6 md:mt-8 prose prose-sm max-w-3xl break-words"
                  dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
              )}
          </div>
        </div>
      </div>

      <StickyMobileBar
        product={product}
        selectedVariation={selectedVariation}
        selectedVariants={selectedVariants}
      />
    </>
  )
}
