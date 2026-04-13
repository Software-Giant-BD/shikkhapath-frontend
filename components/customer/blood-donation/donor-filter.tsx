"use client";

import { useState } from "react";
import { Search, MapPin, Droplets, Filter } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/blood-groups";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";
import { Button } from "@/components/ui/button";

interface DonorFilterProps {
  onFilterChange: (filters: { group: string; location: string; availableOnly: boolean }) => void;
}

export function DonorFilter({ onFilterChange }: DonorFilterProps) {
  const [group, setGroup] = useState("");
  const [location, setLocation] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleGroupChange = (newGroup: string) => {
    setGroup(newGroup);
    onFilterChange({ group: newGroup, location, availableOnly });
  };

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    onFilterChange({ group, location: newLoc, availableOnly });
  };

  const toggleAvailability = () => {
    const newVal = !availableOnly;
    setAvailableOnly(newVal);
    onFilterChange({ group, location, availableOnly: newVal });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group Filter */}
        <div className="relative">
          <Droplets className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${group ? "text-red-500" : "text-slate-400"}`} />
          <select
            value={group}
            onChange={(e) => handleGroupChange(e.target.value)}
            className={`w-full appearance-none rounded-2xl border bg-white py-3.5 pl-10 pr-10 text-sm font-bold outline-none transition-all focus:ring-4 ${
              group ? "border-red-500/50 ring-red-500/5" : "border-slate-200 focus:border-red-500"
            }`}
          >
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {!group && (
            <div className="absolute -bottom-5 left-1 text-[10px] font-bold text-red-500 animate-pulse">
              * Blood group is mandatory
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3.5 pl-10 pr-10 text-sm font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/5"
          >
            <option value="All">All Locations</option>
            {BANGLADESH_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Availability Toggle */}
        <Button
          variant="outline"
          onClick={toggleAvailability}
          className={`h-full gap-2 rounded-2xl border-slate-200 px-6 font-bold transition-all active:scale-95 ${
            availableOnly ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-white text-slate-600"
          }`}
        >
          <div className={`h-2 w-2 rounded-full ${availableOnly ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
          Available Only
        </Button>

        {/* Results Counter/Status */}
        <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest sm:justify-end">
          <Filter className="h-3 w-3" />
          Searching Donors
        </div>
      </div>
    </div>
  );
}
