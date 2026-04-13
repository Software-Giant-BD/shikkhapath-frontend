"use client";

import { Phone, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmergencyBanner() {
  const handle999 = () => {
    window.location.href = "tel:999";
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-red-600 px-4 py-3 text-white shadow-xl shadow-red-600/20">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest leading-none">Fire Emergency?</h2>
            <p className="mt-1 text-[11px] font-bold text-red-100 uppercase tracking-tighter">Call 999 immediately for assistance</p>
          </div>
        </div>
        
        <Button 
          onClick={handle999}
          className="h-12 w-full max-w-[200px] rounded-xl bg-white px-8 font-black text-red-600 transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-lg"
        >
          <Phone className="mr-2 h-5 w-5 fill-red-600" />
          CALL 999
        </Button>
      </div>
    </div>
  );
}
