"use client"
import { useEffect, useRef } from "react"
import { ShoppingCart, CreditCard } from "lucide-react"
import { IOrderSuccessfullData } from "../types/order-successfull"
import Image from "next/image"
import { purchaseTagManagerEventForPurchase } from "@/lib/tag-manager-event"
import Link from "next/link"
const OrderSuccessfull = ({
  order_details,
  created_at,
  order_no,
  online_payment_id,
  pricing,
  gtmHead,
  customer_name,
  phone,
  address,
}: IOrderSuccessfullData) => {
  const finalTotals = { total: pricing.grand_total + pricing.shipping_cost }
  const customerDataInfo = {
    order_no,
    customer_name,
    address,
    phone,
    value: finalTotals.total,
  }
  const orderData = { order_details }

  useEffect(() => {
    if (!order_no || !order_details?.length) return

    const purchaseKey = `purchase_fired_${order_no}`

    // Stop if already fired for this order
    if (sessionStorage.getItem(purchaseKey)) {
      return
    }

    purchaseTagManagerEventForPurchase("purchase", customerDataInfo, orderData)

    sessionStorage.setItem(purchaseKey, "true")
  }, [order_no])

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== Success Header ===== */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-5">
            <ShoppingCart
              className="text-green-600 dark:text-green-400"
              size={36}
            />
          </div>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Order Placed Successfully 🎉
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            Thank you! Your order has been placed successfully.
          </p>
        </div>

        {/* ===== Order Summary Card ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-10 border dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                Order Number
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                #{order_no}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                Date
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {created_at
                  ? new Date(created_at).toLocaleString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                Payment
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {online_payment_id ? (
                  <>
                    <CreditCard size={16} />
                    Online Payment
                  </>
                ) : (
                  "Cash on Delivery"
                )}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                Total Amount
              </p>
              <p className="mt-1 font-bold text-xl text-green-600 dark:text-green-400">
                ৳ {pricing.grand_total + pricing.shipping_cost}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Order Details ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Order Details
          </h3>

          <div className="space-y-6">
            {order_details?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-6 last:border-none dark:border-gray-700"
              >
                <div className="flex items-center gap-5">
                  <Image
                    src={
                      item.variation?.wp_product_image_url ||
                      item?.variation?.media ||
                      item.product?.main_image ||
                      item.product?.wp_product_image_url ||
                      "/placeholder.jpg"
                    }
                    alt={item.product?.product_name}
                    width={80}
                    height={80}
                    className="rounded-lg border object-contain"
                  />

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.product?.product_name}
                      {item.variation?.variant
                        ? ` (${item.variation.variant})`
                        : ""}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Quantity: {item.product_qty}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-gray-900 dark:text-white">
                  ৳ {item.product_qty * item.unit_price}
                </p>
              </div>
            ))}
          </div>

          {/* ===== Pricing Summary ===== */}
          <div className="mt-10 border-t pt-6 dark:border-gray-700 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {pricing.shipping_cost === 0
                  ? "Free Delivery"
                  : `৳ ${pricing.shipping_cost}`}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600 dark:text-green-400">
                ৳ {pricing.grand_total + pricing.shipping_cost}
              </span>
            </div>
          </div>

          {/* ===== Customer Info ===== */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">
              Customer Information
            </h4>

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{customer_name || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{phone || "-"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{address || "-"}</p>
              </div>
            </div>
          </div>

          {/* ===== CTA Button ===== */}
          <div className="flex justify-center mt-12">
            <Link href="/">
              <button className="bg-green-600 hover:bg-green-700 transition-all text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderSuccessfull
