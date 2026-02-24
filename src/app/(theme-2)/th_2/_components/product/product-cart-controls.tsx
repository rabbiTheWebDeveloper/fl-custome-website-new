"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { CartInputConnected } from "../carts/cart-input-connected"
import AddToCartButton from "../carts/add-to-cart-button"
import { Button } from "../ui/button"
import { VariantSelector } from "./variant-selector"
import { useCart, generateCartItemId } from "@/lib/cart"
import { useCartStore } from "@/lib/cart"
import type { IProduct, IVariation } from "../../types/product"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { trackAddToCart } from "@/lib/gtm"

interface ProductCartControlsProps {
  product: IProduct
  selectedVariants?: Record<string, string>
  onVariantChange?: (key: string, value: string) => void
  selectedVariation?: IVariation | null
}

export function ProductCartControls({
  product,
  selectedVariants = {},
  onVariantChange = () => {},
  selectedVariation,
}: ProductCartControlsProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const items = useCartStore((state) => state.items)
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")

  const cartVariants = useMemo(() => {
    const attributes = Array.isArray(product.attributes)
      ? product.attributes
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
        toast.error(tToast("outOfStock"))
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
      toast.error(tToast("addToCartError"))
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
      <div className="mt-8 w-full">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 min-w-0">
            <CartInputConnected
              product={product}
              variants={cartVariants}
              maxQuantity={maxQty}
            />
          </div>
          <Button
            size="lg"
            className="h-13 rounded-xl text-base font-medium md:flex-1 min-w-0"
            onClick={handleBuyNow}
            disabled={maxQty <= 0}
          >
            {t("buyNow")}
          </Button>
          <AddToCartButton
            product={product}
            variants={cartVariants}
            maxQuantity={maxQty}
            selectedPrice={selectedPrice}
            selectedImage={selectedImage}
          />
        </div>
      </div>
    </>
  )
}
