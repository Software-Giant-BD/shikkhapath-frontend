"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/admin/ui/input";

type NewsletterListFiltersProps = {
  initialSearch: string;
  title: string;
  action?: React.ReactNode;
};

function normalizeSearchForQuery(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    return trimmed;
  }

  return "";
}

export function NewsletterListFilters({ initialSearch, title, action }: NewsletterListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const navigateWithFilters = useCallback((searchValue: string) => {
    const query = new URLSearchParams();
    const normalizedSearch = normalizeSearchForQuery(searchValue);

    query.set("page", "1");

    if (normalizedSearch) {
      query.set("search", normalizedSearch);
    }

    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (search === initialSearch) {
      return;
    }

    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length < 2) {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigateWithFilters(search);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigateWithFilters, search, initialSearch]);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search email..."
            className="h-10 pl-9"
          />
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
