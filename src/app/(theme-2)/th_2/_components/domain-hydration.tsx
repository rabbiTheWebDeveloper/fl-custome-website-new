"use client"

import { useEffect } from "react"
import { useDomain } from "../store/domain"
import { useCategories } from "../store/categories"
import { useSections } from "../store/sections"
import { IShopResponse } from "../types/shop"
import { ICategory } from "../types/categories"
import { ISectionItem } from "../types/sections"

interface DomainHydrationProps {
  initialDomain: IShopResponse | null
  initialSections: ISectionItem[] | null
  initialCategories: ICategory[] | null
}

export function DomainHydration({
  initialDomain,
  initialSections,
  initialCategories,
  children,
}: DomainHydrationProps & { children: React.ReactNode }) {
  const setDomain = useDomain((state) => state.setDomain)
  const setDomainAddress = useDomain((state) => state.setDomainAddress)
  const setCategories = useCategories((state) => state.setCategories)
  const setSections = useSections((state) => state.setSections)

  useEffect(() => {
    if (initialDomain) {
      setDomain(initialDomain)
      if (typeof window !== "undefined") {
        setDomainAddress(window.location.origin)
      }
    }
    if (initialSections) {
      setSections(initialSections)
    }
    if (initialCategories) {
      setCategories({
        message: "success",
        success: true,
        error_type: "",
        execution_time: 0,
        data: initialCategories,
      })
    }
  }, [
    initialDomain,
    initialSections,
    initialCategories,
    setDomain,
    setDomainAddress,
    setCategories,
    setSections,
  ])

  return <>{children}</>
}
