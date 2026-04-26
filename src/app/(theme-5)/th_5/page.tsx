import Th5HeroBanner from "./_components/hero-banner"
import MarqueeTicker from "./_components/marquee-ticker"
import Th5TrendAndArrival from "./_components/trend-and-arrival"
import PrimeDrop from "./_components/prime-drop"
import Th5TopSelling from "./_components/top-selling"
import CategoryGrid from "./_components/category-grid"
import LuxeLeatherBanner from "./_components/luxe-leather-banner"
import Th5NewArrival from "./_components/new-arrival"
import Th5FlashSale from "./_components/flash-sale"
import FeaturesStrip from "./_components/features-strip"
import { getDomainInfo, getSliderAndBannerData } from "@/utils/api-helpers"
import { getCleanDomain } from "@/utils/domain"

export const dynamic = "force-dynamic"

export default async function Th5HomePage() {
  let shopId = ""
  let sliderAndBannerData:
    | Awaited<ReturnType<typeof getSliderAndBannerData>>
    | undefined

  try {
    const cleanDomain = await getCleanDomain()
    sliderAndBannerData = await getSliderAndBannerData(cleanDomain)
    const shopInfo = await getDomainInfo(cleanDomain)
    shopId = shopInfo?.shop_id || ""
  } catch (err) {
    console.warn("[theme-5 Home] Failed to fetch data:", err)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ③ Hero banner / slider */}
      <Th5HeroBanner
        slides={sliderAndBannerData?.slider}
        banners={sliderAndBannerData?.banner}
      />

      {/* ④ Marquee ticker */}
      <MarqueeTicker />

      {/* ⑤ Features strip (Delivery / Returns / Trending / Quality) */}
      <FeaturesStrip />

      {/* ⑥ New in Trend / New Arrivals tabs */}
      {shopId && <Th5TrendAndArrival shopId={shopId} />}

      {/* ⑦ Prime Drop dark banner */}
      <PrimeDrop />

      {/* ⑧ Stories That Lead (top-selling products as story cards) */}
      {shopId && <Th5TopSelling shopId={shopId} />}

      {/* ⑨ Category grid (Backpack / Shoulder / Handbags) */}
      <CategoryGrid />

      {/* ⑩ Luxe Leather editorial black section */}
      <LuxeLeatherBanner banners={sliderAndBannerData?.banner} />

      {/* ⑪ New Arrivals standalone product grid */}
      {shopId && <Th5NewArrival shopId={shopId} />}

      {/* ⑫ Flash deals */}
      {shopId && <Th5FlashSale shopId={shopId} />}
    </div>
  )
}
