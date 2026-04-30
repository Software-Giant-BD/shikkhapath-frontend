"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

export function DoctorFilters({
  specialties,
  districts,
}: {
  specialties: readonly string[];
  districts: { id: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const status = searchParams.get("status") || "";
  const specialty = searchParams.get("specialty") || "";
  const district_id = searchParams.get("district_id") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilters({ search });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, searchParams]);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  return (
    <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-2">
      <div className="relative w-full sm:w-48">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-md border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <select
        value={status}
        onChange={(e) => updateFilters({ status: e.target.value })}
        className="w-full sm:w-auto rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>

      <SearchableSelect
        options={[
          { id: "", name: "All Specialties" },
          ...specialties.map((spec) => ({ id: spec, name: spec })),
        ]}
        value={specialty}
        onChange={(val) => updateFilters({ specialty: val })}
        placeholder="All Specialties"
        searchPlaceholder="Search specialty..."
        className="w-full sm:w-[220px]"
      />

      <SearchableSelect
        options={[
          { id: "", name: "All Districts" },
          ...districts,
        ]}
        value={district_id}
        onChange={(val) => updateFilters({ district_id: val })}
        placeholder="All Districts"
        searchPlaceholder="Search district..."
        className="w-full sm:w-[200px]"
      />

      {(search || status || district_id || specialty) && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="w-full sm:w-auto text-slate-500"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
