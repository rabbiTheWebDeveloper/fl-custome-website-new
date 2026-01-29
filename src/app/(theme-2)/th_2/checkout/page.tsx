import { Metadata } from "next"
import { CheckoutForm } from "./_component/checkout-form"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Theme2.checkout")
  return {
    title: t("title"),
  }
}

export default async function CheckoutPage() {
  const t = await getTranslations("Theme2.checkout")
  return (
    <main className="bg-[#F9F9F9]">
      <div className="container py-16 md:pt-24 md:pb-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-base max-w-3xl md:text-[22px] leading-[140%] mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Checkout Form */}
        <CheckoutForm />
      </div>
    </main>
  )
}
