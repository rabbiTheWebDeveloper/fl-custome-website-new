// import type { Metadata } from "next"

import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
import { getCleanDomain } from "@/utils/domain"
import { getDomainInfo } from "@/utils/api-helpers"
import { DynamicMeta } from "./_component/dynamic-meta"
import Analytics from "@/components/Analytics"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // this funtion next thime replace
  const cleanDomain = await getCleanDomain()
  const shopInfo = await getDomainInfo(cleanDomain)
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <GoogleTagManager
        gtmId={
          typeof shopInfo?.other_script?.gtm_head === "string"
            ? shopInfo?.other_script?.gtm_head
            : ""
        }
      />
      <body suppressHydrationWarning>
        <Analytics
          tiktokPixelId={shopInfo?.pixel_id as string | undefined}
          clarityId={shopInfo?.ms_clarity_id as string | undefined}
        />
        <DynamicMeta domain={shopInfo} />
        <div style={{ display: "contents" }}>{children}</div>
      </body>
      <GoogleAnalytics
        gaId={
          typeof shopInfo?.other_script?.google_analytics === "string"
            ? shopInfo?.other_script?.google_analytics
            : ""
        }
      />
    </html>
  )
}
