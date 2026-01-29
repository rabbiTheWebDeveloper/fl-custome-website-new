'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/utils';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const pages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {/* Previous Button */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={clsx(
          'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
          currentPage <= 1
            ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage <= 1}
        onClick={(e) => currentPage <= 1 && e.preventDefault()}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-10 h-10"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </span>
            );
          }

          return (
            <Link
              key={`page-${page}`}
              href={createPageURL(page)}
              className={clsx(
                'flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg border transition-colors',
                page === currentPage
                  ? 'bg-[#3BB77E] text-white border-blue-600'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={clsx(
          'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
          currentPage >= totalPages
            ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage >= totalPages}
        onClick={(e) => currentPage >= totalPages && e.preventDefault()}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}