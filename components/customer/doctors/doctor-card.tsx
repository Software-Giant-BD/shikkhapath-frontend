"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Stethoscope,
  Hospital,
  Activity,
  X,
} from "lucide-react";
import { type DoctorProfile } from "@/lib/api/doctors";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking API call
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsBookingOpen(false);
    }, 2000);
  };

  return (
    <>
      <Card className="ase-fade-up group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 border-slate-100">
        <div className="relative aspect-square w-full overflow-hidden sm:aspect-[4/3]">
          {doctor.image_url ? (
            <Image
              src={doctor.image_url}
              alt={doctor.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-200">
              <Stethoscope className="h-20 w-20" />
            </div>
          )}
          <div className="absolute left-4 top-4">
            <Badge className="bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 backdrop-blur-md">
              {doctor.specialty}
            </Badge>
          </div>
        </div>

        <CardHeader className="flex-none space-y-2 pb-2 pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Hospital className="h-3.5 w-3.5 text-blue-500" />
                {doctor.hospital}
              </div>
              {doctor.bmdc_number && (
                <div className="mt-2 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded shadow-sm border border-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  BM&DC Registered Verified
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-2.5 transition-colors group-hover:bg-blue-50/50">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <MapPin className="h-3 w-3" />
                City
              </div>
              <p className="text-xs font-bold text-slate-700">
                {doctor.location}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-2.5 transition-colors group-hover:bg-blue-50/50">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Activity className="h-3 w-3" />
                Fee
              </div>
              <p className="text-xs font-bold text-slate-700">
                {doctor.fee ? `৳${doctor.fee}` : "Contact for Fee"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-dotted border-slate-200 p-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              Next Available
            </div>
            <p className="text-[11px] font-bold text-slate-600">
              {doctor.next_available} ({doctor.available_time})
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-none w-full p-4 pt-0">
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="w-full rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-98"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book
          </Button>
        </CardFooter>
      </Card>

      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setIsBookingOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800">
                    Booking Successful!
                  </h3>
                  <p className="text-slate-500 font-medium">
                    Your appointment request has been submitted.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 border-b border-slate-100 p-6 text-center">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    Book Appointment
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {doctor.name}
                  </p>
                </div>
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                          Age
                        </label>
                        <input
                          required
                          type="number"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                          placeholder="Years"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                          Phone Number
                        </label>
                        <input
                          required
                          type="tel"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                          placeholder="01XXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                        Address (City/Area)
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-3 items-start mt-2">
                    <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-bold text-amber-800 leading-snug pt-0.5">
                      Payment is not required right now, but it will be made
                      mandatory for booking in the future.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-blue-600 py-6 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-98"
                    >
                      Confirm Booking Without Payment
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
