"use client";

import { useEffect, useState } from "react";
import { DoctorProfile, getDoctors } from "@/lib/api/doctors";
import { DoctorCard } from "./doctor-card";
import { Loader2, SearchX } from "lucide-react";

interface DoctorListProps {
  filters: {
    specialty: string;
    location: string;
  };
}

export function DoctorList({ filters }: DoctorListProps) {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await getDoctors(filters.specialty, filters.location);
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Consulting Database...</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-[40px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <SearchX className="h-12 w-12 text-slate-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Doctors Found</h3>
          <p className="max-w-xs text-sm font-bold text-slate-400 italic">
            Try adjusting your specialty or location filters to find matching professionals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
