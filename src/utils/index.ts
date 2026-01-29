export function generatePagination(currentPage: number, totalPages: number) {
  // If totalPages is 7 or less, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is among the first 3 pages, show the first 3, an ellipsis, and the last 2
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If current page is among the last 3 pages, show the first 2, an ellipsis, and the last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Otherwise, show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}