import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): (number | "...")[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: rightSibling },
      (_, i) => i + 1,
    );
    return [...leftRange, "...", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: totalPages - leftSibling + 1 },
      (_, i) => leftSibling + i,
    );
    return [1, "...", ...rightRange];
  }

  if (showLeftDots && showRightDots) {
    const middleRange = Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i,
    );
    return [1, "...", ...middleRange, "...", totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  getPageHref,
  className,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationRange(currentPage, totalPages, 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn("flex items-center gap-2.5 sm:gap-3", className)}
    >
      <Link
        href={getPageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={cn(
          "flex h-6 min-w-[20px] select-none items-center justify-center text-sm font-semibold transition-colors",
          currentPage <= 1
            ? "pointer-events-none select-none text-slate-300"
            : "text-slate-800 hover:text-[#0284c7]",
        )}
        aria-label="Previous page"
      >
        «
      </Link>

      {items.map((item, idx) => {
        if (item === "...") {
          return (
            <span
              key={`dots-${idx}`}
              className="flex h-6 min-w-[20px] select-none items-center justify-center text-sm font-semibold tracking-wider text-slate-800"
            >
              ...
            </span>
          );
        }

        const isCurrent = item === currentPage;
        if (isCurrent) {
          return (
            <span
              key={item}
              aria-current="page"
              className="flex h-6 min-w-[24px] select-none items-center justify-center rounded-[3px] bg-[#0284c7] px-1 text-sm font-medium text-white shadow-xs"
            >
              {item}
            </span>
          );
        }

        return (
          <Link
            key={item}
            href={getPageHref(item)}
            className="flex h-6 min-w-[24px] select-none items-center justify-center px-1 text-sm font-medium text-slate-800 transition-colors hover:text-[#0284c7]"
          >
            {item}
          </Link>
        );
      })}

      <Link
        href={getPageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className={cn(
          "flex h-6 min-w-[20px] select-none items-center justify-center text-sm font-semibold transition-colors",
          currentPage >= totalPages
            ? "pointer-events-none select-none text-slate-300"
            : "text-slate-800 hover:text-[#0284c7]",
        )}
        aria-label="Next page"
      >
        »
      </Link>
    </nav>
  );
}
