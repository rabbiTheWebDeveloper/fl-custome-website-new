"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { VariantSelector } from "./variant-selector"
import { useCart, generateCartItemId } from "@/lib/cart"
import { useCartStore } from "@/lib/cart"
import type {
  IAttributeValues,
  IProduct,
  IVariation,
} from "../../types/product"
import { CreditCard } from "lucide-react"
import AddToCartButton from "../carts/add-to-cart-button"
import { CartInputConnected } from "../carts/cart-input-connected"
import { trackAddToCart } from "@/lib/gtm"
import { toast } from "sonner"

interface ProductCartControlsProps {
  product: IProduct
  selectedVariants?: Record<string, string>
  onVariantChange?: (key: string, value: string) => void
  selectedVariation?: IVariation | null
}

/**
 * Product cart controls component
 * Manages cart input and add to cart button with variant support
 */
export function ProductCartControls({
  product,
  selectedVariants = {},
  onVariantChange = () => {},
  selectedVariation,
}: ProductCartControlsProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedQuantityBeforeFirstAdd, setSelectedQuantityBeforeFirstAdd] =
    useState(1)
  const items = useCartStore((state) => state.items)
  const cartVariants = useMemo(() => {
    const variations = Array.isArray(product.variations)
      ? product.variations
      : []

    return Object.entries(selectedVariants)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        const matchedVariation = variations.find(
          (variation) => variation.variant === value
        )

        return {
          key,
          value,
          attributeId: matchedVariation?.id, // ✅ This is 101464 etc.
        }
      })
  }, [product.variations, selectedVariants])

  const currentCartItem = useMemo(() => {
    const itemId = generateCartItemId(product.id, cartVariants)
    return items.find((item) => item.id === itemId)
  }, [items, product.id, cartVariants])

  const currentQuantity = currentCartItem?.quantity ?? 0
  const maxQty = selectedVariation?.quantity ?? product.product_qty
  const selectedPrice = selectedVariation?.price ?? product.price
  const selectedImage = selectedVariation?.media || product.main_image
  const effectivePrice = selectedPrice ?? product.price
  const effectiveImage = selectedImage ?? product.main_image
  const effectiveSelectedQuantity =
    currentQuantity > 0 ? currentQuantity : selectedQuantityBeforeFirstAdd

  const showVariants =
    Array.isArray(product.variations) &&
    Array.isArray(product.attributes) &&
    product.variations.length > 0 &&
    product.attributes.length > 0

  const handleBuyNow = async () => {
    try {
      const requestedQuantity = Math.max(
        1,
        Math.floor(effectiveSelectedQuantity || 1)
      )
      const quantityToAdd = currentQuantity === 0 ? requestedQuantity : 1

      if (maxQty === 0) {
        toast.error("Sorry, this product is currently out of stock.")
        return
      }
      if (currentQuantity + quantityToAdd > maxQty) {
        toast.warning(
          `You can only add up to ${maxQty} of this product to your cart.`
        )
        return
      }
      if (currentQuantity === 0) {
        await addItem({
          productId: product.id,
          name: product.product_name,
          price: effectivePrice,
          discountedPrice: effectivePrice,
          quantity: quantityToAdd,
          variants: cartVariants,
          metadata: {
            image: effectiveImage,
            sku: product.product_code,
            maxQuantity: maxQty,
            ulid: product.ulid,
            inside_dhaka: product.inside_dhaka,
            outside_dhaka: product.outside_dhaka,
            sub_area_charge: product.sub_area_charge,
          },
          mergeIfExists: true,
          maxQuantity: maxQty,
        })
        trackAddToCart({
          id: product.id,
          name: product.product_name,
          price: effectivePrice,
          quantity: quantityToAdd,
        })
      }

      router.push("/checkout")
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    }
  }

  return (
    <>
      {showVariants && (
        <div className="mt-8">
          <VariantSelector
            product={product}
            selectedVariants={selectedVariants}
            onVariantChange={onVariantChange}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Quantity Input */}
        <div className="sm:w-36">
          <CartInputConnected
            product={product}
            variants={cartVariants}
            maxQuantity={maxQty}
            onValuePreview={(quantity) =>
              setSelectedQuantityBeforeFirstAdd(quantity)
            }
          />
        </div>

        {/* Add to Cart */}
        <AddToCartButton
          product={product}
          variants={cartVariants}
          maxQuantity={product.product_qty}
          selectedPrice={selectedPrice}
          selectedImage={selectedImage}
          selectedQuantity={effectiveSelectedQuantity}
        />

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={product.product_qty <= 0}
          className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border-2 border-[#3BB77E] px-6 font-medium text-[#3BB77E] transition hover:bg-[#3BB77E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3BB77E]/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CreditCard size={18} />
          Buy Now
        </button>
      </div>
    </>
  )
}
