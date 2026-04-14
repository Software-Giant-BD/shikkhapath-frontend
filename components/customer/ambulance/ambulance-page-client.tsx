"use client";

import { useState } from "react";
import { Plus, PhoneCall, AlertCircle } from "lucide-react";
import { LocationFilter } from "./location-filter";
import { AmbulanceList } from "./ambulance-list";
import { AmbulanceRegistrationForm } from "./ambulance-registration-form";
import { Button } from "@/components/ui/button";
import { ServiceAdBanner } from "../common/service-ad-banner";

export function AmbulancePageClient() {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <section className="ase-hero">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <PhoneCall className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Ambulance Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80 sm:text-xl">
            Find the nearest emergency ambulance service instantly. 
            Reliable, 24/7 support for your medical emergencies.
          </p>
        </div>
      </section>

      {/* Action Bar */}
      <div className="container mx-auto -mt-10 px-4">
        <div className="ase-panel p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-grow">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                Filter by Location
              </h2>
              <LocationFilter onLocationChange={setSelectedLocation} />
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-6">
              <Button
                onClick={() => setShowRegistration(true)}
                className="group relative h-12 gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 font-bold text-white transition-all hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Register as Provider
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Section */}
      <div className="container mx-auto mt-8 px-4">
        <ServiceAdBanner label="[ Ambulance Service Sponsor ]" />
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="container mx-auto mt-6 px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-semibold">
              Registration submitted! We will verify your details and list your service soon.
            </p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <section className="container mx-auto mt-12 px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {selectedLocation === "All" ? "Available Services" : `Services in ${selectedLocation}`}
            </h3>
            <p className="text-sm text-slate-500">Showing only verified service providers</p>
          </div>
        </div>
        
        <AmbulanceList location={selectedLocation} />
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <AmbulanceRegistrationForm 
          onClose={() => setShowRegistration(false)} 
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </main>
  );
}
