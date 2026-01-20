import Link from "next/link"
import { Facebook, XIcon, YouTube } from "../ui/social-icons"
import {
  footerNavigationHrefs,
  footerCategoriesHrefs,
  footerLegalsHrefs,
} from "../../_constants"
import { Button } from "../ui/button"
import { FunnellinerLogo } from "@/components/shared/ui/funnelliner-logo"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const t = await getTranslations("Theme2.footer")
  const tHeaderFooter = await getTranslations("Theme2.headerFooter")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#F9F9F9]">
      <div className="container pt-12 pb-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Social */}
          <div>
            <h3 className="font-bold text-xl mb-4">BRAND LOGO</h3>
            <p className="text-muted-foreground mb-4">
              {t("brandDescription")}
            </p>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="size-10 bg-white"
                asChild
              >
                <Link href="#">
                  <XIcon className="size-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10 bg-white"
                asChild
              >
                <Link href="#">
                  <YouTube className="size-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10 bg-white"
                asChild
              >
                <Link href="#">
                  <Facebook className="size-5" />
                </Link>
              </Button>
            </div>
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
          <div>
            <h4 className="font-bold text-[#595959] mb-4 uppercase">
              {t("categories")}
            </h4>
            <ul className="space-y-4">
              {footerCategoriesHrefs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{tHeaderFooter(link.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

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
          <p className="text-sm text-[#595959]">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-2 bg-primary rounded-[8px] text-white p-1">
            <p className="pl-1">{t("madeIn")}</p>

            <div className="py-1 px-2 bg-white text-primary rounded-[6px]">
              <FunnellinerLogo className="h-5" />
            </div>
          </div>
        </a>
      </div>
    </footer>
  )
}
