"use client";

import { useEffect, useState } from "react";
import { type AmbulanceService } from "@/lib/api/ambulance";
import { getAmbulanceServicesAction } from "@/lib/api/ambulance-actions";
import { AmbulanceServiceCard } from "./ambulance-service-card";
import { Loader2, SearchX } from "lucide-react";

interface AmbulanceListProps {
  location: string;
}

export function AmbulanceList({ location }: AmbulanceListProps) {
  const [services, setServices] = useState<AmbulanceService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const districtId = location === "All" ? undefined : location;
        const { items } = await getAmbulanceServicesAction({ district_id: districtId });
        setServices(items);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-500">Searching for nearby ambulances...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <div className="rounded-full bg-white p-4 shadow-sm">
          <SearchX className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">No Services Found</h3>
          <p className="max-w-xs text-sm text-slate-500">
            We couldn't find any approved ambulance services in this area right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <AmbulanceServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
