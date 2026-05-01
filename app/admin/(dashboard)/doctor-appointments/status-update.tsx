"use client";

import { useState } from "react";
import { Check, X, RefreshCcw, Loader2 } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/api/admin/doctor-actions";
import { toast } from "sonner";
import { Select } from "@/components/admin/ui/select";

interface AppointmentStatusUpdateProps {
  id: number;
  currentStatus: string;
}

export function AppointmentStatusUpdate({ id, currentStatus }: AppointmentStatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsLoading(true);
    try {
      const result = await updateAppointmentStatus(id, newStatus as any);
      if (result.success) {
        setStatus(newStatus);
        toast.success("Appointment status updated successfully");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
      ) : (
        <div className="relative group">
          <Select 
            value={status} 
            onChange={handleStatusChange} 
            disabled={isLoading}
            className={`h-8 w-[140px] px-3 py-0 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${getStatusStyles(status)}`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}
