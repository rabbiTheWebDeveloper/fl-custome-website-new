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

// TODO: Remove this fake data when the actual data model is available
const productCategories = [
  {
    name: "MEN",
    items: [
      "Shirt",
      "T-shirt",
      "Hoodie",
      "Pant",
      "Shorts",
      "Jacket",
      "Sweater",
    ],
  },
  {
    name: "WOMEN",
    items: [
      "Shirt",
      "T-shirt",
      "Hoodie",
      "Pant",
      "Shorts",
      "Jacket",
      "Sweater",
    ],
  },
  {
    name: "KIDS",
    items: [
      "Shirt",
      "T-shirt",
      "Hoodie",
      "Pant",
      "Shorts",
      "Jacket",
      "Sweater",
    ],
  },
]

export const Filters = () => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])

  const handleFilterToggle = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    )
  }

  return (
    <div className="space-y-5">
      <div className="md:hidden">
        <Collapsible
          className="group rounded-[12px] p-4 md:bg-[#F9F9F9]"
          defaultOpen
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="text-base font-bold uppercase">Sort By</span>
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

      {productCategories.map((category) => (
        <div key={category.name}>
          <Collapsible
            className="group rounded-[12px] p-4 md:bg-[#F9F9F9]"
            defaultOpen
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <span className="text-base font-bold uppercase">
                {category.name}
              </span>
              <ChevronDownIcon className="size-6 mr-0.5 group-data-[state=open]:hidden" />
              <ChevronUpIcon className="size-6 mr-0.5 group-data-[state=closed]:hidden" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              {category.items.map((item) => {
                const filterId = `${category.name.toLowerCase()}-${item.toLowerCase()}`
                const isChecked = selectedFilters.includes(filterId)

                return (
                  <div
                    key={item}
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
                    <label
                      htmlFor={filterId}
                      className={cn(
                        "text-lg cursor-pointer select-none font-medium text-[#595959]",
                        isChecked && "text-primary"
                      )}
                    >
                      {item}
                    </label>
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  )
}
