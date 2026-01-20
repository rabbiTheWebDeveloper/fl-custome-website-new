import { FeatureCard } from "./feature-card"
import { HandshakeIcon, HeadphoneIcon, MoneyIcon, ShieldIcon } from "./icons"
import { getTranslations } from "next-intl/server"

export const FeaturesSection = async () => {
  const t = await getTranslations("Theme2.features")

  const features = [
    {
      icon: ShieldIcon,
      title: t("quality.title"),
      description: t("quality.description"),
    },
    {
      icon: MoneyIcon,
      title: t("moneyBack.title"),
      description: t("moneyBack.description"),
    },
    {
      icon: HeadphoneIcon,
      title: t("support.title"),
      description: t("support.description"),
    },
    {
      icon: HandshakeIcon,
      title: t("reliability.title"),
      description: t("reliability.description"),
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
