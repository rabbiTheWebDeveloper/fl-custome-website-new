import type { Metadata } from "next"
import { Tiro_Bangla, Montserrat } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import "./globals.css"
import FooterUI from "./th_3/_components/footer"
import dynamic from "next/dynamic"
import { Providers } from "./th_3/providers"
import { cookies, headers } from "next/headers"
import { DynamicMeta } from "./th_3/_components/dynamic-meta"
import { getDomainMeta } from "@/lib/domain"
import { Toaster } from "sonner"
import { GoogleTagManager } from "@next/third-parties/google"
import { getDomainInfo } from "@/utils/api-helpers"

const Header = dynamic(() => import("./th_3/_components/header"), { ssr: true })

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, favicon } = await getDomainMeta()

  return {
    title: title || "Shop",
    description: description || "",
    icons: favicon ? { icon: favicon } : undefined,
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
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const host = (await headers()).get("host") || ""
  const cleanDomain = host.replace(/^www\./, "")
  const shopInfo = await getDomainInfo(cleanDomain)
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"

  // Pick font based on locale
  const fontClass = locale === "bn" ? banglaFont.variable : englishFont.variable
  const messages =
    locale === "bn"
      ? (await import("@/messages/bn.json")).default
      : (await import("@/messages/en.json")).default

  console.log(shopInfo?.other_script?.gtm_head, "shopInfo")
  return (
    <html lang={locale} className={`${fontClass} antialiased`}>
      <GoogleTagManager
        gtmId={
          typeof shopInfo?.other_script?.gtm_head === "string"
            ? shopInfo?.other_script?.gtm_head
            : ""
        }
      />
      <body
        data-new-gr-c-s-check-loaded="14.1271.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Toaster position="top-center" richColors />
            <DynamicMeta />
            <div style={{ display: "contents" }}>
              <Header />
              {children}
              {modal}
              <FooterUI shopInfo={shopInfo} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
