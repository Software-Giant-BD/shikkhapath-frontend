"use client";

import { Megaphone } from "lucide-react";

interface ServiceAdBannerProps {
  label: string;
  className?: string;
}

export function ServiceAdBanner({ label, className = "" }: ServiceAdBannerProps) {
  return (
    <div className={`group relative overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md ${className}`}>
      {/* Decorative background */}
      <div className="absolute right-0 top-0 h-full w-32 bg-slate-50 opacity-50 skew-x-12 translate-x-16 transition-all group-hover:translate-x-12" />
      
      <div className="relative flex min-h-[140px] items-center justify-between px-8 py-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 items-center rounded-full bg-slate-900 px-2.5 text-[8px] font-black uppercase tracking-widest text-white">
              Sponsored
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
               <Megaphone className="h-3 w-3" />
               Partner Space
            </div>
          </div>
          
          <div className="mt-2">
             <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">
                {label}
             </h4>
             <p className="mt-1 text-[11px] font-bold text-slate-300 uppercase">
                Your advertisement could be here
             </p>
          </div>
        </div>

        <div className="flex items-center">
           <div className="h-16 w-[1px] bg-slate-100 mx-8 hidden sm:block" />
           <button className="rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95">
              Contact for Ad
           </button>
        </div>
      </div>
    </div>
  );
}
