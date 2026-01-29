"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
// TODO: Remove this fake data when the actual data model is available
const productCategories = [
  {
    name: "Category",
    items: [
      { value: 1, label: "T-shirt" },
      { value: 2, label: "Hoodie" },
      { value: 3, label: "Pant" },
      { value: 4, label: "Shorts" },
      { value: 5, label: "Jacket" },
      { value: 6, label: "Sweater" },
    ],
  },
  {
    name: "Rating",
    items: [
      { value: 5, label: "5 Stars" },
      { value: 4, label: "4+ Stars" },
      { value: 3, label: "3+ Stars" },
      { value: 2, label: "2+ Stars" },
      { value: 1, label: "1+ Stars" },
    ],
  },
  {
    name: "Size",
    items: [
      { value: "XS", label: "XS" },
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "XXL", label: "XXL" },
    ],
  },

  {
    name: "Color",
    items: [
      { value: "Red", label: "Red", color: "#EF4444" },
      { value: "Blue", label: "Blue", color: "#3B82F6" },
      { value: "Green", label: "Green", color: "#22C55E" },
      { value: "Yellow", label: "Yellow", color: "#EAB308" },
      { value: "Purple", label: "Purple", color: "#A855F7" },
      { value: "Orange", label: "Orange", color: "#F97316" },
      { value: "Pink", label: "Pink", color: "#EC4899" },
      { value: "Brown", label: "Brown", color: "#92400E" },
      { value: "Black", label: "Black", color: "#171717" },
    ],
  },
]

export const Filters = () => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])
  const [sortBy, setSortBy] = React.useState<string>("newest")
  const [priceRange, setPriceRange] = React.useState({
    min: 0,
    max: 1000000,
  })
  const [availabilityFilters, setAvailabilityFilters] = React.useState<
    string[]
  >([])

  const handleFilterToggle = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    )
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handlePriceRangeChange = (field: "min" | "max", value: string) => {
    const numValue =
      value === "" ? (field === "min" ? 0 : 1000000) : Number(value)
    setPriceRange((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(1000000, numValue)),
    }))
  }

  const handleAvailabilityToggle = (value: string) => {
    setAvailabilityFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    )
  }

  return (
    <div className="space-y-5">
      <div className="md:hidden">
        <Collapsible
          className="group rounded-[12px] p-4 md:bg-[#F0F0F0]"
          defaultOpen
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="text-sm font-bold uppercase">Sort By</span>
            <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
            <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <Select defaultValue="newest">
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "uppercase w-full justify-between h-11! font-bold text-base gap-4 [&>svg]:w-6! [&>svg]:opacity-100! [&>svg]:text-foreground! bg-white"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Collapsible
        className="group rounded-[12px] p-4 md:bg-[#F0F0F0]"
        defaultOpen
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <span className="text-sm font-bold uppercase">Sort By</span>
          <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
          <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <RadioGroup value={sortBy} onValueChange={handleSortChange}>
            {[
              { value: "popular", label: "Popular" },
              { value: "newest", label: "Newest" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
            ].map((option) => {
              const isSelected = sortBy === option.value
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 py-2.5 px-3 rounded-[8px]",
                    isSelected && "bg-white"
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`sort-${option.value}`}
                    className="size-5"
                  />
                  <Label
                    htmlFor={`sort-${option.value}`}
                    className={cn(
                      "text-base cursor-pointer select-none font-medium text-[#595959]",
                      isSelected && "text-primary"
                    )}
                  >
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        className="group rounded-[12px] p-4 md:bg-[#F0F0F0]"
        defaultOpen
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <span className="text-sm font-bold uppercase">Price Range</span>
          <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
          <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label
                  htmlFor="price-min"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Min Price (৳)
                </Label>
                <Input
                  id="price-min"
                  type="number"
                  min={0}
                  max={1000000}
                  value={priceRange.min === 0 ? "" : priceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange("min", e.target.value)
                  }
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="price-max"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Max Price (৳)
                </Label>
                <Input
                  id="price-max"
                  type="number"
                  min={0}
                  max={1000000}
                  value={priceRange.max === 1000000 ? "" : priceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange("max", e.target.value)
                  }
                  placeholder="1000000"
                  className="w-full"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Range: ৳{priceRange.min.toLocaleString()} - ৳
              {priceRange.max.toLocaleString()}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {productCategories.map((category) => (
        <div key={category.name}>
          <Collapsible
            className="group rounded-[12px] p-4 md:bg-[#F0F0F0]"
            defaultOpen
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <span className="text-sm font-bold uppercase">
                {category.name}
              </span>
              <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
              <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              {category.items.map((item) => {
                const filterId = `${category.name.toLowerCase()}-${item.value.toString().toLowerCase()}`
                const isChecked = selectedFilters.includes(filterId)
                const colorHex =
                  category.name === "Color" && "color" in item
                    ? (item as { value: string; label: string; color: string })
                        .color
                    : null

                return (
                  <div
                    key={item.value}
                    className={cn(
                      "flex items-center gap-3 py-2.5 px-3 rounded-[8px]",
                      isChecked && "bg-white"
                    )}
                  >
                    <Checkbox
                      id={filterId}
                      checked={isChecked}
                      onCheckedChange={() => handleFilterToggle(filterId)}
                      className="size-5"
                    />
                    {colorHex && (
                      <span
                        className="size-5 shrink-0 rounded-[4px] border border-[#E5E5E5]"
                        style={{ backgroundColor: colorHex }}
                        aria-hidden
                      />
                    )}
                    <label
                      htmlFor={filterId}
                      className={cn(
                        "text-base cursor-pointer select-none font-medium text-[#595959]",
                        isChecked && "text-primary"
                      )}
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}

      <Collapsible
        className="group rounded-[12px] p-4 md:bg-[#F0F0F0]"
        defaultOpen
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <span className="text-sm font-bold uppercase">Availability</span>
          <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
          <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          {[
            { value: "in-stock", label: "In Stock" },
            { value: "out-of-stock", label: "Out of Stock" },
          ].map((option) => {
            const isChecked = availabilityFilters.includes(option.value)
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-3 py-2.5 px-3 rounded-[8px]",
                  isChecked && "bg-white"
                )}
              >
                <Checkbox
                  id={`availability-${option.value}`}
                  checked={isChecked}
                  onCheckedChange={() => handleAvailabilityToggle(option.value)}
                  className="size-5"
                />
                <label
                  htmlFor={`availability-${option.value}`}
                  className={cn(
                    "text-base cursor-pointer select-none font-medium text-[#595959]",
                    isChecked && "text-primary"
                  )}
                >
                  {option.label}
                </label>
              </div>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
