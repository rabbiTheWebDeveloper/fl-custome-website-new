import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"
import { IContentApiResponse } from "../types/content"
import { PromoBanner } from "../_components/promo-banner/promo-banner"

export default async function TermsPage() {
  const headers = await getDomainHeaders()

  let contentResponse: IContentApiResponse | null = null
  try {
    const response = await api.get<IContentApiResponse>(
      "/shops/content?type=tos",
      undefined,
      {
        headers,
      }
    )
    contentResponse = response.data
  } catch (error) {
    console.error("Failed to fetch terms content:", error)
  }

  let htmlContent: string | null = null

  if (contentResponse) {
    if (contentResponse.data) {
      if (typeof contentResponse.data === "string") {
        htmlContent = contentResponse.data
      } else if (
        Array.isArray(contentResponse.data) &&
        contentResponse.data.length > 0
      ) {
        const firstItem = contentResponse.data[0]
        htmlContent = firstItem?.content || firstItem?.description || null
      } else if (
        typeof contentResponse.data === "object" &&
        "content" in contentResponse.data
      ) {
        htmlContent =
          (contentResponse.data as { content?: string }).content || null
      }
    } else if (typeof contentResponse === "string") {
      htmlContent = contentResponse
    }
  }

  return (
    <main>
      {/* Banner */}
      <div className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-2xl mx-auto leading-[150%]">
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Terms Content */}
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
                [&>b]:font-bold [&>b]:text-primary [&>strong]:font-bold [&>strong]:text-primary
                [&>ul]:text-left [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-muted-foreground [&>ul>li]:mb-2
                [&>ol]:text-left [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:text-muted-foreground [&>ol>li]:mb-2"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground text-base md:text-lg">
              Terms & Conditions content is not available at the moment.
            </p>
          </div>
        )}
      </div>

      <PromoBanner />
    </main>
  )
}
