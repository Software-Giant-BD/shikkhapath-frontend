"use client";

import { useEffect, useState } from "react";
import { BloodDonor, getDonors } from "@/lib/api/blood-donation";
import { DonorCard } from "./donor-card";
import { Loader2, SearchX, Droplets } from "lucide-react";

interface DonorListProps {
  filters: {
    group: string;
    location: string;
    availableOnly: boolean;
  };
}

export function DonorList({ filters }: DonorListProps) {
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!filters.group) {
      setDonors([]);
      return;
    }

    const fetchDonors = async () => {
      setIsLoading(true);
      try {
        const data = await getDonors(filters.group, filters.location);
        let result = data;
        if (filters.availableOnly) {
          result = result.filter(d => d.is_available);
        }
        setDonors(result);
      } catch (error) {
        console.error("Failed to fetch donors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, [filters]);

  if (!filters.group) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-red-100 bg-red-50/20 p-12 text-center">
        <div className="relative">
          <Droplets className="h-16 w-16 text-red-100" />
          <Droplets className="absolute inset-0 h-16 w-16 animate-ping text-red-500/20" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Select a Blood Group</h3>
          <p className="max-w-xs text-sm font-medium text-slate-500">
            Please select the mandatory blood group from the filters above to see available donors.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Searching for {filters.group} donors...</p>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <SearchX className="h-10 w-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">No Donors Found</h3>
          <p className="max-w-xs text-sm font-medium text-slate-500">
            We couldn't find any approved {filters.group} donors in {filters.location === "All" ? "any location" : filters.location} right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {donors.map((donor) => (
        <DonorCard key={donor.id} donor={donor} />
      ))}
    </div>
  );
}
