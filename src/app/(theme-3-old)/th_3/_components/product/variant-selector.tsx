"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { IProduct } from "../../types/product"

interface VariantSelectorProps {
  onVariantChange?: (key: string, label: string) => void
  product: IProduct
  selectedVariants?: Record<string, string>
}

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#A855F7",
  orange: "#F97316",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#92400E",
  navy: "#1E3A5F",
  maroon: "#800000",
  beige: "#F5F5DC",
}

function isColorAttribute(key: string): boolean {
  return /color|colour|রং/i.test(key)
}

function getColorHex(label: string): string | null {
  const normalized = label.toLowerCase().trim()
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized]
  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) return normalized
  return null
}

export function VariantSelector({
  onVariantChange,
  product,
  selectedVariants = {},
}: VariantSelectorProps) {
  const handleVariantSelect = (optionKey: string, optionValue: string) => {
    onVariantChange?.(optionKey, optionValue)
  }

  if (!Array.isArray(product.attributes)) return null

  return (
    <div className="space-y-5">
      {product.attributes.map((option) => {
        const isColor = isColorAttribute(option.key)
        return (
          <div key={option.key}>
            <h3 className="text-sm font-semibold mb-2.5 uppercase tracking-wide text-muted-foreground">
              {option.key}
              {selectedVariants[option.key] && (
                <span className="ml-2 text-foreground normal-case tracking-normal">
                  {selectedVariants[option.key]}
                </span>
              )}
            </h3>
            <div className="flex gap-2.5 flex-wrap">
              {option.values.map((value) => {
                const isSelected = selectedVariants[option.key] === value.value
                const colorHex = isColor ? getColorHex(value.value) : null

                if (isColor && colorHex) {
                  return (
                    <button
                      key={`${option.key}-${value.value}`}
                      onClick={() =>
                        handleVariantSelect(option.key, value.value)
                      }
                      className={cn(
                        "relative size-9 rounded-full cursor-pointer transition-all",
                        isSelected && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: colorHex }}
                      title={value.value}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "absolute inset-0 m-auto size-4",
                            colorHex === "#000000" ||
                              colorHex === "#1E3A5F" ||
                              colorHex === "#800000"
                              ? "text-white"
                              : "text-black"
                          )}
                        />
                      )}
                    </button>
                  )
                }

                return (
                  <button
                    key={`${option.key}-${value.value}`}
                    onClick={() => handleVariantSelect(option.key, value.value)}
                    className={cn(
                      "px-5 py-2 rounded-lg font-medium transition-all cursor-pointer border",
                      isSelected
                        ? "bg-[#39B27A] text-primary-foreground border-[#39B27A] ring-2 ring-primary/20"
                        : "bg-background text-foreground border-border hover:border-[#39B27A]/50"
                    )}
                  >
                    {value.value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
