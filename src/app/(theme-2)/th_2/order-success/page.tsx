import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="container max-w-lg text-center">
        <CheckCircle2 className="mx-auto mb-6 text-green-500 size-16" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Thank You For Your Order!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your order has been placed successfully. We will contact you shortly
          to confirm your order.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  )
}
