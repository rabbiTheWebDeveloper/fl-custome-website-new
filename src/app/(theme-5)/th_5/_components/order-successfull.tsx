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
    <div className="min-h-screen bg-white pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto relative">
        {/* ── Success Hero ── */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 mb-8 flex items-center justify-center border border-emerald-200 bg-emerald-50">
            <CheckCircle
              size={32}
              className="text-emerald-600"
              strokeWidth={1.5}
            />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-3">
            Order Confirmed
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-widest uppercase text-black mb-4 leading-tight">
            Thank you! 🎉
          </h1>
          <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
            Your order has been placed and is being prepared. You&apos;ll
            receive updates as it ships.
          </p>
        </div>

        {/* ── Order Meta Card ── */}
        <div className="bg-white border border-gray-200 p-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Order No */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
                Order No.
              </p>
              <button
                onClick={handleCopyOrderNo}
                className="flex items-center gap-1.5 group"
              >
                <p className="font-bold text-black text-[11px] uppercase tracking-widest">
                  #{order_no}
                </p>
                <Copy
                  size={12}
                  className="text-gray-300 group-hover:text-black transition-colors"
                />
              </button>
            </div>

            {/* Date */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
                Date
              </p>
              <p className="font-bold text-black text-[11px] uppercase tracking-widest">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
                Payment
              </p>
              <p className="font-bold text-black text-[11px] uppercase tracking-widest flex items-center gap-1.5">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
                Total
              </p>
              <p className="font-bold text-black text-[11px] uppercase tracking-widest">
                ৳
                {(pricing.grand_total + pricing.shipping_cost).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 flex items-center justify-center">
              <ShoppingBag size={16} className="text-black" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">
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
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-none last:pb-0"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
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
                    <p className="font-bold text-black text-[10px] uppercase tracking-widest line-clamp-2 leading-tight">
                      {item.product?.product_name}
                    </p>
                    {displayVariant && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        {displayVariant}
                      </p>
                    )}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                      Qty: {item.product_qty}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="font-bold text-black text-[11px] uppercase tracking-widest whitespace-nowrap">
                    ৳{(item.product_qty * item.unit_price).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="mt-6 pt-5 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <span>Subtotal</span>
              <span>৳{pricing.grand_total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-1.5">
                <Truck size={12} /> Shipping
              </span>
              <span>
                {pricing.shipping_cost === 0
                  ? "Free"
                  : `৳${pricing.shipping_cost.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-black pt-3 border-t border-gray-200 uppercase tracking-widest">
              <span className="text-[11px]">Total</span>
              <span className="text-sm">
                ৳
                {(pricing.grand_total + pricing.shipping_cost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Delivery Info ── */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 flex items-center justify-center">
              <MapPin size={16} className="text-black" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">
              Delivery Information
            </h3>
          </div>

          <div className="space-y-4">
            {customer_name && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-0.5">
                    Name
                  </p>
                  <p className="font-bold text-black text-[11px] uppercase tracking-widest">
                    {customer_name}
                  </p>
                </div>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-0.5">
                    Phone
                  </p>
                  <p className="font-bold text-black text-[11px] uppercase tracking-widest">
                    {phone}
                  </p>
                </div>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-0.5">
                    Address
                  </p>
                  <p className="font-bold text-black text-[11px] uppercase tracking-widest">
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
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
          >
            <Home size={14} />
            Continue Shopping
          </Link>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:border-black transition-colors"
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Help text */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-8">
          Order #{order_no} · Questions?{" "}
          <Link
            href="/"
            className="text-black hover:underline transition-colors"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default OrderSuccessfull
