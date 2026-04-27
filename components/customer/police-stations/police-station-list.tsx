"use client";

import { useEffect, useState } from "react";
import { type PoliceStation } from "@/lib/api/police-station-types";
import { getPoliceStations } from "@/lib/api/police-stations";
import { PoliceStationCard } from "./police-station-card";
import { Loader2, SearchX } from "lucide-react";

interface PoliceStationListProps {
  filters: {
    division: string;
    city: string;
    area: string;
    gps?: { lat: number; lng: number };
  };
}

export function PoliceStationList({ filters }: PoliceStationListProps) {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const data = await getPoliceStations({
          division: filters.division,
          city: filters.city,
          area: filters.area,
          userLat: filters.gps?.lat,
          userLng: filters.gps?.lng,
        });
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch police stations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 font-mono">Accessing Archives...</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-[48px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <SearchX className="h-12 w-12 text-slate-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Record Not Found</h3>
          <p className="max-w-xs text-xs font-bold text-slate-400 italic">
            Try searching for a major division or city nearby.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations.map((station) => (
        <PoliceStationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
