"use client";

import { Phone, MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { type BloodDonor } from "@/lib/api/blood-donation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DonorCardProps {
  donor: BloodDonor;
}

export function DonorCard({ donor }: DonorCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${donor.phone_number}`;
  };

  return (
    <Card className="ase-fade-up group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
      {/* Background Accent */}
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-red-500/5 transition-transform duration-500 group-hover:scale-150" />
      
      <CardHeader className="flex-none pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-800">
              {donor.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              {donor.location}
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 font-black text-white shadow-lg shadow-red-500/20">
            {donor.blood_group}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 pt-2">
        <div className="flex flex-wrap gap-2">
          {donor.is_available ? (
            <Badge variant="outline" className="gap-1.5 border-emerald-100 bg-emerald-50 py-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              Available
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 border-slate-100 bg-slate-50 py-1 text-[11px] font-bold text-slate-400">
              <XCircle className="h-3 w-3" />
              Not Available
            </Badge>
          )}
          
          {donor.last_donation_date && (
            <Badge variant="outline" className="gap-1.5 border-blue-100 bg-blue-50 py-1 text-[11px] font-bold text-blue-600">
              <Calendar className="h-3 w-3" />
              Last: {new Date(donor.last_donation_date).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-none border-t bg-slate-50/50 p-4">
        <Button 
          onClick={handleCall}
          className="w-full gap-2 rounded-xl bg-red-600 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Phone className="h-4 w-4" />
          Call Donor
        </Button>
      </CardFooter>
    </Card>
  );
}
