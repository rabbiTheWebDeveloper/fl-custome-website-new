import React from "react"
import { Banner } from "./_components/banner/banner"
import { FeaturesSection } from "./_components/features/features-section"
import { WinterProductsSection } from "./_components/winter-products/winter-products-section"
import { CategoriesSection } from "./_components/categories/categories-section"
import { FeaturedSection } from "./_components/featured/featured-section"
import { PromoBanner } from "./_components/promo-banner/promo-banner"
import { api } from "@/lib/api-client"
import { IProductsApiResponse } from "./types/product"
import { getDomainHeaders } from "@/lib/domain"
import { ICategoriesApiResponse } from "./types/categories"

async function Theme_2() {
  const headers = await getDomainHeaders()
  const response = await api.getTyped<
    "/customer/products",
    IProductsApiResponse
  >("/customer/products", {
    headers,
  })

  const responseCategories = await api.getTyped<
    "/customer/categories",
    ICategoriesApiResponse
  >("/customer/categories", {
    headers,
  })
  // Ensure categories is always an array, even if API returns null/undefined
  const categories = Array.isArray(responseCategories.data)
    ? responseCategories.data
    : []

  const winterProducts = response.data

  const featuredProducts = response.data
  console.log(categories)
  return (
    <>
      <Banner />
      <FeaturesSection />
      <WinterProductsSection products={winterProducts} />
      <CategoriesSection categories={categories} />
      <FeaturedSection products={featuredProducts} />
      <PromoBanner />
    </>
  )
}

export default Theme_2
