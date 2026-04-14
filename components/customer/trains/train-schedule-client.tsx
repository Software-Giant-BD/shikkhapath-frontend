"use client";

import { useState, useEffect } from "react";
import { Train as TrainIcon, Search, MapPin, Calendar, ArrowRightLeft, Loader2, Info } from "lucide-react";
import { type Train, getTrains } from "@/lib/api/trains";
import { BANGLADESH_RAILWAY_STATIONS } from "@/lib/constants/stations";
import { TrainCard } from "./train-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrainScheduleClient() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    const data = await getTrains({ from, to, date });
    setTrains(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/50 to-slate-900" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-[28px] bg-orange-500/10 p-4 text-orange-500 backdrop-blur-md ring-1 ring-orange-500/20">
              <TrainIcon className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-7xl uppercase italic leading-none">
            Bangladesh <span className="text-orange-500">Train</span> Service
          </h1>
          <p className="mt-8 text-lg font-bold leading-8 text-slate-300 max-w-2xl mx-auto uppercase tracking-wide">
            Real-time train schedules, routes, and timings. Plan your journey 
            across Bangladesh with ease and precision.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="mx-auto mt-16 max-w-5xl">
          <form 
            onSubmit={handleSearch}
            className="group relative rounded-[40px] bg-white p-4 shadow-2xl transition-all hover:shadow-orange-500/10 sm:p-6"
          >
            <datalist id="stations">
              {BANGLADESH_RAILWAY_STATIONS.map((station) => (
                <option key={station} value={station} />
              ))}
            </datalist>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_1fr_auto]">
              {/* From */}
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-orange-500 transition-colors z-10">
                  <MapPin className="h-5 w-5" />
                </div>
                <Input
                  placeholder="From Station"
                  value={from}
                  list="stations"
                  onChange={(e) => setFrom(e.target.value)}
                  className="h-16 rounded-[24px] border-slate-100 bg-slate-50 pl-12 font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-orange-500 transition-all"
                />
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleSwap}
                  className="h-12 w-12 rounded-full border-slate-100 bg-white text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-90"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </Button>
              </div>

              {/* To */}
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-orange-500 transition-colors z-10">
                  <MapPin className="h-5 w-5" />
                </div>
                <Input
                  placeholder="To Station"
                  value={to}
                  list="stations"
                  onChange={(e) => setTo(e.target.value)}
                  className="h-16 rounded-[24px] border-slate-100 bg-slate-50 pl-12 font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-orange-500 transition-all"
                />
              </div>

              {/* Date */}
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-orange-500 transition-colors">
                  <Calendar className="h-5 w-5" />
                </div>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-16 rounded-[24px] border-slate-100 bg-slate-50 pl-12 font-bold text-slate-700 placeholder:text-slate-400 focus-visible:ring-orange-500 transition-all"
                />
              </div>

              {/* Search Button */}
              <Button 
                type="submit"
                className="h-16 rounded-[24px] bg-orange-600 px-8 font-black text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-20 lg:max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800 uppercase italic">
              Available <span className="text-orange-600">Schedules</span>
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
              {loading ? "Searching for trains..." : `${trains.length} trains found for your route`}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 ring-1 ring-slate-100">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Verified Timing Data
          </div>
        </div>

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4">
             <div className="relative h-20 w-20">
                <Loader2 className="h-20 w-20 animate-spin text-orange-200" />
                <TrainIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-orange-600" />
             </div>
             <p className="font-black uppercase tracking-[0.3em] text-slate-300 text-xs mt-4">Pulling Schedule Data...</p>
          </div>
        ) : trains.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trains.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center space-y-6 rounded-[48px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
            <div className="rounded-full bg-slate-100 p-6 text-slate-300">
              <Info className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Trains Found</h3>
              <p className="mt-2 font-bold text-slate-400 uppercase tracking-widest text-[10px] max-w-xs mx-auto">
                We couldn't find any trains matching your search. Try different stations or check the date.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setFrom(""); setTo(""); setDate(""); fetchResults(); }}
              className="rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-20 group relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-white shadow-2xl transition-all hover:shadow-orange-500/5">
           <div className="absolute right-0 top-0 h-64 w-64 -translate-y-24 translate-x-24 rounded-full bg-orange-600/10 blur-3xl transition-all group-hover:bg-orange-600/20" />
           <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                 <h3 className="text-3xl font-black uppercase italic leading-none">Important <span className="text-orange-500">Notice</span></h3>
                 <p className="font-medium text-slate-400 leading-relaxed">
                   Passengers are requested to report at the station at least 30 minutes before departure. 
                   Schedule may vary during holidays or technical maintenance. Always verify with the station master.
                 </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[200px]">
                 <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">Railways Helpline</span>
                 <span className="text-4xl font-black tracking-tighter">131</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
