import Link from "next/link"
import { footerNavigationHrefs, footerLegalsHrefs } from "../../_constants"
import { FunnellinerLogo } from "@/components/shared/ui/funnelliner-logo"
import { getTranslations } from "next-intl/server"
import { FooterBrandLogo } from "./footer-brand-logo"
import { FooterCopyright } from "./footer-copyright"
import { FooterSocials } from "./footer-socials"
import { FooterCategories } from "./footer-categories"

const paymentMethods = [
  { name: "bKash", color: "text-[#E2136E]" },
  { name: "Nagad", color: "text-[#F6921E]" },
  { name: "Visa", color: "text-[#1A1F71]" },
  { name: "COD", color: "text-[#2E7D32]" },
]

function PaymentIcons() {
  return (
    <div className="flex items-center gap-3 mt-6">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        Accepting:
      </span>
      <div className="flex items-center gap-2">
        {paymentMethods.map((method) => (
          <span
            key={method.name}
            className={`text-[10px] font-bold px-2 py-1 bg-background border rounded ${method.color}`}
          >
            {method.name}
          </span>
        ))}
      </div>
    </div>
  )
}

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
            <PaymentIcons />
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
