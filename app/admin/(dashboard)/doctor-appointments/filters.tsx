"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface FilterProps {
  specialties: string[];
  doctors: { id: number; name: string }[];
}

export function AppointmentFilters({ specialties, doctors }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  const status = searchParams.get("status") || "";
  const specialty = searchParams.get("specialty") || "";
  const doctorId = searchParams.get("doctor_id") || "";

  // Prepare options for SearchableSelect
  const specialtyOptions = [
    { id: "", name: "All Specialties" },
    ...specialties.map((s) => ({ id: s, name: s })),
  ];
  const doctorOptions = [
    { id: "", name: "All Doctors" },
    ...doctors.map((d) => ({ id: d.id, name: d.name })),
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
    <div className="flex flex-wrap items-center justify-end gap-2 w-full">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patient, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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

      <select
        value={status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-auto min-w-[120px]"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <SearchableSelect
        options={specialtyOptions}
        value={specialty}
        onChange={(val) => handleFilterChange("specialty", val)}
        placeholder="All Specialties"
        searchPlaceholder="Search specialty..."
        className="w-full sm:w-[180px]"
      />

      <SearchableSelect
        options={doctorOptions}
        value={doctorId}
        onChange={(val) => handleFilterChange("doctor_id", val)}
        placeholder="All Doctors"
        searchPlaceholder="Search doctor..."
        className="w-full sm:w-[180px]"
      />

      {(search || status || specialty || doctorId) && (
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
