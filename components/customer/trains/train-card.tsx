"use client";

import { Train as TrainIcon, Clock, Calendar, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { type Train } from "@/lib/api/trains";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrainCardProps {
  train: Train;
}

export function TrainCard({ train }: TrainCardProps) {
  return (
    <Card className="ase-fade-up group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 border-slate-100 bg-white">
      {/* Decorative Background Element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-50/50 blur-2xl transition-all group-hover:bg-orange-100/50" />
      
      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
              <TrainIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors">
                  {train.train_name}
                </h3>
                <span className="text-xs font-bold text-slate-400">#{train.train_code}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className="border-orange-100 bg-orange-50/30 text-[10px] font-black uppercase tracking-widest text-orange-600">
                  {train.train_type}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4">
        {/* Route Visualization */}
        <div className="relative mb-6 flex items-center justify-between px-2">
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full border-2 border-orange-500 bg-white" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{train.from_station}</span>
            <span className="text-[10px] font-bold text-slate-400">Departure</span>
          </div>
          
          <div className="absolute left-1/2 top-1.5 h-[1px] w-[60%] -translate-x-1/2 bg-slate-100">
             <div className="absolute right-0 -top-1">
                <ArrowRight className="h-3 w-3 text-slate-300" />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{train.to_station}</span>
            <span className="text-[10px] font-bold text-slate-400">Arrival</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 transition-colors group-hover:bg-orange-50/50">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
              <Clock className="h-3 w-3 text-orange-500" />
              Timings
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-700">{train.departure_time}</span>
               <span className="text-[10px] font-medium text-slate-400 italic">to {train.arrival_time}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 transition-colors group-hover:bg-orange-50/50">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
              <Calendar className="h-3 w-3 text-orange-500" />
              Off Day
            </div>
            <p className={`text-xs font-bold ${train.off_day === 'No' ? 'text-green-600' : 'text-red-500'}`}>
              {train.off_day === 'No' ? 'Runs Daily' : train.off_day}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center border-t border-slate-50 pt-4">
           <button className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-orange-600 transition-colors">
              View Full Route Details
           </button>
        </div>
      </CardContent>
    </Card>
  );
}
