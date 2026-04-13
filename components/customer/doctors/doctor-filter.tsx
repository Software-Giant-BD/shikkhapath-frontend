"use client";

import { Search, MapPin, Stethoscope, Briefcase } from "lucide-react";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";

interface DoctorFilterProps {
  onFilterChange: (filters: { specialty: string; location: string }) => void;
  isLoading?: boolean;
}

export function DoctorFilter({ onFilterChange, isLoading }: DoctorFilterProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Specialty Filter */}
        <div className="relative">
          <Stethoscope className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
          <select
            onChange={(e) => onFilterChange({ specialty: e.target.value, location: "" })}
            className="w-full appearance-none rounded-[20px] border border-slate-200 bg-white py-4 pl-12 pr-10 text-[13px] font-black uppercase tracking-widest text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
          >
            <option value="All">All Specialties</option>
            {MEDICAL_SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l pl-4 border-slate-100">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
          <select
            onChange={(e) => onFilterChange({ specialty: "", location: e.target.value })}
            className="w-full appearance-none rounded-[20px] border border-slate-200 bg-white py-4 pl-12 pr-10 text-[13px] font-black uppercase tracking-widest text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
          >
            <option value="All">All Locations</option>
            {BANGLADESH_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l pl-4 border-slate-100">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Quick Search Helper */}
        <div className="hidden lg:flex items-center gap-3 px-6 rounded-[20px] border border-blue-100 bg-blue-50/30">
          <Briefcase className="h-4 w-4 text-blue-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400">
            Expert Consultations
          </p>
        </div>
      </div>
    </div>
  );
}
