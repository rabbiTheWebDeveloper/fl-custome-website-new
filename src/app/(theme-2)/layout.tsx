import type { Metadata } from "next"

import { Geist_Mono, Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { cookies } from "next/headers"
import "./th_2/globals.css"
import { Header } from "./th_2/_components/header/header"
import { Footer } from "./th_2/_components/footer/footer"
import { ThemeBrandProvider } from "./th_2/_components/theme/theme-brand-provider"
import { DynamicMeta } from "./th_2/_components/dynamic-meta"
import { DomainHydration } from "./th_2/_components/domain-hydration"
import { getDomainMeta } from "@/lib/domain"
import {
  getShopDomainData,
  getSectionsData,
  getCategoriesData,
} from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"
import { IShopResponse } from "./th_2/types/shop"
import { ICategory } from "./th_2/types/categories"
import { ISectionItem } from "./th_2/types/sections"
import { Toaster } from "sonner"
import Analytics from "@/components/Analytics"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, favicon } = await getDomainMeta()

  return {
    title: title || "Shop",
    description: description || "",
    icons: favicon ? { icon: favicon } : undefined,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"

  let initialDomain: IShopResponse | null = null
  let initialSections: ISectionItem[] | null = null
  let initialCategories: ICategory[] | null = null

  try {
    const cleanDomain = await getCleanDomain()
    const domainData = await getShopDomainData(cleanDomain)
    if (domainData && typeof domainData.shop_id === "number") {
      initialDomain = domainData as unknown as IShopResponse
      const [sectionsRes, categoriesRes] = await Promise.all([
        getSectionsData(cleanDomain, String(domainData.shop_id)),
        getCategoriesData(cleanDomain, String(domainData.shop_id)),
      ])
      initialSections = (sectionsRes?.data as ISectionItem[]) ?? null
      initialCategories = (categoriesRes?.data as ICategory[]) ?? null
    }
  } catch (err) {
    console.warn("[theme-2 layout] getShopDomainData failed:", err)
  }

  // Use explicit imports instead of dynamic template literals
  const messages =
    locale === "bn"
      ? (await import("@/messages/bn.json")).default
      : (await import("@/messages/en.json")).default

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-clip`}
      suppressHydrationWarning
    >
      <GoogleTagManager
        gtmId={
          typeof (initialDomain?.other_script as { gtm_head?: string })
            ?.gtm_head === "string"
            ? (initialDomain?.other_script as { gtm_head?: string })?.gtm_head
            : ""
        }
        gtmScriptUrl="https://www.googletagmanager.com/gtm.js"
      />
      <body className="overflow-x-clip" suppressHydrationWarning>
        <Analytics
          tiktokPixelId={initialDomain?.pixel_id as string | undefined}
          clarityId={initialDomain?.ms_clarity_id as string | undefined}
        />
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
  
          timeZone="Asia/Dhaka"
        >
          <ThemeBrandProvider>
            <DomainHydration
              initialDomain={initialDomain}
              initialSections={initialSections}
              initialCategories={initialCategories}
            >
              <Toaster position="top-center" richColors />
              <DynamicMeta />
              <div className="overflow-x-clip">
                <Header initialDomain={initialDomain} />
                {children}
                <Footer />
              </div>
            </DomainHydration>
          </ThemeBrandProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics
        gaId={
          typeof (initialDomain?.other_script as { google_analytics?: string })
            ?.google_analytics === "string"
            ? ((initialDomain?.other_script as { google_analytics?: string })
                .google_analytics ?? "")
            : ""
        }
      />
    </html>
  )
}
