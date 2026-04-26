"use client";

import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { type AmbulanceService } from "@/lib/api/ambulance";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AmbulanceServiceCardProps {
  service: AmbulanceService;
}

export function AmbulanceServiceCard({ service }: AmbulanceServiceCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${service.phone_number}`;
  };

  const displayLocation = service.district?.bn_name || service.district?.name || "Unknown Location";

  return (
    <Card className="ase-fade-up group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={service.ambulance_photo || "/placeholder-ambulance.jpg"}
          alt={service.provider_name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <CardHeader className="flex-none">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-lg font-bold text-slate-800">
            {service.provider_name}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {displayLocation}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {service.ambulance_details}
        </p>
      </CardContent>

      <CardFooter className="flex-none border-t bg-slate-50/50 p-4">
        <Button 
          onClick={handleCall}
          className="w-full gap-2 rounded-xl bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Phone className="h-4 w-4" />
          Call Now
        </Button>
      </CardFooter>
    </Card>
  );
}
