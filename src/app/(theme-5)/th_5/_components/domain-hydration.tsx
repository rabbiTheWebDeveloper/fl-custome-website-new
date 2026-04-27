"use client"

import { useEffect } from "react"
import { useDomain } from "../store/domain"
import { useCategories } from "../store/categories"
import { IShopResponse } from "../types/shop"
import { ICategory } from "../types/categories"

interface DomainHydrationProps {
  initialDomain: IShopResponse | null
  initialCategories: ICategory[] | null
}

export function DomainHydration({
  initialDomain,
  initialCategories,
  children,
}: DomainHydrationProps & { children: React.ReactNode }) {
  const setDomain = useDomain((state) => state.setDomain)
  const setDomainAddress = useDomain((state) => state.setDomainAddress)
  const setCategories = useCategories((state) => state.setCategories)

  useEffect(() => {
    if (initialDomain) {
      setDomain(initialDomain)
      if (typeof window !== "undefined") {
        setDomainAddress(window.location.origin)
      }
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
    initialCategories,
    setDomain,
    setDomainAddress,
    setCategories,
  ])

  return <>{children}</>
}
