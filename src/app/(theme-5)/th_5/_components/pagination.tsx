"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { generatePagination } from "@/utils"

interface PaginationProps {
  totalPages: number
  scrollTargetId?: string
}

export default function Pagination({
  totalPages,
  scrollTargetId = "product-list",
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawPage = parseInt(searchParams.get("page") ?? "", 10)
  const currentPage = isNaN(rawPage)
    ? 1
    : Math.min(Math.max(Math.floor(rawPage), 1), totalPages)
  const pages = generatePagination(currentPage, totalPages)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const scrollToProducts = () => {
    const el = document.getElementById(scrollTargetId)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* Previous */}
      <Link
        href={isFirst ? "#" : createPageURL(currentPage - 1)}
        scroll={false}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        onClick={(e) => {
          if (isFirst) {
            e.preventDefault()
            return
          }
          scrollToProducts()
        }}
        className={`
          flex items-center gap-1.5 px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]
          border transition-all duration-200
          ${
            isFirst
              ? "border-gray-200 text-gray-300 pointer-events-none"
              : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
          }
        `}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-8 h-8 text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )
          }

          const isActive = page === currentPage
          return (
            <Link
              key={`page-${page}`}
              href={createPageURL(page)}
              scroll={false}
              onClick={scrollToProducts}
              className={`
                flex items-center justify-center w-8 h-8 rounded-none text-[10px] font-bold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              {page}
            </Link>
          )
        })}
      </div>

      {/* Next */}
      <Link
        href={isLast ? "#" : createPageURL(currentPage + 1)}
        scroll={false}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        onClick={(e) => {
          if (isLast) {
            e.preventDefault()
            return
          }
          scrollToProducts()
        }}
        className={`
          flex items-center gap-1.5 px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]
          border transition-all duration-200
          ${
            isLast
              ? "border-gray-200 text-gray-300 pointer-events-none"
              : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </nav>
  )
}
