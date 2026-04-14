"use client";

import { useEffect, useState } from "react";
import { type FireStation, getFireStations } from "@/lib/api/fire-service";
import { FireStationCard } from "./fire-station-card";
import { Loader2, SearchX, Map } from "lucide-react";

interface FireStationListProps {
  filters: {
    division: string;
    city: string;
    area: string;
    gps?: { lat: number; lng: number };
  };
}

export function FireStationList({ filters }: FireStationListProps) {
  const [stations, setStations] = useState<FireStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const data = await getFireStations({
          division: filters.division,
          city: filters.city,
          area: filters.area,
          userLat: filters.gps?.lat,
          userLng: filters.gps?.lng,
        });
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch fire stations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Directory...</p>
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
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Stations Found</h3>
          <p className="max-w-xs text-sm font-bold text-slate-400 italic">
            Try searching for a major division or city nearby.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations.map((station) => (
        <FireStationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
