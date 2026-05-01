"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Phone,
  Trash2,
} from "lucide-react";
import { type BloodDonor } from "@/lib/api/blood-donation";
import { type BasePagination } from "@/lib/api/api-utils";
import { updateBloodDonorStatusAction, deleteBloodDonorAction } from "@/lib/api/admin/blood-donor-actions";
import { Button } from "@/components/admin/ui/button";
import { toast } from "sonner";

interface BloodDonorTableProps {
  items: BloodDonor[];
  pagination: BasePagination;
}

export function BloodDonorTable({ items, pagination }: BloodDonorTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    const result = await updateBloodDonorStatusAction(id, status);
    setUpdatingId(null);

    if (result.success) {
      toast.success(result.message);
      // Refresh logic would ideally re-fetch or update local state
      // For now, let's update selected donor if it's the one
      if (selectedDonor?.id === id) {
        setSelectedDonor((prev) => (prev ? { ...prev, status: status as any } : null));
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;
    
    const result = await deleteBloodDonorAction(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Donor Info</th>
              <th className="px-6 py-4 font-semibold">Blood Group</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.full_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-bold text-slate-400">NA</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {item.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        NID: {item.nid_number}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-sm shadow-red-100">
                        {item.blood_group}
                    </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {item.district}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    {item.phone_number}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          disabled={updatingId === item.id}
                          onClick={() =>
                            handleStatusUpdate(item.id, "approved")
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          disabled={updatingId === item.id}
                          onClick={() =>
                            handleStatusUpdate(item.id, "rejected")
                          }
                        >
                          <XCircle size={16} />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDonor(item)}
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No blood donors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedDonor.full_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedDonor.status)}
                  <span className="text-xs text-slate-400">
                    Registered on{" "}
                    {new Date(
                      selectedDonor.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                    {selectedDonor.image_url ? (
                    <img
                        src={selectedDonor.image_url}
                        alt={selectedDonor.full_name}
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                        No Profile Image
                    </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500 text-xs">Blood Group</span>
                            <span className="font-bold text-red-600">
                                {selectedDonor.blood_group}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500 text-xs">Phone</span>
                            <span className="font-semibold text-slate-800">
                                {selectedDonor.phone_number}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500 text-xs">District</span>
                            <span className="font-semibold text-slate-800">
                                {selectedDonor.district}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500 text-xs">NID Number</span>
                            <span className="font-semibold text-slate-800">
                                {selectedDonor.nid_number}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500 text-xs">Availability</span>
                            <span className={`font-bold ${selectedDonor.is_available ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {selectedDonor.is_available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-xs">Last Donation</span>
                            <span className="font-semibold text-slate-800">
                                {selectedDonor.last_donation_date ? new Date(selectedDonor.last_donation_date).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {selectedDonor.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                            <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-10 rounded-xl font-bold text-white"
                            onClick={() =>
                                handleStatusUpdate(selectedDonor.id, "approved")
                            }
                            disabled={updatingId === selectedDonor.id}
                            >
                            Approve
                            </Button>
                            <Button
                            variant="ghost"
                            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-10 rounded-xl font-bold"
                            onClick={() =>
                                handleStatusUpdate(selectedDonor.id, "rejected")
                            }
                            disabled={updatingId === selectedDonor.id}
                            >
                            Reject
                            </Button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 md:p-6">
          <p className="text-xs text-slate-500">
            Showing Page {pagination.current_page} of {pagination.last_page}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/blood-donors?page=${pagination.current_page - 1}`}
              className={`rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold transition-all hover:bg-slate-200 ${pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}`}
            >
              Prev
            </Link>
            <Link
              href={`/admin/blood-donors?page=${pagination.current_page + 1}`}
              className={`rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold transition-all hover:bg-slate-200 ${pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : ""}`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
