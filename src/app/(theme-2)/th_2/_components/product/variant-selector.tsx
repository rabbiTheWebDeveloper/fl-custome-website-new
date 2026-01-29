"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { IProduct } from "../../types/product"

interface Option {
  label: string
  color?: string
  selected?: boolean
}

interface Swatch {
  type: "color" | "size"
  key: string
  label: string
  options: Option[]
}

interface VariantSelectorProps {
  swatches: Swatch[]
  onVariantChange?: (key: string, label: string) => void
  product: IProduct
}

export function VariantSelector({
  onVariantChange,
  product,
}: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {}
    Array.isArray(product.attributes) &&
      product.attributes.forEach((option) => {
        option.values.forEach((value) => {
          initial[value.value] = value.value
        })
      })
    return initial
  })

  const handleVariantSelect = (optionKey: string, optionValue: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [optionKey]: optionValue,
    }))
    onVariantChange?.(optionKey, optionValue)
  }

  console.log("Selected Variants:", selectedVariants)

  // console.log(
  //   "Product:",
  //   Array.isArray(product.attributes) ? product.attributes : []
  // )

  return (
    <>
      {Array.isArray(product.attributes) &&
        product.attributes.map((option) => (
          <div key={option.key}>
            <h3 className="text-lg font-semibold mb-3">{option.key}</h3>
            <div className="flex gap-3 flex-wrap">
              {option.values.map((value, index) => (
                <button
                  key={`${option.key}-${value.value}`}
                  onClick={() => handleVariantSelect(option.key, value.value)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                    selectedVariants[option.key] === value.value
                      ? "bg-black text-white"
                      : "bg-secondary"
                  )}
                >
                  {value.value}
                </button>
              ))}
            </div>
          </div>
        ))}
    </>
  )
}
