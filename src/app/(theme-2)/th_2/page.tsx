import React from "react"
import { Banner } from "./_components/banner/banner"
import { FeaturesSection } from "./_components/features/features-section"
import { CategoriesSection } from "./_components/categories/categories-section"
import { DynamicSections } from "./_components/sections/dynamic-sections"

export default function Theme_2() {
  return (
    <>
      <Banner />
      <CategoriesSection />
      <DynamicSections />
      <FeaturesSection />
    </>
  )
}
