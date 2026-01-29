"use client"

import { SearchIcon, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useTranslations } from "next-intl"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SearchInput() {
  const t = useTranslations("Theme2.header")
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const urlSearchQuery = searchParams.get("search") || ""

  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Derive search query: prioritize local query when editing, otherwise use URL
  // When not editing, derive directly from URL; when editing, use local state
  const searchQuery = isEditing
    ? localSearchQuery
    : urlSearchQuery || localSearchQuery

  // Derive expanded state: expanded if URL has search OR manually expanded
  const isSearchExpanded = !!urlSearchQuery || isManuallyExpanded

  // Focus input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  // Handle click outside to close search (only if not on shop page with search)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const hasSearchInUrl = searchParams.get("search")
      // Don't close if there's a search query in URL (on shop page)
      if (hasSearchInUrl) {
        return
      }

      if (
        isSearchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-search-trigger]")
      ) {
        setIsManuallyExpanded(false)
        setLocalSearchQuery("")
      }
    }

    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchExpanded, searchParams])

  const handleSearchToggle = () => {
    setIsManuallyExpanded(!isManuallyExpanded)
    if (!isManuallyExpanded) {
      // When expanding, sync with URL search query if it exists
      setLocalSearchQuery(urlSearchQuery)
      setIsEditing(false)
    }
  }

  const handleSearchClose = () => {
    setIsManuallyExpanded(false)
    setIsEditing(false)
    // Clear search from URL when closing
    if (pathname === "/shop") {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      router.push(`/shop?${params.toString()}`, { scroll: false })
    }
    setLocalSearchQuery("")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const queryToSubmit = searchQuery.trim()
    if (queryToSubmit) {
      // Redirect to shop page with search query, keep input expanded
      router.push(`/shop?search=${encodeURIComponent(queryToSubmit)}`)
      setIsEditing(false)
      // Clear local query - URL will be source of truth after navigation
      setLocalSearchQuery("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true)
    setLocalSearchQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleSearchClose()
    } else if (e.key === "Enter") {
      handleSearchSubmit(e)
    }
  }

  return (
    <div className="relative flex items-center">
      {/* Search Icon Button */}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "size-10.5 transition-all duration-300",
          isSearchExpanded && "opacity-0 pointer-events-none scale-0"
        )}
        onClick={handleSearchToggle}
        data-search-trigger
        type="button"
      >
        <span className="sr-only">{t("search")}</span>
        <SearchIcon className="size-6" />
      </Button>

      {/* Expanded Search Input */}
      <div
        className={cn(
          "absolute right-0 flex items-center gap-2 transition-all duration-300 ease-in-out",
          isSearchExpanded
            ? "opacity-100 translate-x-0 w-[300px] md:w-[400px]"
            : "opacity-0 translate-x-4 w-0 pointer-events-none"
        )}
      >
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t("search") || "Search..."}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-10.5 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleSearchClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
