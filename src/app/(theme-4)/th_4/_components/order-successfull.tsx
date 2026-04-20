"use client"
import { useEffect, useRef } from "react"
import {
  CheckCircle,
  Package,
  CreditCard,
  MapPin,
  User,
  Phone,
  ShoppingBag,
  ArrowRight,
  Copy,
  Truck,
  Home,
} from "lucide-react"
import { IOrderSuccessfullData } from "../types/order-successfull"
import Image from "next/image"
import { purchaseTagManagerEventForPurchase } from "@/lib/tag-manager-event"
import Link from "next/link"

import { toast } from "sonner"

const OrderSuccessfull = ({
  order_details,
  created_at,
  order_no,
  online_payment_id,
  pricing,
  gateway: _gateway,
  gtmHead: _gtmHead,
  customer_name,
  phone,
  address,
  brandColor: _brandColor,
}: IOrderSuccessfullData & { brandColor?: string }) => {
  const hasFired = useRef(false)

  useEffect(() => {
    if (!order_no || !order_details?.length || hasFired.current) return
    const purchaseKey = `purchase_fired_${order_no}`
    if (sessionStorage.getItem(purchaseKey)) {
      hasFired.current = true
      return
    }
    hasFired.current = true
    sessionStorage.setItem(purchaseKey, "true")
    const customerDataInfo = {
      order_no,
      customer_name,
      address,
      phone,
      value: pricing.grand_total + pricing.shipping_cost,
    }
    const orderData = { order_details }
    purchaseTagManagerEventForPurchase("purchase", customerDataInfo, orderData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_no])

  const handleCopyOrderNo = () => {
    navigator.clipboard.writeText(String(order_no))
    toast.success("Order number copied!")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-24 px-4">
      {/* Subtle green glow */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center pt-20">
        <div className="w-[500px] h-[400px] rounded-full bg-emerald-50 dark:bg-emerald-950/20 blur-3xl opacity-70" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* ── Success Hero ── */}
        <div className="text-center mb-10">
          {/* Pulsing icon badge */}
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 animate-ping opacity-30" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center">
              <CheckCircle
                size={44}
                className="text-emerald-600 dark:text-emerald-400"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400 mb-3">
            Order Confirmed
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 leading-tight">
            Thank you! 🎉
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your order has been placed and is being prepared. You&apos;ll
            receive updates as it ships.
          </p>
        </div>

        {/* ── Order Meta Card ── */}
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 shadow-sm p-6 sm:p-8 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Order No */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-2">
                Order No.
              </p>
              <button
                onClick={handleCopyOrderNo}
                className="flex items-center gap-1.5 group"
              >
                <p className="font-black text-gray-900 dark:text-white text-base">
                  #{order_no}
                </p>
                <Copy
                  size={12}
                  className="text-gray-300 dark:text-zinc-700 group-hover:text-gray-800 dark:group-hover:text-white transition-colors"
                />
              </button>
            </div>

            {/* Date */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-2">
                Date
              </p>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {created_at
                  ? new Date(created_at).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>

            {/* Payment */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-2">
                Payment
              </p>
              <p className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                {online_payment_id ? (
                  <>
                    <CreditCard size={13} /> Online
                  </>
                ) : (
                  <>
                    <Package size={13} /> COD
                  </>
                )}
              </p>
            </div>

            {/* Total */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-2">
                Total
              </p>
              <p className="font-black text-gray-900 dark:text-white text-xl tracking-tight">
                ৳
                {(pricing.grand_total + pricing.shipping_cost).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 shadow-sm p-6 sm:p-8 mb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
              <ShoppingBag
                size={13}
                className="text-gray-600 dark:text-zinc-400"
              />
            </div>
            <h3 className="text-sm font-black tracking-tight text-gray-900 dark:text-white">
              Items Ordered
            </h3>
          </div>

          <div className="space-y-4">
            {order_details?.map((item) => {
              const variationLabel = item.variation?.variant
              const fallbackVariant =
                typeof item.variant === "string" ? item.variant : ""
              const safeFallbackVariant = /^\d+$/.test(fallbackVariant.trim())
                ? ""
                : fallbackVariant
              const displayVariant: string =
                variationLabel ?? safeFallbackVariant ?? ""

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-zinc-900 last:border-none last:pb-0"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 flex-shrink-0 border border-gray-100 dark:border-zinc-800">
                    <Image
                      src={
                        item.variation?.wp_product_image_url ||
                        item?.variation?.media ||
                        item.product?.main_image ||
                        item.product?.wp_product_image_url ||
                        "/placeholder.jpg"
                      }
                      alt={item.product?.product_name || "Product"}
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
                      {item.product?.product_name}
                    </p>
                    {displayVariant && (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                        {displayVariant}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                      Qty: {item.product_qty}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="font-black text-gray-900 dark:text-white text-sm whitespace-nowrap">
                    ৳{(item.product_qty * item.unit_price).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-900 space-y-3">
            <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>৳{pricing.grand_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Truck size={12} /> Shipping
              </span>
              <span>
                {pricing.shipping_cost === 0
                  ? "Free"
                  : `৳${pricing.shipping_cost.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-zinc-900">
              <span className="text-sm">Total</span>
              <span className="text-xl tracking-tight">
                ৳
                {(pricing.grand_total + pricing.shipping_cost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Delivery Info ── */}
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
              <MapPin size={13} className="text-gray-600 dark:text-zinc-400" />
            </div>
            <h3 className="text-sm font-black tracking-tight text-gray-900 dark:text-white">
              Delivery Information
            </h3>
          </div>

          <div className="space-y-4">
            {customer_name && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <User
                    size={15}
                    className="text-gray-500 dark:text-zinc-400"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-zinc-600 mb-0.5">
                    Name
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {customer_name}
                  </p>
                </div>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Phone
                    size={15}
                    className="text-gray-500 dark:text-zinc-400"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-zinc-600 mb-0.5">
                    Phone
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {phone}
                  </p>
                </div>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <MapPin
                    size={15}
                    className="text-gray-500 dark:text-zinc-400"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-zinc-600 mb-0.5">
                    Address
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform shadow-xl"
          >
            <Home size={14} />
            Continue Shopping
          </Link>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 hover:scale-[1.02] active:scale-[0.97] transition-all"
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 dark:text-zinc-600 mt-6">
          Order #{order_no} · Questions?{" "}
          <Link
            href="/"
            className="font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default OrderSuccessfull
