import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import "./globals.css"
import FooterUI from "./th_3/_components/footer"
import { Toaster } from "@/components/ui/sonner"
import dynamic from "next/dynamic"
import { Providers } from "./th_3/providers"
import { cookies } from "next/headers"
const Header = dynamic(() => import('./th_3/_components/header'), { ssr: true })
export const metadata: Metadata = {
  title: "Ecommerce Website",
  description: "Ecommerce Website",
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
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"
 const messages =
    locale === "bn"
      ? (await import("@/messages/bn.json")).default
      : (await import("@/messages/en.json")).default
  return (
    <html  lang={locale} className={`${ab.variable} antialiased`}>
      <body data-new-gr-c-s-check-loaded="14.1271.0" data-gr-ext-installed="" cz-shortcut-listen="true" >
        <Providers>
          <NextIntlClientProvider>
            <div style={{ display: "contents" }}>
              <Header />
              {children}
              <FooterUI />
            </div>
          </NextIntlClientProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
