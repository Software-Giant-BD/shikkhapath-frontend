"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDoctorStatus } from "@/lib/api/admin/doctor-actions";
import { Button } from "@/components/admin/ui/button";

export function StatusForm({
  doctorId,
  initialStatus,
  initialRejectionReason,
}: {
  doctorId: number;
  initialStatus: "pending" | "active" | "rejected";
  initialRejectionReason?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [rejectionReason, setRejectionReason] = useState(initialRejectionReason || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (status === "rejected" && !rejectionReason.trim()) {
      setError("Rejection reason is required when rejecting a doctor.");
      setLoading(false);
      return;
    }

    const res = await updateDoctorStatus(doctorId, status, status === "rejected" ? rejectionReason : undefined);

    if (res.success) {
      setSuccess("Status updated successfully!");
      router.refresh();
    } else {
      setError(res.error || "Failed to update status");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md">{error}</div>}
      {success && <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">{success}</div>}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Approval Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="pending">Pending</option>
          <option value="active">Active (Approved)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {status === "rejected" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-medium text-slate-700">Rejection Reason</label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
            placeholder="Explain why this application was rejected..."
            required
          />
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </form>
  );
}
