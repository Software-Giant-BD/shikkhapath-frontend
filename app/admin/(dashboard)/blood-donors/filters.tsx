"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { BLOOD_GROUPS } from "@/lib/constants/blood-groups";

interface FilterProps {
  districts: { id: string; name: string; bn_name?: string }[];
}

export function BloodDonorFilters({ districts }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  const status = searchParams.get("status") || "";
  const bloodGroup = searchParams.get("blood_group") || "";
  const districtId = searchParams.get("district_id") || "";

  // Prepare options
  const bloodGroupOptions = [
    { id: "", name: "All Groups" },
    ...BLOOD_GROUPS.map((g) => ({ id: g, name: g })),
  ];

  const districtOptions = [
    { id: "", name: "All Districts" },
    ...districts,
  ];

  const statusOptions = [
    { id: "", name: "All Status" },
    { id: "pending", name: "Pending" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search name, phone, nid..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 w-full sm:w-auto min-w-[120px]"
      >
        {statusOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      {/* Blood Group Filter */}
      <select
        value={bloodGroup}
        onChange={(e) => handleFilterChange("blood_group", e.target.value)}
        className="text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 w-full sm:w-[180px]"
      >
        {bloodGroupOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>

      {/* District Filter */}
      <div className="w-full sm:w-[220px]">
        <SearchableSelect
          options={districtOptions}
          value={districtId}
          onChange={(val) => handleFilterChange("district_id", val)}
          placeholder="All Districts"
          searchPlaceholder="Search district..."
          triggerClassName="py-2 px-3 border border-slate-200 bg-white"
        />
      </div>

      {(search || status || bloodGroup || districtId) && (
        <button
          onClick={clearFilters}
          className="text-sm px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
