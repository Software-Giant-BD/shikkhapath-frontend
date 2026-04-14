"use client";

import { useState } from "react";
import { Search, MapPin, Navigation, Building, Filter, ShieldCheck } from "lucide-react";
import { BANGLADESH_DIVISIONS } from "@/lib/constants/divisions";
import { Button } from "@/components/ui/button";

interface PoliceStationFilterProps {
  onFilterChange: (filters: { 
    division: string; 
    city: string; 
    area: string;
    gps?: { lat: number; lng: number } 
  }) => void;
  isLoading?: boolean;
}

export function PoliceStationFilter({ onFilterChange, isLoading }: PoliceStationFilterProps) {
  const [division, setDivision] = useState("All");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const handleDivisionChange = (newVal: string) => {
    setDivision(newVal);
    onFilterChange({ division: newVal, city, area });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "city") setCity(value);
    if (name === "area") setArea(value);
    onFilterChange({ division, city: name === "city" ? value : city, area: name === "area" ? value : area });
  };

  const useMyLocation = () => {
    setIsGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onFilterChange({ 
            division: "All", 
            city: "", 
            area: "", 
            gps: { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude 
            } 
          });
          setIsGpsLoading(false);
          setDivision("All");
          setCity("");
          setArea("");
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Division Filter */}
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
          <select
            value={division}
            onChange={(e) => handleDivisionChange(e.target.value)}
            className="w-full appearance-none rounded-[20px] border border-slate-200 bg-white py-4 pl-12 pr-10 text-[13px] font-black uppercase tracking-widest text-slate-700 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5"
          >
            <option value="All">All Divisions</option>
            {BANGLADESH_DIVISIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="city"
            value={city}
            onChange={handleInputChange}
            placeholder="CITY"
            className="w-full rounded-[20px] border border-slate-200 bg-white py-4 pl-12 pr-6 text-[13px] font-black uppercase tracking-widest text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-blue-600"
          />
        </div>

        {/* Area Filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="area"
            value={area}
            onChange={handleInputChange}
            placeholder="AREA / STATION"
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
          Nearest Station
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
