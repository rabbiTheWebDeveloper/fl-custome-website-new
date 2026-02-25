"use client"

import { useMemo } from "react"
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
  const items = useCartStore((state) => state.items)
  const cartVariants = useMemo(() => {
    const attributes: IAttributeValues[] = Array.isArray(product.attributes)
      ? (product.attributes as IAttributeValues[])
      : []
    return Object.entries(selectedVariants)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        const attribute = attributes.find((attr) => attr.key === key)
        const selectedAttributeValue = attribute?.values.find(
          (attributeValue) => attributeValue.value === value
        )
        return {
          key,
          value,
          attributeId: selectedAttributeValue?.attribute_id,
        }
      })
  }, [product.attributes, selectedVariants])

  const currentCartItem = useMemo(() => {
    const itemId = generateCartItemId(product.id, cartVariants)
    return items.find((item) => item.id === itemId)
  }, [items, product.id, cartVariants])

  const currentQuantity = currentCartItem?.quantity ?? 0
  const maxQty = selectedVariation?.quantity ?? product.product_qty
  const selectedPrice = selectedVariation?.price ?? product.price
  const selectedImage = selectedVariation?.media || product.main_image

  const showVariants =
    Array.isArray(product.variations) &&
    Array.isArray(product.attributes) &&
    product.variations.length > 0 &&
    product.attributes.length > 0

  const handleBuyNow = async () => {
    try {
      if (maxQty === 0) {
        toast.error("Sorry, this product is currently out of stock.")
        return
      }

      if (currentQuantity === 0) {
        await addItem({
          productId: product.id,
          name: product.product_name,
          price: selectedPrice,
          discountedPrice: selectedPrice,
          quantity: 1,
          variants: cartVariants,
          metadata: {
            image: selectedImage,
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
          price: selectedPrice,
          quantity: 1,
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
          />
        </div>

        {/* Add to Cart */}
        <AddToCartButton
          product={product}
          variants={cartVariants}
          maxQuantity={product.product_qty}
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
