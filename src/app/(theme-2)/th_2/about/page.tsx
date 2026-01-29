import Link from "next/link"
import { Button } from "../_components/ui/button"
import { PromoBanner } from "../_components/promo-banner/promo-banner"
import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"
import { IContentApiResponse } from "../types/content"

export default async function AboutPage() {
  const headers = await getDomainHeaders()

  let aboutContent: IContentApiResponse | null = null
  try {
    const response = await api.get<IContentApiResponse>(
      "/shops/content?type=about_us",
      undefined,
      {
        headers,
      }
    )
    aboutContent = response.data
  } catch (error) {
    console.error("Failed to fetch about content:", error)
  }

  // Handle different response structures
  // The API might return raw HTML in different formats:
  // 1. Direct string in response.data
  // 2. Array with content items where first item has content/description
  // 3. Object with content property
  let htmlContent: string | null = null

  if (aboutContent) {
    // Check if data exists and handle different structures
    if (aboutContent.data) {
      if (typeof aboutContent.data === "string") {
        // Raw HTML string directly in data
        htmlContent = aboutContent.data
      } else if (
        Array.isArray(aboutContent.data) &&
        aboutContent.data.length > 0
      ) {
        // Array of content items - get content from first item
        const firstItem = aboutContent.data[0]
        htmlContent = firstItem?.content || firstItem?.description || null
      } else if (
        typeof aboutContent.data === "object" &&
        "content" in aboutContent.data
      ) {
        // Object with content property
        htmlContent =
          (aboutContent.data as { content?: string }).content || null
      }
    }
    // Also check if the response itself is a string (unlikely but possible)
    else if (typeof aboutContent === "string") {
      htmlContent = aboutContent
    }
  }

  return (
    <main>
      {/* Banner */}
      <div className="relative min-w-0 flex-[0_0_100%] h-[600px] md:h-[800px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/temp/temp-slider-1.png)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl mx-auto leading-[150%]">
              Wear Your Confidence
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Fresh fits made for real life. Style that keeps you looking sharp
              without trying too hard.
            </p>
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-md">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container px-4 py-16 md:pt-24 md:pb-10">
        {htmlContent ? (
          <div className="flex justify-center">
            <div
              className="about-html-content prose prose-lg max-w-4xl text-center 
                [&>p]:text-base [&>p]:md:text-lg [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-6 
                [&>h1]:text-2xl [&>h1]:md:text-3xl [&>h1]:lg:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-foreground [&>h1]:leading-tight
                [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:mb-5 [&>h2]:text-foreground [&>h2]:leading-snug
                [&>h3]:text-lg [&>h3]:md:text-xl [&>h3]:font-semibold [&>h3]:mb-4 [&>h3]:text-foreground [&>h3]:leading-normal
                [&>h4]:text-base [&>h4]:md:text-lg [&>h4]:font-semibold [&>h4]:mb-3 [&>h4]:text-foreground [&>h4]:leading-normal
                [&>h5]:text-sm [&>h5]:md:text-base [&>h5]:font-semibold [&>h5]:mb-2 [&>h5]:text-foreground [&>h5]:leading-normal
                [&>h6]:text-xs [&>h6]:md:text-sm [&>h6]:font-semibold [&>h6]:mb-2 [&>h6]:text-foreground [&>h6]:leading-normal
                [&>b]:font-bold [&>b]:text-primary [&>strong]:font-bold [&>strong]:text-primary"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        ) : (
          <>
            {/* Fallback content if API fails */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About Us - FunnelLiner
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                At FunnelLiner, we&apos;re all about leveling up your wardrobe
                without making it complicated. We started with one simple idea:
                fashion should be fresh, comfortable, and actually affordable.
                No gatekeeping, no boring basics — just good vibes and great
                fits.
              </p>
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <PromoBanner />
    </main>
  )
}
