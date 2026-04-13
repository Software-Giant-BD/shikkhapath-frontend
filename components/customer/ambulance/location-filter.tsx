"use client";

import { useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";
import { Button } from "@/components/ui/button";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    onLocationChange(loc);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In a real app, you would reverse geocode these coordinates
        // For now, we'll just simulate finding "Dhaka" or similar
        console.log("Coords:", position.coords.latitude, position.coords.longitude);
        
        // Simulating a delay for reverse geocoding
        await new Promise(r => setTimeout(r, 1000));
        
        const detected = "Dhaka"; // Simulated result
        handleLocationSelect(detected);
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
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select
          value={selectedLocation}
          onChange={(e) => handleLocationSelect(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
        >
          <option value="All">All Locations</option>
          {BANGLADESH_DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
