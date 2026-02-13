import Link from "next/link"
import { footerNavigationHrefs, footerLegalsHrefs } from "../../_constants"
import { FunnellinerLogo } from "@/components/shared/ui/funnelliner-logo"
import { getTranslations } from "next-intl/server"
import { FooterBrandLogo } from "./footer-brand-logo"
import { FooterCopyright } from "./footer-copyright"
import { FooterSocials } from "./footer-socials"
import { FooterCategories } from "./footer-categories"

export async function Footer() {
  const t = await getTranslations("Theme2.footer")
  const tHeaderFooter = await getTranslations("Theme2.headerFooter")

  return (
    <footer className="bg-[#F9F9F9]">
      <div className="container pt-12 pb-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Social */}
          <div>
            <FooterBrandLogo />

            <FooterSocials />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-[#595959] mb-4 uppercase">
              {t("navigation")}
            </h4>
            <ul className="space-y-4">
              {footerNavigationHrefs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{tHeaderFooter(link.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <FooterCategories />

          {/* Legals */}
          <div>
            <h4 className="font-bold text-[#595959] mb-4 uppercase">
              {t("legals")}
            </h4>
            <ul className="space-y-4">
              {footerLegalsHrefs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{tHeaderFooter(link.key)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <a
          href="https://funnelliner.com/"
          target="_blank"
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <FooterCopyright />
          <div className="flex items-center gap-2 bg-[#894bca] rounded-[8px] text-white p-1">
            <p className="pl-1">Made by</p>

            <div className="py-1 px-2 bg-white text-primary rounded-[6px]">
              <FunnellinerLogo className="h-5" />
            </div>
          </div>
        </a>
      </div>
    </footer>
  )
}
