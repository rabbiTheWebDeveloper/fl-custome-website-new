"use client"

import { ShoppingCartIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CartItem } from "./cart-item"
import Link from "next/link"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import { useTranslations } from "next-intl"

const NO_ITEMS = 0

export const CartPopover = () => {
  const { updateItem, removeItem } = useCart()
  const tCheckout = useTranslations("Theme2.checkout")

  // Get cart items and totals from store (reactive)
  const items = useCartStore((state) => state.items)
  const totals = useCartStore((state) => state.totals)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateItem(itemId, { quantity: newQuantity })
  }

  const handleRemoveProduct = async (itemId: string) => {
    await removeItem(itemId)
  }

  // Format variants as a string for display (e.g., "Size: L, Color: Red")
  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) {
      return undefined
    }
    return item.variants.map((v) => `${v.key}: ${v.value}`).join(", ")
  }

  const totalProducts = totals.itemCount

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="size-10.5 relative">
          <span className="sr-only">Cart</span>
          <ShoppingCartIcon className="size-6" />
          {totalProducts > NO_ITEMS && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full size-5 flex items-center justify-center">
              {totalProducts}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 md:w-[450px]">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 text-sm font-medium">
            <ShoppingCartIcon className="size-4" /> Cart ({totalProducts})
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {items.length > NO_ITEMS ? (
            <div className="flex flex-col divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <CartItem
                    id={item.id}
                    name={item.name}
                    size={formatVariants(item)}
                    price={item.discountedPrice ?? item.price}
                    quantity={item.quantity}
                    image={
                      (item.metadata?.image as string) ||
                      "/product-placehoder.png"
                    }
                    maxQuantity={
                      (item.metadata?.maxQuantity as number) ?? undefined
                    }
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(item.id, quantity)
                    }
                    onRemove={() => handleRemoveProduct(item.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Your cart is empty
            </div>
          )}
        </div>
        {items.length > NO_ITEMS && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {tCheckout("subtotal")}:
              </span>
              <span className="font-semibold">
                ৳{totals.subtotal.toFixed(2)}
              </span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {tCheckout("discount")}:
                </span>
                <span className="font-semibold text-green-600">
                  -৳{totals.discount.toFixed(2)}
                </span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {tCheckout("tax")}:
                </span>
                <span className="font-semibold">৳{totals.tax.toFixed(2)}</span>
              </div>
            )}
            {totals.shipping > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {tCheckout("shipping")}:
                </span>
                <span className="font-semibold">
                  ৳{totals.shipping.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">{tCheckout("total")}:</span>
              <span className="font-bold text-lg">
                ৳{totals.total.toFixed(2)}
              </span>
            </div>
            <Button className="w-full text-base" size="lg" asChild>
              <Link href="/checkout">{tCheckout("checkout")}</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
