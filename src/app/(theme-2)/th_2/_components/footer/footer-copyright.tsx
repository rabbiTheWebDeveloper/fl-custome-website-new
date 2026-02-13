"use client"

import { useTranslations } from "next-intl"
import { useDomain } from "../../store/domain"

export function FooterCopyright() {
  const t = useTranslations("Theme2.footer")
  const domain = useDomain((state) => state.domain)
  const currentYear = new Date().getFullYear()
  const shopName = domain?.name || "Brand Name"

  return (
    <p className="text-sm text-[#595959]">
      © {shopName} {currentYear} | {t("allRightsReserved")}
    </p>
  )
}
