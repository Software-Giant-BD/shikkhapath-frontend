"use client";

import { useState } from "react";
import { EmergencyBanner } from "./emergency-banner";
import { FireStationFilter } from "./fire-station-filter";
import { FireStationList } from "./fire-station-list";
import { Flame, Star, Shield, Info } from "lucide-react";

export function FireServiceClient() {
  const [filters, setFilters] = useState({
    division: "All",
    city: "",
    area: "",
    gps: undefined as { lat: number; lng: number } | undefined,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#FCFCFF]">
      <EmergencyBanner />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden blur-3xl" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff4d4d] to-[#ff944d] opacity-10" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[32px] bg-red-600 shadow-2xl shadow-red-500/30 animate-pulse">
            <Flame className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-7xl uppercase italic leading-none">
            Fire Service <span className="text-red-600 tracking-tighter">Directory</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-bold leading-8 text-slate-400 uppercase tracking-widest">
            Always ready, always there. Locate and contact your nearest fire station 
            instantly across Bangladesh.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto -mt-16 px-4 pb-32 relative z-10">
        <div className="rounded-[56px] bg-white p-10 shadow-[0_32px_120px_-20px_rgba(255,100,100,0.08)] border border-white">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Station <span className="text-red-600">Locator</span></h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                <Star className="h-3 w-3 text-red-500" />
                Trusted by millions
              </div>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Shield className="h-4 w-4" />
              Verified Contact Numbers
            </div>
          </div>

          <FireStationFilter onFilterChange={handleFilterChange} />
          
          <div className="mt-16">
            <FireStationList filters={filters} />
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-16 flex flex-col items-center justify-center gap-6 rounded-[48px] bg-slate-900 p-16 text-center text-white relative overflow-hidden">
          <div className="absolute left-0 bottom-0 h-40 w-40 bg-red-600/10 blur-[100px]" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4">
            <Info className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-3xl font-black uppercase italic leading-none">Safety First.</h3>
          <p className="max-w-xl font-bold text-slate-400 uppercase tracking-wide text-sm">
            In case of large-scale fire emergencies, please do not wait. Use the 
            emergency number <span className="text-white">999</span> directly from any mobile or landline.
          </p>
          <div className="mt-8 h-1 w-20 rounded-full bg-red-600" />
        </div>
      </div>
    </div>
  );
}
