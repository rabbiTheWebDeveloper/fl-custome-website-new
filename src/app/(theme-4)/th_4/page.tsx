import HeroBanner from "./_components/hero-banner"
import CategorySlider from "./_components/category-slider"
import FeaturedProducts from "./_components/featured-products"
import TopSelling from "./_components/top-selling"
import NewArrival from "./_components/new-arrival"
import FlashSale from "./_components/flash-sale"
import AllFeaturedProducts from "./_components/all-featured-products"
import Scroll from "./_components/Scroll"
import { api } from "@/lib/api-client"
import { IProductsApiResponse } from "./types/product"
import { getDomainInfo, getSliderAndBannerData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"
import { parsePageNumber } from "@/utils"
import WebsiteTraffic from "./_components/website-traffic"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  let products: IProductsApiResponse["data"] = []
  let totalPages = 1
  let shopId = ""
  let sliderAndBannerData:
    | Awaited<ReturnType<typeof getSliderAndBannerData>>
    | undefined

  try {
    const cleanDomain = await getCleanDomain()
    sliderAndBannerData = await getSliderAndBannerData(cleanDomain)
    const shopInfo = await getDomainInfo(cleanDomain)
    shopId = shopInfo?.shop_id || ""
    const rawParams = await searchParams
    const page = parsePageNumber(rawParams.page)
    const { data: response } = await api.get<IProductsApiResponse>(
      `/customer/products?page=${page}`,
      undefined,
      {
        headers: { "shop-id": shopId },
        fetchOptions: { cache: "no-store" },
      }
    )
    products = response.data
    totalPages = response.last_page

    if (totalPages > 0 && page > totalPages) {
      redirect(`/?page=${totalPages}`)
    }
  } catch (err) {
    console.warn("[theme-4 Home] Failed to fetch data:", err)
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden sm:overflow-visible transition-colors duration-500">
      {/* Exquisite minimal ambient background grading */}
      <div className="pointer-events-none fixed inset-0 z-[-1] hidden dark:block bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {shopId && <WebsiteTraffic shopId={shopId} />}

      <main className="flex flex-col gap-0 pb-16">
        <HeroBanner
          slides={sliderAndBannerData?.slider}
          banners={sliderAndBannerData?.banner}
        />

        <CategorySlider />

        {/* Top Selling — /customer/top_selling_products_for_website */}
        {shopId && <TopSelling shopId={shopId} />}

        {/* New Arrivals — /customer/new_arrival */}
        {shopId && <NewArrival shopId={shopId} />}

        {/* Flash Sale — /customer/flash_products */}
        {shopId && <FlashSale shopId={shopId} />}

        {/* Featured Products — /customer/featured_products */}
        {shopId && <AllFeaturedProducts shopId={shopId} />}

        {/* All Products (paginated) */}
        <FeaturedProducts products={products} totalPages={totalPages} />
      </main>

      <Scroll />
    </div>
  )
}
