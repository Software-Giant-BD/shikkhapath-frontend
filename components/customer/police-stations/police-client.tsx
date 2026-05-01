"use client";

import { useState } from "react";
import { PoliceEmergencyBanner } from "./police-emergency-banner";
import { PoliceStationFilter } from "./police-station-filter";
import { PoliceStationList } from "./police-station-list";
import { Shield, Star, Lock, Info, ChevronRight, Activity, Phone } from "lucide-react";
import { ServiceAdBanner } from "../common/service-ad-banner";

export function PoliceServiceClient() {
  const [filters, setFilters] = useState({
    division_id: "",
    district_id: "",
    upazila_id: "",
    search: "",
    gps: undefined as { lat: number; lng: number } | undefined,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <PoliceEmergencyBanner />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 overflow-hidden blur-3xl" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#63b3ed] to-[#3182ce] opacity-10" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-900 shadow-2xl shadow-slate-200">
            <Shield className="h-10 w-10 text-white fill-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 sm:text-7xl uppercase italic leading-none">
            Police Station <span className="text-blue-600">Directory</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-bold leading-8 text-slate-400 uppercase tracking-widest">
            Always for the people. Access and contact any police station in 
            Bangladesh instantly for security and assistance.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6">
            <a href="#search" className="rounded-2xl bg-blue-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95">
              Access Directory
            </a>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              Read Safety Guides <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Ad Section */}
      <div className="container mx-auto mt-4 px-4">
        <ServiceAdBanner label="[ Police Station Directory Sponsor ]" />
      </div>

      {/* Main Content */}
      <div id="search" className="container mx-auto mt-12 px-4 pb-32 relative z-10">
        <div className="rounded-[56px] bg-white p-10 shadow-[0_32px_120px_-20px_rgba(49,130,206,0.08)] border border-white">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Station <span className="text-blue-600">Archive</span></h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                <Activity className="h-3 w-3 text-blue-500" />
                Real-time Directory Access
              </div>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-2xl bg-blue-50 px-6 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
              <Star className="h-4 w-4 fill-blue-600" />
              Verified Contact Points
            </div>
          </div>

          <PoliceStationFilter onFilterChange={handleFilterChange} />
          
          <div className="mt-16">
            <PoliceStationList filters={filters} />
          </div>
        </div>

        {/* Security Footer UI */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white p-10 text-center transition-all hover:bg-white/50">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-800">Secure Access</h3>
            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[180px]">Protected directory data for public safety use.</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white p-10 text-center transition-all hover:bg-white/50">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-800">Direct Connect</h3>
            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[180px]">Zero intermediary delays for emergency calls.</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white p-10 text-center transition-all hover:bg-white/50">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-800">Information</h3>
            <p className="mt-2 text-xs font-bold text-slate-400 leading-relaxed max-w-[180px]">Updated regularly via official channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
