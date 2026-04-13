"use client";

import { Phone, ShieldAlert, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PoliceEmergencyBanner() {
  const handle999 = () => {
    window.location.href = "tel:999";
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-slate-900 px-4 py-3 text-white shadow-2xl">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm font-black uppercase tracking-widest leading-none">Emergency?</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call 999 immediately for assistance</p>
          </div>
        </div>
        
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            24/7 Access
          </div>
          <Button 
            onClick={handle999}
            className="h-12 w-full rounded-xl bg-blue-600 px-8 font-black text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10 sm:w-auto"
          >
            <Phone className="mr-2 h-5 w-5 fill-white" />
            CALL 999
          </Button>
        </div>
      </div>
    </div>
  );
}
