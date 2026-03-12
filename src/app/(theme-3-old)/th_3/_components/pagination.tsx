"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import clsx from "clsx"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { generatePagination } from "@/utils"

interface PaginationProps {
  totalPages: number
}

export default function Pagination({ totalPages }: PaginationProps) {
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

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Link
        href={currentPage <= 1 ? "#" : createPageURL(currentPage - 1)}
        scroll={false}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={(e) => {
          if (currentPage <= 1) e.preventDefault()
        }}
        className={clsx(
          "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
          currentPage <= 1
            ? "text-gray-400 bg-gray-50 border-gray-200 pointer-events-none"
            : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-10 h-10"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </span>
            )
          }

          return (
            <Link
              key={`page-${page}`}
              href={createPageURL(page)}
              scroll={false}
              className={clsx(
                "flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg border transition-colors",
                page === currentPage
                  ? "bg-[#3BB77E] text-white border-[#3BB77E]"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              )}
            >
              {page}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage >= totalPages ? "#" : createPageURL(currentPage + 1)}
        scroll={false}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        onClick={(e) => {
          if (currentPage >= totalPages) e.preventDefault()
        }}
        className={clsx(
          "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
          currentPage >= totalPages
            ? "text-gray-400 bg-gray-50 border-gray-200 pointer-events-none"
            : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  )
}
