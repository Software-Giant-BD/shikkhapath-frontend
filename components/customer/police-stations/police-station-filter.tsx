"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Navigation, Building, Filter, ShieldCheck } from "lucide-react";
import { getDivisionsAction, getDistrictsAction, getUpazilasAction, type LocationOption } from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface PoliceStationFilterProps {
  onFilterChange: (filters: { 
    division_id?: string; 
    district_id?: string; 
    upazila_id?: string;
    search?: string;
    gps?: { lat: number; lng: number } 
  }) => void;
  isLoading?: boolean;
}

export function PoliceStationFilter({ onFilterChange, isLoading }: PoliceStationFilterProps) {
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [search, setSearch] = useState("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

  useEffect(() => {
    getDivisionsAction().then((res) => {
      if (res.ok) setDivisions(res.items);
    });
  }, []);

  useEffect(() => {
    if (divisionId) {
      getDistrictsAction(divisionId).then((res) => {
        if (res.ok) setDistricts(res.items);
      });
    } else {
      setDistricts([]);
      setDistrictId("");
    }
    onFilterChange({ division_id: divisionId, district_id: "", upazila_id: "", search });
  }, [divisionId]);

  useEffect(() => {
    if (districtId) {
      getUpazilasAction(districtId).then((res) => {
        if (res.ok) setUpazilas(res.items);
      });
    } else {
      setUpazilas([]);
      setUpazilaId("");
    }
    onFilterChange({ division_id: divisionId, district_id: districtId, upazila_id: "", search });
  }, [districtId]);

  useEffect(() => {
    onFilterChange({ division_id: divisionId, district_id: districtId, upazila_id: upazilaId, search });
  }, [upazilaId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ division_id: divisionId, district_id: districtId, upazila_id: upazilaId, search: e.target.value });
  };

  const useMyLocation = () => {
    setIsGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onFilterChange({ 
            gps: { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude 
            } 
          });
          setIsGpsLoading(false);
          setDivisionId("");
          setDistrictId("");
          setUpazilaId("");
          setSearch("");
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsGpsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsGpsLoading(false);
    }
  };

  const selectClassName = "[&>div:first-child]:rounded-[20px] [&>div:first-child]:py-4 [&>div:first-child]:pl-12 [&>div:first-child]:pr-10 [&>div:first-child]:text-[13px] [&>div:first-child]:font-black [&>div:first-child]:uppercase [&>div:first-child]:tracking-widest [&>div:first-child]:text-slate-700";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Division Filter */}
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-blue-600" />
          <SearchableSelect
            options={[
              { id: "", name: "All Divisions" },
              ...divisions
            ]}
            value={divisionId}
            onChange={setDivisionId}
            placeholder="ALL DIVISIONS"
            searchPlaceholder="SEARCH DIVISION..."
            className={selectClassName}
          />
        </div>

        {/* District Filter */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <SearchableSelect
            options={[
              { id: "", name: "All Districts" },
              ...districts
            ]}
            value={districtId}
            disabled={!divisionId}
            onChange={setDistrictId}
            placeholder="ALL DISTRICTS"
            searchPlaceholder="SEARCH DISTRICT..."
            className={selectClassName}
          />
        </div>

        {/* Upazila Filter */}
        <div className="relative">
          <Building className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <SearchableSelect
            options={[
              { id: "", name: "All Upazilas" },
              ...upazilas
            ]}
            value={upazilaId}
            disabled={!districtId}
            onChange={setUpazilaId}
            placeholder="ALL UPAZILAS"
            searchPlaceholder="SEARCH UPAZILA..."
            className={selectClassName}
          />
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="STATION NAME"
            className="w-full rounded-[20px] border border-slate-200 bg-white py-4 pl-12 pr-6 text-[13px] font-black uppercase tracking-widest text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-blue-600"
          />
        </div>

        {/* GPS Button */}
        <Button
          onClick={useMyLocation}
          disabled={isGpsLoading}
          className={`h-full gap-3 rounded-[20px] px-8 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 ${
            isGpsLoading ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {isGpsLoading ? (
            <span className="animate-spin">●</span>
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          Nearest
        </Button>
      </div>

      <div className="flex items-center gap-3 px-2">
        <Filter className="h-3 w-3 text-slate-300" />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
          Search results updated on selection
        </p>
      </div>
    </div>
  );
}
