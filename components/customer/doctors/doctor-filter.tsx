"use client";

import { useState, useEffect } from "react";
import { MapPin,  Briefcase } from "lucide-react";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";
import {
  getDistrictsAction,
  type LocationOption,
} from "@/lib/api/location-actions";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface DoctorFilterProps {
  onFilterChange: (filters: { specialty: string; location: string }) => void;
  isLoading?: boolean;
}

export function DoctorFilter({ onFilterChange, isLoading }: DoctorFilterProps) {
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [specialty, setSpecialty] = useState("All");
  const [location, setLocation] = useState("All");

  useEffect(() => {
    getDistrictsAction().then((res) => {
      if (res.ok) {
        setDistricts(res.items);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <SearchableSelect
            options={MEDICAL_SPECIALTIES.map((s) => ({ id: s, name: s }))}
            value={specialty}
            onChange={(val) => {
              onFilterChange({ specialty: val, location });
              setSpecialty(val);
            }}
            placeholder="Select Specialty"
            searchPlaceholder="Search specialty..."
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />

          <SearchableSelect
            options={districts}
            value={location}
            onChange={(val) => {
              onFilterChange({ specialty, location: val });
              setLocation(val);
            }}
            placeholder="Select City"
            searchPlaceholder="Search Location..."
          />
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
