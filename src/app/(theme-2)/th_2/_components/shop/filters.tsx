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
import { Button, buttonVariants } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { ICategory } from "../../types/categories"

interface FiltersProps {
  categories?: ICategory[]
  onPriceRangeApply?: (minPrice: number, maxPrice: number) => void
  onPriceRangeReset?: () => void
  isPriceFilterActive?: boolean
  onCategoryFilterApply?: (categoryIds: number[]) => void
  onCategoryFilterReset?: () => void
  isCategoryFilterActive?: boolean
  onSortChange?: (sortColumn: string, sortDirection: "asc" | "desc") => void
}

export const Filters = ({
  categories = [],
  onPriceRangeApply,
  onPriceRangeReset,
  isPriceFilterActive,
  onCategoryFilterApply,
  onCategoryFilterReset,
  isCategoryFilterActive,
  onSortChange,
}: FiltersProps) => {
  const [sortBy, setSortBy] = React.useState<string>("newest")
  const [priceRange, setPriceRange] = React.useState({
    min: 0,
    max: 1000000,
  })
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<
    number[]
  >([])
  const [availabilityFilters, setAvailabilityFilters] = React.useState<
    string[]
  >([])

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleCategoryApply = () => {
    if (selectedCategoryIds.length > 0) {
      onCategoryFilterApply?.(selectedCategoryIds)
    }
  }

  const handleCategoryReset = () => {
    setSelectedCategoryIds([])
    onCategoryFilterReset?.()
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    if (value === "oldest") {
      onSortChange?.("created_at", "asc")
    } else if (value === "newest") {
      onSortChange?.("created_at", "desc")
    } else if (value === "price-low") {
      onSortChange?.("price", "asc")
    } else if (value === "price-high") {
      onSortChange?.("price", "desc")
    }
  }

  const handlePriceRangeChange = (field: "min" | "max", value: string) => {
    const numValue =
      value === "" ? (field === "min" ? 0 : 1000000) : Number(value)
    setPriceRange((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(1000000, numValue)),
    }))
  }

  const handlePriceRangeApply = () => {
    onPriceRangeApply?.(priceRange.min, priceRange.max)
  }

  const handlePriceRangeReset = () => {
    setPriceRange({ min: 0, max: 1000000 })
    onPriceRangeReset?.()
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
            <Select defaultValue="newest" onValueChange={handleSortChange}>
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
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
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
              { value: "oldest", label: "Oldest" },
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
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={handlePriceRangeApply}
              >
                Apply
              </Button>
              {isPriceFilterActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handlePriceRangeReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {categories.length > 0 && (
        <Collapsible className="group rounded-[12px] p-4 md:bg-[#F0F0F0]">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="text-sm font-bold uppercase">Category</span>
            <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
            <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            {categories.map((cat) => {
              const isChecked = selectedCategoryIds.includes(cat.id)
              return (
                <div
                  key={cat.id}
                  className={cn(
                    "flex items-center gap-3 py-2.5 px-3 rounded-[8px]",
                    isChecked && "bg-white"
                  )}
                >
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={isChecked}
                    onCheckedChange={() => handleCategoryToggle(cat.id)}
                    className="size-5"
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className={cn(
                      "text-base cursor-pointer select-none font-medium text-[#595959]",
                      isChecked && "text-primary"
                    )}
                  >
                    {cat.name}
                  </label>
                </div>
              )
            })}
            <div className="flex items-center gap-2 pt-3">
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={handleCategoryApply}
                disabled={selectedCategoryIds.length === 0}
              >
                Apply
              </Button>
              {isCategoryFilterActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCategoryReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* <Collapsible
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
      </Collapsible> */}
    </div>
  )
}
