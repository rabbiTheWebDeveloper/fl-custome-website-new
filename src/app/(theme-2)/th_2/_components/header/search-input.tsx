"use client"

import { SearchIcon, X, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useTranslations } from "next-intl"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"
import { useDomain } from "../../store/domain"
import Link from "next/link"
import Image from "next/image"

interface SearchSuggestion {
  id: number
  ulid?: string
  product_name: string
  slug?: string
  discounted_price?: number
  price?: number
  main_image?: string
}

const DEBOUNCE_MS = 500

export function SearchInput() {
  const t = useTranslations("Theme2.header")
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const urlSearchQuery = searchParams.get("search") || ""
  const domain = useDomain((state) => state.domain)

  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const searchQuery = isEditing
    ? localSearchQuery
    : urlSearchQuery || localSearchQuery

  const isSearchExpanded = !!urlSearchQuery || isManuallyExpanded

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || query.trim().length < 2 || !domain?.shop_id) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }
      setIsLoadingSuggestions(true)
      try {
        const res = await api.get<{ data: SearchSuggestion[] }>(
          `/customer/product-search?search=${encodeURIComponent(query.trim())}&page=1`,
          { headers: { "shop-id": String(domain.shop_id) } }
        )
        const items = res?.data?.data ?? []
        setSuggestions(items.slice(0, 6))
        setShowSuggestions(items.length > 0)
      } catch {
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingSuggestions(false)
      }
    },
    [domain?.shop_id]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-search-trigger]")
      ) {
        setShowSuggestions(false)
        const hasSearchInUrl = searchParams.get("search")
        if (!hasSearchInUrl) {
          setIsManuallyExpanded(false)
          setLocalSearchQuery("")
        }
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
      setLocalSearchQuery(urlSearchQuery)
      setIsEditing(false)
    }
  }

  const handleSearchClose = () => {
    setIsManuallyExpanded(false)
    setIsEditing(false)
    setShowSuggestions(false)
    setSuggestions([])
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
      router.push(`/shop?search=${encodeURIComponent(queryToSubmit)}`)
      setIsEditing(false)
      setShowSuggestions(false)
      setLocalSearchQuery("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setIsEditing(true)
    setLocalSearchQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val)
    }, DEBOUNCE_MS)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleSearchClose()
    } else if (e.key === "Enter") {
      handleSearchSubmit(e)
    }
  }

  const handleSuggestionClick = () => {
    setShowSuggestions(false)
    setSuggestions([])
    setLocalSearchQuery("")
    setIsEditing(false)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "size-8 transition-all duration-300",
          isSearchExpanded && "opacity-0 pointer-events-none scale-0"
        )}
        onClick={handleSearchToggle}
        data-search-trigger
        type="button"
      >
        <span className="sr-only">{t("search")}</span>
        <SearchIcon className="size-4" />
      </Button>

      <div
        className={cn(
          "absolute right-0 flex items-center gap-2 transition-all duration-300 ease-in-out",
          isSearchExpanded
            ? "opacity-100 translate-x-0 w-[calc(100vw-7rem)] sm:w-[calc(100vw-10rem)] max-w-[400px]"
            : "opacity-0 translate-x-4 w-0 pointer-events-none"
        )}
      >
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t("search") || "Search..."}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-8 pr-8 h-8 w-full text-sm"
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

          {isSearchExpanded && showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {suggestions.map((item) => {
                const productId = item.ulid || String(item.id)
                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}?id=${productId}`}
                    onClick={handleSuggestionClick}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted transition-colors"
                  >
                    {item.main_image && (
                      <Image
                        src={item.main_image}
                        alt={item.product_name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        ৳
                        {(
                          item.discounted_price ??
                          item.price ??
                          0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {isSearchExpanded &&
            isLoadingSuggestions &&
            localSearchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 flex items-center justify-center py-3">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
        </form>
      </div>
    </div>
  )
}
