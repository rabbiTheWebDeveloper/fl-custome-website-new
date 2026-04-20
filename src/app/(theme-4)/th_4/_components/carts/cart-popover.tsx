"use client"
import Link from "next/link"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  ArrowRight,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

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

  return (
    <>
      {/* ── Cart Trigger Button ── */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        aria-label="Open cart"
        className="relative p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
      >
        <ShoppingCart size={20} />
        {totalProducts > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-1">
            {totalProducts > 99 ? "99+" : totalProducts}
          </span>
        )}
      </button>

      {/* ── Desktop Dropdown (lg+) ── */}
      {isCartOpen && (
        <div className="absolute top-full right-0 mt-3 w-[380px] hidden lg:block z-50">
          {/* Visual connector gap */}
          <div className="absolute -top-3 inset-x-0 h-3 bg-transparent" />

          <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-black tracking-tight text-gray-900 dark:text-white">
                  Your Cart
                </h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                  {totalProducts} item{totalProducts !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 px-6">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <ShoppingBag
                    size={24}
                    className="text-gray-300 dark:text-zinc-600"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 text-center">
                  Your cart is empty
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white underline underline-offset-4"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 px-5 py-4 group hover:bg-gray-50/60 dark:hover:bg-zinc-900/60 transition-colors"
                    >
                      {/* Image */}
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                        <Image
                          src={
                            item?.metadata?.image || "/product-placeholder.png"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                            aria-label="Remove item"
                          >
                            <X size={10} />
                          </button>
                        </div>

                        {formatVariants(item) && (
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                            {formatVariants(item)}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty controls */}
                          <div className="flex items-center gap-0.5 border border-gray-200 dark:border-zinc-700 rounded-full overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                              <Minus
                                size={10}
                                className="text-gray-600 dark:text-zinc-400"
                              />
                            </button>
                            <span className="text-xs font-bold text-gray-900 dark:text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={
                                typeof item.metadata?.maxQuantity ===
                                  "number" &&
                                item.quantity >= item.metadata.maxQuantity
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                              <Plus
                                size={10}
                                className="text-gray-600 dark:text-zinc-400"
                              />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              ৳
                              {(
                                (item.discountedPrice ?? item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                            {item.discountedPrice &&
                              item.price > item.discountedPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  ৳
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-5 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                      ৳{totals?.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-full py-3.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                  >
                    Checkout
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Full-Screen Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer panel — slides in from right */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-8 pb-5 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Your Cart
                </h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                  {totalProducts} item{totalProducts !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <ShoppingBag
                    size={28}
                    className="text-gray-300 dark:text-zinc-600"
                  />
                </div>
                <p className="text-base font-bold text-gray-400 dark:text-zinc-500 text-center">
                  Your cart is empty
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Start Shopping <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 px-5 py-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                        <Image
                          src={
                            item.metadata?.image || "/product-placeholder.png"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => handleRemoveProduct(item.id)}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                            aria-label="Remove item"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        {formatVariants(item) && (
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                            {formatVariants(item)}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty controls */}
                          <div className="flex items-center gap-0.5 border border-gray-200 dark:border-zinc-700 rounded-full overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                              <Minus
                                size={12}
                                className="text-gray-600 dark:text-zinc-400"
                              />
                            </button>
                            <span className="text-sm font-bold text-gray-900 dark:text-white w-7 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={
                                typeof item.metadata?.maxQuantity ===
                                  "number" &&
                                item.quantity >= item.metadata.maxQuantity
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                            >
                              <Plus
                                size={12}
                                className="text-gray-600 dark:text-zinc-400"
                              />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              ৳
                              {(
                                (item.discountedPrice ?? item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                            {item.discountedPrice &&
                              item.price > item.discountedPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  ৳
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drawer Footer */}
                <div className="px-5 py-6 border-t border-gray-100 dark:border-zinc-800 space-y-4 bg-white dark:bg-zinc-950">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                      ৳{totals?.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-full py-4 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
                  >
                    Checkout
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
