"use client";

import { useState } from "react";
import { DonorFilter } from "./donor-filter";
import { DonorList } from "./donor-list";
import { DonorRegistrationForm } from "./donor-registration-form";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Search, Droplets, Info } from "lucide-react";

export function BloodDonationClient() {
  const [filters, setFilters] = useState({
    group: "",
    location: "All",
    availableOnly: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white pb-16 pt-24 sm:pb-24 sm:pt-32">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden blur-3xl" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#f87171] opacity-20" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-600 shadow-xl shadow-red-500/20 mb-8 animate-bounce">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl uppercase italic">
            Find Life <span className="text-red-600">Savers</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Emergency blood donation network connecting donors with those in need. 
            Real-time availability and verified donor profiles.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => setIsRegistering(true)}
              className="group relative h-14 rounded-2xl bg-slate-900 px-8 font-bold text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              Register as Donor
            </Button>
            <a href="#search" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-red-600 transition-colors">
              Find Donors ↓
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="search" className="container mx-auto -mt-12 px-4 pb-24 relative z-10">
        <div className="rounded-[40px] bg-white p-6 shadow-2xl shadow-slate-200/50 border border-white">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Active Donors</h2>
              <p className="text-sm font-bold text-slate-400">Search results based on your selection</p>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-2xl bg-red-50 px-4 text-[10px] font-black uppercase tracking-widest text-red-600">
              <Info className="h-3.5 w-3.5" />
              Showing only verified donors
            </div>
          </div>

          <DonorFilter onFilterChange={setFilters} />
          
          <div className="mt-12">
            <DonorList filters={filters} />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 overflow-hidden rounded-[40px] bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-20 translate-x-20 rounded-full bg-red-500/20 blur-3xl" />
          <h3 className="text-2xl font-black leading-tight sm:text-3xl">Be a Hero. Donate Blood.</h3>
          <p className="mx-auto mt-4 max-w-lg font-medium text-slate-400">
            Your single donation can save up to three lives. Join our verified network of 
            active donors in your local area.
          </p>
          <Button 
            variant="outline"
            onClick={() => setIsRegistering(true)}
            className="mt-8 h-12 rounded-xl border-white/20 bg-white/10 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-900"
          >
            Become a Donor now
          </Button>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegistering && (
        <DonorRegistrationForm 
          onClose={() => setIsRegistering(false)} 
          onSuccess={() => {
            setIsRegistering(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }} 
        />
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 animate-bounce">
          <div className="flex items-center gap-3 rounded-full bg-emerald-600 px-6 py-4 text-white shadow-2xl">
            <CheckCircle2 className="h-6 w-6" />
            <p className="text-sm font-bold uppercase tracking-widest">Registration Sent for Approval!</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
