"use client";

import { useState } from "react";
import { DoctorFilter } from "./doctor-filter";
import { DoctorList } from "./doctor-list";
import { DoctorRegistrationForm } from "./doctor-registration-form";
import { Button } from "@/components/ui/button";
import { Stethoscope, Plus, Search, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import { ServiceAdBanner } from "../common/service-ad-banner";

export function DoctorClient() {
  const [filters, setFilters] = useState({
    specialty: "All",
    location: "All",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFilterChange = (newFilters: { specialty: string; location: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#90cdf4] to-[#63b3ed] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="rounded-[28px] bg-blue-50 p-4 text-blue-600 shadow-inner">
              <Stethoscope className="h-10 w-10 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-7xl uppercase italic leading-none">
            Expert Medical <span className="text-blue-600">Consultation</span>
          </h1>
          <p className="mt-8 text-lg font-bold leading-8 text-slate-400 max-w-2xl mx-auto uppercase tracking-wide">
            Access the best medical professionals in Bangladesh. Book appointments 
            instantly and consult with verified specialists.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => setIsRegistering(true)}
              className="group relative h-16 rounded-[24px] bg-slate-900 px-10 font-black text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
            >
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              Register as Doctor
            </Button>
            <a href="#search" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              Find Specialists <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Ad Section */}
      <div className="container mx-auto mt-4 px-4">
        <ServiceAdBanner label="[ Medical Professionals Directory Sponsor ]" />
      </div>

      {/* Filter & Results Section */}
      <div id="search" className="container mx-auto px-4 pb-32">
        <div className="relative mt-12 rounded-[48px] bg-white p-8 shadow-2xl shadow-blue-900/5 border border-white">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-800 uppercase italic leading-none">Verified <span className="text-blue-600">Profiles</span></h2>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Choose from {filters.specialty === "All" ? "various fields" : filters.specialty}</p>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Real-time Availability
            </div>
          </div>

          <DoctorFilter onFilterChange={handleFilterChange} />
          
          <div className="mt-16">
            <DoctorList filters={filters} />
          </div>
        </div>

        {/* Support Banner */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[40px] bg-blue-600 p-10 text-white transition-all hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-white/10 blur-2xl" />
            <h3 className="text-2xl font-black uppercase italic">Direct Hotline</h3>
            <p className="mt-2 font-bold text-blue-100 uppercase tracking-widest text-[10px]">24/7 Support Service</p>
            <div className="mt-12 text-4xl font-black">16247</div>
          </div>
          <div className="group relative overflow-hidden rounded-[40px] bg-slate-900 p-10 text-white transition-all hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-white/5 blur-2xl" />
            <h3 className="text-2xl font-black uppercase italic">Help Center</h3>
            <p className="mt-2 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Frequently Asked Questions</p>
            <Button variant="link" className="mt-10 p-0 font-black uppercase tracking-[0.2em] text-white hover:text-blue-400">
              Read Guides →
            </Button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegistering && (
        <DoctorRegistrationForm 
          onClose={() => setIsRegistering(false)} 
          onSuccess={() => {
            setIsRegistering(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }} 
        />
      )}

      {/* Success View */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full bg-emerald-600 px-8 py-5 text-white shadow-2xl shadow-emerald-500/40">
            <CheckCircle2 className="h-6 w-6" />
            <p className="text-sm font-black uppercase tracking-widest">Enrollment Success! Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
}
