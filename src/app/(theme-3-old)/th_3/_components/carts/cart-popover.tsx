"use client"
import Link from "next/link"
import { useCart, useCartStore } from "@/lib/cart"
import type { CartItem as StoreCartItem } from "@/lib/cart"
import { ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export const CartPopover = ({
  isCartOpen,
  setIsCartOpen,
}: {
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}) => {
  const t = useTranslations("Theme3.header")
  const { updateItem, removeItem } = useCart()
  // Get cart items and totals from store (reactive)
  const items = useCartStore((state) => state.items)
  const totals = useCartStore((state) => state.totals)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return // item not found

    // Check maxQuantity
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
  // Format variants as a string for display (e.g., "Size: L, Color: Red")
  const formatVariants = (item: StoreCartItem): string | undefined => {
    if (!item.variants || item.variants.length === 0) {
      return undefined
    }
    return item.variants.map((v) => `${v.key}: ${v.value}`).join(", ")
  }
  const totalProducts = totals.itemCount
  console.log("Cart Items:", items)
  return (
    <>
      <div className="relative dropdown">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative cursor-pointer group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#30A16C] transition-colors" />
          <div className="text-left">
            <div className="font-semibold text-gray-900">
              ৳{totals?.subtotal?.toLocaleString()}
            </div>
          </div>
          <span className="absolute -top-2 -right-2 bg-[#30A16C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalProducts}
          </span>
        </button>

        {/* Cart Dropdown */}
        {isCartOpen && (
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border z-50">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">
                  {t("cart.shoppingCart")} ({totalProducts})
                </h3>
                <button
                  className="cursor-pointer"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b hover:bg-gray-50 relative"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={
                          item?.metadata?.image || "/product-placeholder.png"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {formatVariants(item)}
                      </p>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-lg font-bold text-[#30A16C]">
                          ৳{item?.discountedPrice?.toLocaleString()}
                        </div>

                        {/* Quantity Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Decrease button */}
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="
      w-8 h-8
      flex items-center justify-center
      rounded-full
      border border-gray-300
      text-gray-700
      hover:bg-green-100 hover:text-[#30A16C]
      transition
      disabled:opacity-50 disabled:cursor-not-allowed
    "
                          >
                            -
                          </button>

                          {/* Quantity display */}
                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>

                          {/* Increase button */}
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              typeof item.metadata?.maxQuantity === "number" &&
                              item.quantity >= item.metadata.maxQuantity
                            }
                            className="
      w-8 h-8
      flex items-center justify-center
      rounded-full
      border border-gray-300
      text-gray-700
      hover:bg-green-100 hover:text-[#30A16C]
      transition
      disabled:opacity-50 disabled:cursor-not-allowed
    "
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveProduct(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">{t("cart.total")}:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ৳{totals?.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 border-2 border-[#30A16C] text-[#30A16C] hover:bg-green-50 py-3 rounded-lg text-center font-semibold transition-colors"
                >
                  {t("cart.viewCart")}
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 bg-[#30A16C] hover:bg-[#288a5a] text-white py-3 rounded-lg text-center font-semibold transition-colors"
                >
                  {t("cart.checkout")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar for Mobile */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {t("cart.shoppingCart")} ({totalProducts})
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border-b">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.metadata?.image || "/product-placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-[#30A16C]">
                        ${item.price}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded-full border">
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button className="w-6 h-6 rounded-full border">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">
                  {t("cart.total")}:
                </span>
                <span className="text-2xl font-bold text-[#30A16C]">
                  ${totals?.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 border-2 border-[#30A16C] text-[#30A16C] py-3 rounded-lg text-center font-semibold"
                >
                  {t("cart.viewCart")}
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 bg-[#30A16C] hover:bg-[#288a5a] text-white py-3 rounded-lg text-center font-semibold"
                >
                  {t("cart.checkout")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
