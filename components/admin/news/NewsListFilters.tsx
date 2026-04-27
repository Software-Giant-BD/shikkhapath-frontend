"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/admin/ui/input";
import { Select } from "@/components/admin/ui/select";

type CategoryOption = { id: string; title: string };

type NewsListFiltersProps = {
  initialSearch: string;
  initialStatus: string;
  initialType: string;
  initialCategoryId: string;
  categories: CategoryOption[];
};

function normalizeSearchForQuery(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) return trimmed;
  return "";
}

function getQueryString(next: URLSearchParams) {
  const qs = next.toString();
  return qs ? `?${qs}` : "";
}

export function NewsListFilters({
  initialSearch,
  initialStatus,
  initialType,
  initialCategoryId,
  categories,
}: NewsListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);
  const [categoryId, setCategoryId] = useState(initialCategoryId);

  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setStatus(initialStatus), [initialStatus]);
  useEffect(() => setType(initialType), [initialType]);
  useEffect(() => setCategoryId(initialCategoryId), [initialCategoryId]);

  const baseParams = useMemo(() => {
    const next = new URLSearchParams(searchParams?.toString());
    // Always reset pagination when filters change
    next.set("page", "1");
    return next;
  }, [searchParams]);

  const navigate = useCallback(
    (next: URLSearchParams) => {
      router.replace(`${pathname}${getQueryString(next)}`, { scroll: false });
    },
    [pathname, router],
  );

  const applySelectFilters = useCallback(
    (nextStatus: string, nextType: string, nextCategoryId: string) => {
      const next = new URLSearchParams(baseParams);

      if (nextStatus) next.set("status", nextStatus);
      else next.delete("status");

      if (nextType) next.set("type", nextType);
      else next.delete("type");

      if (nextCategoryId) next.set("category_id", nextCategoryId);
      else next.delete("category_id");

      navigate(next);
    },
    [baseParams, navigate],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length < 2) return;

    const timeoutId = setTimeout(() => {
      const next = new URLSearchParams(baseParams);
      const normalized = normalizeSearchForQuery(search);

      if (normalized) next.set("search", normalized);
      else next.delete("search");

      navigate(next);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [baseParams, navigate, search]);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:p-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title..."
            className="h-10 pl-9"
          />
        </div>

        <div className="md:col-span-2">
          <Select
            value={status}
            onChange={(e) => {
              const next = e.target.value;
              setStatus(next);
              applySelectFilters(next, type, categoryId);
            }}
            className="h-10"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Select
            value={type}
            onChange={(e) => {
              const next = e.target.value;
              setType(next);
              applySelectFilters(status, next, categoryId);
            }}
            className="h-10"
          >
            <option value="">All Type</option>
            <option value="standard">Standard</option>
            <option value="video">Video</option>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select
            value={categoryId}
            onChange={(e) => {
              const next = e.target.value;
              setCategoryId(next);
              applySelectFilters(status, type, next);
            }}
            className="h-10"
          >
            <option value="">All Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

