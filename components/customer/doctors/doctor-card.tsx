"use client";

import Image from "next/image";
import { Phone, MapPin, Calendar, Clock, Stethoscope, Hospital, Activity } from "lucide-react";
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
  const handleCall = () => {
    window.location.href = `tel:${doctor.phone_number}`;
  };

  return (
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
            <p className="text-xs font-bold text-slate-700">{doctor.location}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-2.5 transition-colors group-hover:bg-blue-50/50">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Activity className="h-3 w-3" />
              Fee
            </div>
            <p className="text-xs font-bold text-slate-700">{doctor.fee ? `৳${doctor.fee}` : "Contact for Fee"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-dotted border-slate-200 p-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Next Available
          </div>
          <p className="text-[11px] font-bold text-slate-600">
            {doctor.available_days[0]} · {doctor.available_time}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex-none grid grid-cols-2 gap-2 p-4 pt-0">
        <Button 
          onClick={handleCall}
          variant="outline"
          className="rounded-xl border-blue-100 font-bold text-blue-600 transition-all hover:bg-blue-50 active:scale-95"
        >
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
        <Button 
          className="rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-98"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book
        </Button>
      </CardFooter>
    </Card>
  );
}
