/**
 * Max page cap. Prevents abuse (e.g. ?page=99999) while allowing large catalogs.
 * Shops with totalPages > this value cannot paginate beyond it.
 */
const MAX_PAGE = 1000

/**
 * Parses and validates page from URL params. Caps at MAX_PAGE to prevent abuse.
 * Note: We can't know totalPages before the API call, so we can't block 700 when
 * totalPages=10 without also blocking 700 when totalPages=1000. This cap blocks
 * extreme values (99999) while supporting large catalogs (up to 1000 pages).
 */
export function parsePageNumber(
  pageParam: string | undefined,
  maxPage: number = MAX_PAGE
): number {
  const raw = parseInt(pageParam ?? "", 10)
  if (isNaN(raw) || raw < 1) return 1
  return Math.min(Math.floor(raw), maxPage)
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If totalPages is 7 or less, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If current page is among the first 3 pages, show the first 3, an ellipsis, and the last 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]
  }

  // If current page is among the last 3 pages, show the first 2, an ellipsis, and the last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  // Otherwise, show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ]
}
