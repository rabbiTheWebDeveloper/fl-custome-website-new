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
        option.values.forEach((value: { value: string }) => {
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
          <div key={option.key} className="space-y-4">
            <h3 className="font-semibold mb-2">{option.key}</h3>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value: { value: string }) => (
                <button
                  key={`${option.key}-${value.value}`}
                  onClick={() => handleVariantSelect(option.key, value.value)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                    selectedVariants[option.key] === value.value
                      ? "bg-[#3BB77E] text-white"
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
