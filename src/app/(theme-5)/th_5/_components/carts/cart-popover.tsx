"use client"
import Link from "next/link"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import { ShoppingBag, X, Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useEffect } from "react"

export const CartPopover = ({
  isCartOpen,
  setIsCartOpen,
}: {
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}) => {
  const { updateItem, removeItem } = useCart()
  const items = useCartStore((state) => state.items)
  const totals = useCartStore((state) => state.totals)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    if (
      typeof item.metadata?.maxQuantity === "number" &&
      newQuantity > item.metadata.maxQuantity
    ) {
      toast.error(
        `Maximum quantity for this product is ${item.metadata.maxQuantity}`
      )
      return
    }
    await updateItem(itemId, { quantity: newQuantity })
  }

  const handleRemoveProduct = async (itemId: string) => {
    setIsCartOpen(true)
    await removeItem(itemId)
  }

  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) return undefined
    return item.variants.map((v) => `${v.key}: ${v.value}`).join(", ")
  }

  const totalProducts = totals.itemCount

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isCartOpen])

  return (
    <>
      {/* ── Cart Trigger Button ── */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        aria-label="Open cart"
        className="relative p-2.5 rounded-full hover:bg-black/5 transition-colors text-gray-700"
      >
        <ShoppingCart size={20} />
        {totalProducts > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-1">
            {totalProducts > 99 ? "99+" : totalProducts}
          </span>
        )}
      </button>

      {/* ── Sidebar Drawer (Desktop & Mobile) ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-full max-w-[400px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag size={28} className="text-gray-300" />
                </div>
                <p className="text-base font-bold text-gray-400 text-center uppercase tracking-widest">
                  Your cart is empty
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {/* Shipping Message */}
                  <div className="px-6 py-4 bg-white border-b border-gray-100">
                    <p className="text-[11px] text-gray-500">
                      Spend BDT 4,495.00 more and get free shipping!
                    </p>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 px-6 py-6 bg-white"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 bg-[#f7f7f7] flex-shrink-0 border border-gray-100">
                          <Image
                            src={
                              item.metadata?.image || "/product-placeholder.png"
                            }
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase leading-snug tracking-wider">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <p className="text-xs font-bold text-gray-900">
                                ৳
                                {(
                                  item.discountedPrice ?? item.price
                                ).toLocaleString()}
                              </p>
                              {item.discountedPrice &&
                                item.price > item.discountedPrice && (
                                  <p className="text-[10px] text-gray-400 line-through">
                                    ৳{item.price.toLocaleString()}
                                  </p>
                                )}
                            </div>

                            {formatVariants(item) && (
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5">
                                {formatVariants(item)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-4">
                            {/* Qty controls */}
                            <div className="flex items-center border border-gray-200">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Minus size={12} className="text-gray-600" />
                              </button>
                              <span className="text-xs font-semibold text-gray-900 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  typeof item.metadata?.maxQuantity ===
                                    "number" &&
                                  item.quantity >= item.metadata.maxQuantity
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Plus size={12} className="text-gray-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveProduct(item.id)}
                              className="text-[10px] font-medium text-gray-500 hover:text-black underline underline-offset-2 transition-colors uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] text-gray-500 font-medium">
                      Add order note
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#1c1c1c] text-white py-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-colors"
                  >
                    Checkout • ৳{totals?.subtotal?.toLocaleString()}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
