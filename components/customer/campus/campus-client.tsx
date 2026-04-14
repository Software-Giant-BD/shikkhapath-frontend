"use client";

import { useState, useEffect } from "react";
import { CampusFilter } from "./campus-filter";
import { CampusCard } from "./campus-card";
import { getCampusNews, type CampusNews, type SearchParams } from "@/lib/api/campus";
import { Loader2, GraduationCap, Building2, School, Info, Search } from "lucide-react";

export function CampusClient() {
  const [news, setNews] = useState<CampusNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchParams>({
    type: "All",
    location: "All",
    query: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getCampusNews(filters);
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch campus news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const handleFilterChange = (newFilters: SearchParams) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1523050853063-bd8012fbb761?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/50 to-slate-900" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-blue-600/10 backdrop-blur-md ring-1 ring-blue-500/20">
            <GraduationCap className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white sm:text-7xl uppercase italic leading-none">
            Campus <span className="text-blue-500">Connect</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-bold leading-8 text-slate-400 uppercase tracking-widest">
            Latest updates, admission news, and achievements from 
            Schools, Colleges, and Universities across Bangladesh.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto -mt-16 px-4 relative z-10">
        <div className="rounded-[48px] bg-white p-8 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-white">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-800 uppercase italic">Institutional <span className="text-blue-600">News</span></h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                <Search className="h-3 w-3 text-blue-500" />
                Filter by Type or City
              </div>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-2xl bg-blue-50 px-6 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
              <Info className="h-4 w-4 fill-blue-600" />
              Verified Campus Sources
            </div>
          </div>

          <CampusFilter onFilterChange={handleFilterChange} isLoading={loading} />
          
          <div className="mt-16">
            {loading ? (
              <div className="flex h-96 flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Syncing News Database...</p>
              </div>
            ) : news.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <CampusCard key={item.id} news={item} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center space-y-6 rounded-[40px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
                <div className="rounded-full bg-slate-100 p-6 text-slate-300">
                  <Info className="h-12 w-12" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No News Found</h3>
                  <p className="mt-2 font-bold text-slate-400 uppercase tracking-widest text-[10px] max-w-xs mx-auto text-center leading-relaxed">
                    We couldn't find any news matching your filters. Try adjusting your search keywords.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Quick Stats */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="relative group overflow-hidden rounded-[32px] bg-white p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl">
             <div className="absolute right-0 top-0 h-24 w-24 bg-blue-50 rounded-full -translate-x-6 -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <GraduationCap className="h-8 w-8 text-blue-500 mb-4" />
                <h4 className="text-sm font-black uppercase italic text-slate-800">Universities</h4>
                <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admission & Research Updates</p>
             </div>
          </div>
          <div className="relative group overflow-hidden rounded-[32px] bg-white p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl">
             <div className="absolute right-0 top-0 h-24 w-24 bg-emerald-50 rounded-full -translate-x-6 -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <Building2 className="h-8 w-8 text-emerald-500 mb-4" />
                <h4 className="text-sm font-black uppercase italic text-slate-800">Colleges</h4>
                <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Board Exam & Event News</p>
             </div>
          </div>
          <div className="relative group overflow-hidden rounded-[32px] bg-white p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl">
             <div className="absolute right-0 top-0 h-24 w-24 bg-purple-50 rounded-full -translate-x-6 -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <School className="h-8 w-8 text-purple-500 mb-4" />
                <h4 className="text-sm font-black uppercase italic text-slate-800">Schools</h4>
                <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic & Sports Notices</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
