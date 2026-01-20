"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

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
}

export function VariantSelector({
  swatches,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {}
    swatches.forEach((swatch) => {
      const selected = swatch.options.find((opt) => opt.selected)
      if (selected) {
        initial[swatch.key] = selected.label
      }
    })
    return initial
  })

  const handleVariantSelect = (swatchKey: string, optionLabel: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [swatchKey]: optionLabel,
    }))
    onVariantChange?.(swatchKey, optionLabel)
  }

  return (
    <div>
      {swatches.map((swatch) => (
        <div key={swatch.key}>
          <h3 className="text-lg font-semibold mb-3">{swatch.label}</h3>
          <div className="flex gap-3 flex-wrap">
            {swatch.options.map((option, index) =>
              swatch.type === "color" ? (
                <button
                  key={index}
                  onClick={() => handleVariantSelect(swatch.key, option.label)}
                  className={cn(
                    "size-11 rounded-lg transition-all flex p-1 border border-[#E7E7E7]",
                    selectedVariants[swatch.key] === option.label &&
                      "border-black"
                  )}
                  aria-label={option.label}
                  title={option.label}
                >
                  <span
                    className="size-full rounded-[5px]"
                    style={{ backgroundColor: option.color }}
                  ></span>
                </button>
              ) : (
                <button
                  key={index}
                  onClick={() => handleVariantSelect(swatch.key, option.label)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-colors",
                    selectedVariants[swatch.key] === option.label
                      ? "bg-black text-white"
                      : "bg-secondary"
                  )}
                >
                  {option.label}
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
