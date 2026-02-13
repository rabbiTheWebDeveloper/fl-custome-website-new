import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import "./globals.css"
import FooterUI from "./th_3/_components/footer"
import dynamic from "next/dynamic"
import { Providers } from "./th_3/providers"
import { cookies } from "next/headers"
import { DynamicMeta } from "./th_3/_components/dynamic-meta"
import { getDomainMeta } from "@/lib/domain"
import { Toaster } from "sonner"
import { GoogleTagManager } from "@next/third-parties/google"
const Header = dynamic(() => import("./th_3/_components/header"), { ssr: true })
export async function generateMetadata(): Promise<Metadata> {
  const { title, description, favicon } = await getDomainMeta()

  return {
    title: title || "Shop",
    description: description || "",
    icons: favicon ? { icon: favicon } : undefined,
  }
}

const ab = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
})
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { other_script } = await getDomainMeta()
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"
  return (
    <html lang={locale} className={`${ab.variable} antialiased`}>
      <GoogleTagManager gtmId={other_script?.gtm_head || ""} />
      <body
        data-new-gr-c-s-check-loaded="14.1271.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true"
      >
        <Providers>
          <NextIntlClientProvider>
            <Toaster position="top-center" richColors />
            <DynamicMeta />
            <div style={{ display: "contents" }}>
              <Header />
              {children}
              <FooterUI />
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
