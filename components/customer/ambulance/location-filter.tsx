"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Navigation, Search, ChevronDown } from "lucide-react";
import { getDistrictsAction, type LocationOption } from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDistrictsAction().then(res => {
        if (res.ok) {
            setDistricts(res.items);
        }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (loc: LocationOption | null) => {
    setSelectedLocation(loc);
    onLocationChange(loc ? loc.id : "All");
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.bn_name && d.bn_name.includes(searchTerm))
  );

  const getDisplayName = (d: LocationOption) => {
    if (d.bn_name && d.name) {
      return `${d.name} - ${d.bn_name}`;
    }
    return d.bn_name || d.name;
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Coords:", position.coords.latitude, position.coords.longitude);
        await new Promise(r => setTimeout(r, 1000));
        
        if (districts.length > 0) {
            const detected = districts[0]; // Simulation
            handleLocationSelect(detected);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-grow" ref={dropdownRef}>
        {/* Trigger */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-700 transition-all hover:border-primary focus:ring-4 focus:ring-primary/5"
        >
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <span className={selectedLocation ? "text-slate-900" : "text-slate-500"}>
            {selectedLocation ? getDisplayName(selectedLocation) : "সব এলাকা (All Locations)"}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown Panel - Higher z-index to stay above ads */}
        {isOpen && (
          <div className="absolute left-0 top-full z-[100] mt-2 w-full min-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="শহর খুঁজুন... (Search City)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5"
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              <div
                onClick={() => handleLocationSelect(null)}
                className="flex cursor-pointer items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors"
              >
                সব এলাকা (All Locations)
              </div>
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <div
                    key={district.id}
                    onClick={() => handleLocationSelect(district)}
                    className={`flex cursor-pointer items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                      selectedLocation?.id === district.id 
                        ? "bg-primary/5 text-primary font-bold" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    {getDisplayName(district)}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-xs text-slate-400">
                  কোনো এলাকা পাওয়া যায়নি (No matching location)
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        className="h-12 gap-2 rounded-2xl border-slate-200 bg-white px-6 font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
      >
        <Navigation className={`h-4 w-4 text-primary ${isLocating ? "animate-pulse" : ""}`} />
        {isLocating ? "Locating..." : "Nearby Service"}
      </Button>
    </div>
  );
}
