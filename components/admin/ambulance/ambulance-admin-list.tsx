"use client";

import { useState } from "react";
import { Check, X, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { AmbulanceService, AmbulanceStatus } from "@/lib/api/ambulance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INITIAL_PENDING: AmbulanceService[] = [
  {
    id: "3",
    provider_name: "Dhaka North Life Support",
    phone_number: "01999888777",
    location: "Dhaka",
    description: "New ambulance service specialized in pediatric care.",
    image_url: "https://images.unsplash.com/photo-1516574177582-881577582-881577582-881577582-881577582", // placeholder
    nid_number: "1122334455",
    status: "pending",
    created_at: new Date().toISOString(),
  }
];

export function AmbulanceAdminList() {
  const [registrations, setRegistrations] = useState<AmbulanceService[]>(INITIAL_PENDING);

  const handleStatusChange = (id: string, newStatus: AmbulanceStatus) => {
    setRegistrations(prev => 
      prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg)
    );
    // In a real app, call API to update status
    alert(`Status updated to ${newStatus}`);
  };

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="border-b bg-slate-50/50 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Pending Verifications
        </h3>
        <p className="text-sm text-slate-500">Review and approve new ambulance service providers</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50/30 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Provider Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">NID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No pending registrations to review.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{reg.provider_name}</span>
                      <span className="text-xs text-slate-500">{reg.phone_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{reg.location}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{reg.nid_number}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="flex w-fit items-center gap-1.5 border-amber-200 bg-amber-50 text-amber-700">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(reg.id, "rejected")}
                        className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(reg.id, "approved")}
                        className="h-8 bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
