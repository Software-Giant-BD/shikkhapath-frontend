"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Phone,
  FileText,
} from "lucide-react";
import {
  type AmbulanceService,
  type BasePagination,
} from "@/lib/api/ambulance";
import { updateAmbulanceStatusAction } from "@/lib/api/admin/ambulance-actions";
import { Button } from "@/components/admin/ui/button";
import { toast } from "sonner";

interface AmbulanceTableProps {
  items: AmbulanceService[];
  pagination: BasePagination;
}

export function AmbulanceTable({ items, pagination }: AmbulanceTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] =
    useState<AmbulanceService | null>(null);

  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected",
  ) => {
    setUpdatingId(id);
    const result = await updateAmbulanceStatusAction(String(id), status);
    setUpdatingId(null);

    if (result.ok) {
      toast.success(result.message);
      if (selectedAmbulance?.id === id) {
        setSelectedAmbulance((prev) => (prev ? { ...prev, status } : null));
      }
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
              <th className="px-6 py-4 font-semibold">Provider Info</th>
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
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">
                      {item.provider_name}
                    </span>
                    <span className="text-xs text-slate-500">
                      NID: {item.nid_number}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {item.district?.bn_name || item.district?.name}
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
                      onClick={() => setSelectedAmbulance(item)}
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No registration requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedAmbulance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedAmbulance.provider_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedAmbulance.status)}
                  <span className="text-xs text-slate-400">
                    Registered on{" "}
                    {new Date(
                      selectedAmbulance.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAmbulance(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Service Details
                  </h3>
                  <div className="grid gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Manager Name</span>
                      <span className="font-semibold text-slate-800">
                        {selectedAmbulance.full_name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-semibold text-slate-800">
                        {selectedAmbulance.phone_number}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Location</span>
                      <span className="font-semibold text-slate-800">
                        {selectedAmbulance.district?.bn_name ||
                          selectedAmbulance.district?.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">NID Number</span>
                      <span className="font-semibold text-slate-800">
                        {selectedAmbulance.nid_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">
                        Ambulance Details
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedAmbulance.ambulance_details ||
                          "No details provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedAmbulance.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold text-white shadow-lg shadow-emerald-100"
                      onClick={() =>
                        handleStatusUpdate(selectedAmbulance.id, "approved")
                      }
                      disabled={updatingId === selectedAmbulance.id}
                    >
                      Approve Registration
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-12 rounded-xl font-bold"
                      onClick={() =>
                        handleStatusUpdate(selectedAmbulance.id, "rejected")
                      }
                      disabled={updatingId === selectedAmbulance.id}
                    >
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Documents
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Ambulance Photo
                    </label>
                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                      {selectedAmbulance.ambulance_photo ? (
                        <img
                          src={selectedAmbulance.ambulance_photo}
                          alt="Ambulance"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        NID Copy
                      </label>
                      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                        {selectedAmbulance.nid_copy ? (
                          selectedAmbulance.nid_copy.endsWith(".pdf") ? (
                            <a
                              href={selectedAmbulance.nid_copy}
                              target="_blank"
                              className="flex h-full flex-col items-center justify-center gap-2 text-primary hover:bg-slate-200 transition-colors"
                            >
                              <FileText size={32} />
                              <span className="text-[10px] font-bold">
                                View PDF
                              </span>
                            </a>
                          ) : (
                            <img
                              src={selectedAmbulance.nid_copy}
                              alt="NID"
                              className="h-full w-full object-cover"
                            />
                          )
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Manager Photo
                      </label>
                      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                        {selectedAmbulance.manager_photo ? (
                          <img
                            src={selectedAmbulance.manager_photo}
                            alt="Manager"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 p-4 md:p-6">
          <p className="text-xs text-slate-500">
            Showing Page {pagination.current_page} of {pagination.last_page}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/ambulances?page=${pagination.current_page - 1}`}
              className={`rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold transition-all hover:bg-slate-200 ${pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}`}
            >
              Prev
            </Link>
            <Link
              href={`/admin/ambulances?page=${pagination.current_page + 1}`}
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
