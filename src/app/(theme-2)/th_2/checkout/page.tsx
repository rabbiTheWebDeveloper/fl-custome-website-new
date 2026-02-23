import { Metadata } from "next"
import { CheckoutForm } from "./_component/checkout-form"
import { getTranslations } from "next-intl/server"
import { CheckIcon } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Theme2.checkout")
  return {
    title: t("title"),
  }
}

export default async function CheckoutPage() {
  const t = await getTranslations("Theme2.checkout")
  return (
    <main className="bg-muted">
      <div className="container py-16 md:pt-24 md:pb-10">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              <CheckIcon className="size-4" />
            </div>
            <span className="text-xs font-medium text-primary">Cart</span>
          </div>
          <div className="flex-1 h-0.5 bg-primary mx-2" />
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-xs font-medium text-primary">Checkout</span>
          </div>
          <div className="flex-1 h-0.5 bg-border mx-2" />
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-8 rounded-full bg-border text-muted-foreground flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Confirmation
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-base max-w-3xl md:text-[22px] leading-[140%] mx-auto text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <CheckoutForm />
      </div>
    </main>
  )
}
