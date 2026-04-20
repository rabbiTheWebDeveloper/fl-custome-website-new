import type { Metadata } from "next"
import { Tiro_Bangla, Montserrat } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import "./globals.css"
import FooterUI from "./th_4/_components/footer"
import dynamic from "next/dynamic"
import { Providers } from "./th_4/providers"
import { cookies } from "next/headers"
import { DynamicMeta } from "./th_4/_components/dynamic-meta"
import { getDomainMeta } from "@/lib/domain"
import { Toaster } from "sonner"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
import { getShopDomainData, getCategoriesData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"
import { IShopResponse } from "./th_4/types/shop"
import { ICategory } from "./th_4/types/categories"
import { DomainHydration } from "./th_4/_components/domain-hydration"
import FloatingContact from "./th_4/_components/FloatingContact"
import Analytics from "@/components/Analytics"

const Header = dynamic(() => import("./th_4/_components/header"), { ssr: true })

export async function generateMetadata(): Promise<Metadata> {
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getShopDomainData(cleanDomain)
  const { title, description, favicon, domain_verify } = await getDomainMeta()
  const facebookDomainVerification =
    domain_verify || (shopInfo?.domain_verify as string | undefined)
  return {
    title: title || (shopInfo?.shop_meta_title as string) || "Shop",
    description:
      description || (shopInfo?.shop_meta_description as string) || "",
    icons: favicon
      ? {
          icon: [{ url: favicon }],
          shortcut: [{ url: favicon }],
          apple: [{ url: favicon }],
        }
      : undefined,
    other: facebookDomainVerification
      ? {
          "facebook-domain-verification": facebookDomainVerification,
        }
      : undefined,
  }
}
// Load two fonts
const englishFont = Montserrat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-english",
})

const banglaFont = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali"],
  variable: "--font-bangla",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cleanDomain = await getCleanDomain()
  let shopInfo: Record<string, unknown> | null = null
  let initialDomain: IShopResponse | null = null
  let initialCategories: ICategory[] | null = null

  try {
    const domainData = await getShopDomainData(cleanDomain)
    shopInfo = domainData
    if (domainData && typeof domainData.shop_id === "number") {
      initialDomain = domainData as unknown as IShopResponse
      const categoriesRes = await getCategoriesData(
        cleanDomain,
        String(domainData.shop_id)
      )
      initialCategories = (categoriesRes?.data as ICategory[]) ?? null
    }
  } catch (err) {
    console.warn("[theme-3 layout] getShopDomainData failed:", err)
  }

  await getDomainMeta()
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"

  // Pick font based on locale
  const fontClass = locale === "bn" ? banglaFont.variable : englishFont.variable
  const messages =
    locale === "bn"
      ? (await import("@/messages/bn.json")).default
      : (await import("@/messages/en.json")).default

  return (
    <html
      lang={locale}
      className={`${fontClass} antialiased`}
      suppressHydrationWarning
    >
      <GoogleTagManager
        gtmId={
          typeof (shopInfo?.other_script as { gtm_head?: string })?.gtm_head ===
          "string"
            ? (shopInfo?.other_script as { gtm_head?: string })?.gtm_head
            : ""
        }
        gtmScriptUrl="https://www.googletagmanager.com/gtm.js"
      />
      <body suppressHydrationWarning>
        <Analytics
          tiktokPixelId={shopInfo?.pixel_id as string | undefined}
          clarityId={shopInfo?.ms_clarity_id as string | undefined}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <DomainHydration
              initialDomain={initialDomain}
              initialCategories={initialCategories}
            >
              <Toaster position="top-center" richColors />
              <DynamicMeta />
              <div style={{ display: "contents" }}>
                <Header initialDomain={initialDomain} />
                {children}
                <FooterUI
                  domainInfo={
                    shopInfo as {
                      shop_logo?: string | null
                      name?: string | null
                      shop_address?: string | null
                      phone?: string | null
                    } | null
                  }
                />
                <FloatingContact
                  whatsapp={shopInfo?.whatsapp as string | null | undefined}
                  messenger={shopInfo?.fb_page_id as string | null | undefined}
                />
              </div>
            </DomainHydration>
          </Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics
        gaId={
          typeof (shopInfo?.other_script as { google_analytics?: string })
            ?.google_analytics === "string"
            ? ((shopInfo?.other_script as { google_analytics?: string })
                .google_analytics ?? "")
            : ""
        }
      />
    </html>
  )
}
