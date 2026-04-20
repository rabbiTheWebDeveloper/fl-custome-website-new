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
  cream: "#FFFDD0",
  silver: "#C0C0C0",
  gold: "#FFD700",
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
    <div className="space-y-6">
      {product.attributes.map((option) => {
        const isColor = isColorAttribute(option.key)
        const selectedValue = selectedVariants[option.key]

        return (
          <div key={option.key}>
            {/* Label Row */}
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-gray-500 dark:text-zinc-500">
                {option.key}
              </h3>
              {selectedValue && (
                <span className="text-xs font-bold text-gray-900 dark:text-white px-2.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-full">
                  {selectedValue}
                </span>
              )}
            </div>

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
                      title={value.value}
                      className={cn(
                        "relative w-9 h-9 rounded-full cursor-pointer transition-all duration-200 hover:scale-110",
                        isSelected
                          ? "ring-2 ring-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-black scale-110 shadow-lg"
                          : "ring-1 ring-gray-200 dark:ring-zinc-700 hover:ring-gray-400 dark:hover:ring-zinc-500"
                      )}
                      style={{ backgroundColor: colorHex }}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className={cn(
                            "absolute inset-0 m-auto",
                            colorHex === "#000000" ||
                              colorHex === "#1E3A5F" ||
                              colorHex === "#800000" ||
                              colorHex === "#92400E"
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
                      "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border-2 hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg shadow-black/10"
                        : "bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600"
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
