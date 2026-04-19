import Link from "next/link"
import { footerNavigationHrefs, footerLegalsHrefs } from "../../_constants"
import { FunnellinerLogo } from "@/components/shared/ui/funnelliner-logo"
import { getTranslations } from "next-intl/server"
import { FooterBrandLogo } from "./footer-brand-logo"
import { FooterCopyright } from "./footer-copyright"
import { FooterSocials } from "./footer-socials"
import { FooterCategories } from "./footer-categories"
import Image from "next/image"

export async function Footer() {
  const t = await getTranslations("Theme2.footer")
  const tHeaderFooter = await getTranslations("Theme2.headerFooter")

  return (
    <footer className="bg-muted/60">
      <div className="container pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <FooterBrandLogo />
            <FooterSocials />
          </div>

          <div>
            <h4 className="font-bold text-muted-foreground mb-5 uppercase text-sm tracking-wide">
              {t("navigation")}
            </h4>
            <ul className="space-y-3">
              {footerNavigationHrefs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tHeaderFooter(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <FooterCategories />

          <div>
            <h4 className="font-bold text-muted-foreground mb-5 uppercase text-sm tracking-wide">
              {t("legals")}
            </h4>
            <ul className="space-y-3">
              {footerLegalsHrefs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tHeaderFooter(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full flex items-center justify-center py-6">
          <div className="w-full max-w-2xl px-4 md:px-0">
            <img
              src="https://gadgetbd.com/wp-content/uploads/2020/03/SSLCommerz-Pay-With-logo-All-Size-01-2048x330.png"
              alt="Secure Payment Methods"
              className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <FooterCopyright />
          <div className="flex items-center gap-2 bg-[#7f49d4] rounded-lg text-primary-foreground p-1">
            <p className="pl-1 text-sm">Made by</p>
            <a
              href="https://funnelliner.com/"
              target="_blank"
              className="py-1 px-2 bg-white text-[#7f49d4] rounded-md"
            >
              <FunnellinerLogo className="h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
