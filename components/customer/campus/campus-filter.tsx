"use client";

import { Search, MapPin, GraduationCap, School, Building2 } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";

interface CampusFilterProps {
  onFilterChange: (filters: { type: string; location: string; query: string }) => void;
  isLoading?: boolean;
}

export function CampusFilter({ onFilterChange, isLoading }: CampusFilterProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div className="relative group lg:col-span-2">
          <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search news, institutions..."
            onChange={(e) => onFilterChange({ type: "", location: "", query: e.target.value })}
            className="h-16 w-full rounded-[24px] border border-slate-100 bg-slate-50 pl-14 pr-6 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
          />
        </div>

        {/* Institution Type Filter */}
        <div className="relative group">
          <GraduationCap className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <select
            onChange={(e) => onFilterChange({ type: e.target.value, location: "", query: "" })}
            className="h-16 w-full appearance-none rounded-[24px] border border-slate-100 bg-slate-50 pl-14 pr-10 text-xs font-black uppercase tracking-widest text-slate-600 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
          >
            <option value="All">All Institutions</option>
            <option value="University">University</option>
            <option value="College">College</option>
            <option value="School">School</option>
          </select>
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 border-l border-slate-200 pl-4">
             <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>

        {/* Location Filter */}
        <div className="relative group">
          <MapPin className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <select
            onChange={(e) => onFilterChange({ type: "", location: e.target.value, query: "" })}
            className="h-16 w-full appearance-none rounded-[24px] border border-slate-100 bg-slate-50 pl-14 pr-10 text-xs font-black uppercase tracking-widest text-slate-600 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
          >
            <option value="All">All Locations</option>
            {BANGLADESH_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 border-l border-slate-200 pl-4">
             <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
