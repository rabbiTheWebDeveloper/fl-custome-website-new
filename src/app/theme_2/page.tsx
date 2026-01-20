import React from "react"
import { Banner } from "./_components/banner/banner"
import { FeaturesSection } from "./_components/features/features-section"
import { WinterProductsSection } from "./_components/winter-products/winter-products-section"
import { CategoriesSection } from "./_components/categories/categories-section"
import { FeaturedSection } from "./_components/featured/featured-section"
import { PromoBanner } from "./_components/promo-banner/promo-banner"

function Theme_2() {
  return (
    <>
      <Banner />
      <FeaturesSection />
      <WinterProductsSection />
      <CategoriesSection />
      <FeaturedSection />
      <PromoBanner />
    </>
  )
}

export default Theme_2
