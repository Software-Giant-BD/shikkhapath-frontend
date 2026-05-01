"use client";

import {
  Phone,
  MapPin,
  Navigation,
  Shield,
  ExternalLink,
  Building,
} from "lucide-react";
import { type PoliceStation } from "@/lib/api/police-station-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface PoliceStationCardProps {
  station: PoliceStation;
}

export function PoliceStationCard({ station }: PoliceStationCardProps) {
  const isFarAway = (station.distance ?? 0) > 100;

  const handleCall = () => {
    window.location.href = `tel:${station.phone_number}`;
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
      "_blank",
    );
  };

  return (
    <Card
      className={cn(
        "ase-fade-up group relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-slate-100",
        isFarAway ? "bg-amber-50/40" : "bg-white"
      )}
    >
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150" />

      <CardHeader className="flex-none pb-2 pt-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 px-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              <Shield className="h-3.5 w-3.5" />
              {station?.upazila.name}
            </div>
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">
              {station.name}
            </CardTitle>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
            <Building className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 pt-4">
        <div className="flex items-start gap-2.5 text-xs font-bold text-slate-400 leading-relaxed px-1">
          <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
          <span>{station.address}</span>
        </div>

        {station.distance !== undefined && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
            <Navigation className="h-3 w-3" />
            {station.distance?.toFixed(1)} km away
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-none grid grid-cols-2 gap-3 p-4 pt-4">
        <Button
          onClick={handleCall}
          className="rounded-xl bg-blue-600 font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
        <Button
          variant="outline"
          onClick={handleDirections}
          className="rounded-xl border-slate-200 font-black text-slate-600 transition-all hover:bg-slate-50 active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <ExternalLink className="mr-2 h-3.5 w-3.5" />
          Locate
        </Button>
      </CardFooter>
    </Card>
  );
}
