import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"

type OrderDetailsResponse = {
  data?: {
    order_no?: string
    created_at?: string
    customer_name?: string
    phone?: string
    address?: string
    online_payment_id?: number | null
    order_details?: Array<{
      id: number
      product_qty: number
      unit_price: number
      variant?: string | null
      variation?: { variant?: string; media?: string | null } | null
      product?: {
        product_name?: string
        main_image?: string | null
        wp_product_image_url?: string | null
      } | null
    }>
    pricing?: {
      grand_total?: number
      shipping_cost?: number
    }
  }
}

export default async function OrderSuccessDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  if (!orderId) notFound()

  const headers = await getDomainHeaders()
  const response = await api.get<OrderDetailsResponse>(
    `/customer/order/${orderId}/details`,
    { headers }
  )
  const order = response?.data?.data

  if (!order) {
    return <div className="p-4 text-center">Order details not found.</div>
  }

  const shipping = Number(order.pricing?.shipping_cost ?? 0)
  const grandTotal = Number(order.pricing?.grand_total ?? 0)
  const total = grandTotal + shipping

  return (
    <main className="min-h-[60vh] py-10">
      <div className="container max-w-4xl space-y-6">
        <div className="rounded-xl border bg-white p-6">
          <h1 className="text-2xl font-bold">Order Placed Successfully</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you! We received your order.
          </p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <p>
              <span className="font-medium">Order:</span> #
              {order.order_no || "-"}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString("en-BD")
                : "-"}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {order.online_payment_id ? "Online Payment" : "Cash on Delivery"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Items</h2>
          <div className="mt-4 space-y-4">
            {order.order_details?.map((item) => {
              const variationLabel = item.variation?.variant
              const fallbackVariant =
                typeof item.variant === "string" ? item.variant : ""
              const safeFallbackVariant = /^\d+$/.test(fallbackVariant.trim())
                ? ""
                : fallbackVariant
              const displayVariant = variationLabel || safeFallbackVariant

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        item.variation?.media ||
                        item.product?.main_image ||
                        item.product?.wp_product_image_url ||
                        "/placeholder.jpg"
                      }
                      alt={item.product?.product_name || "Product"}
                      width={64}
                      height={64}
                      className="rounded-md border object-contain"
                    />
                    <div>
                      <p className="font-medium">
                        {item.product?.product_name || "Product"}
                        {displayVariant ? ` (${displayVariant})` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.product_qty}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ৳ {item.product_qty * item.unit_price}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free Delivery" : `৳ ${shipping}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>৳ {total}</span>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
