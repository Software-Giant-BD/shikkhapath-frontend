"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Phone, MapPin, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteFireStation } from "@/lib/api/fire-stations";
import { type FireStation, type FireStationPagination } from "@/lib/api/fire-station-types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FireStationTableProps {
  items: FireStation[];
  pagination: FireStationPagination;
}

export function FireStationTable({ items, pagination }: FireStationTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this fire station?")) return;

    setIsDeleting(id);
    try {
      const res = await deleteFireStation(id);
      if (res.success) {
        toast.success("Fire station deleted successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  const getPageHref = (pageNumber: number) => {
    const query = new URLSearchParams(window.location.search);
    query.set("page", String(pageNumber));
    return `/admin/fire-stations?${query.toString()}`;
  };

  const pageLinks = Array.from(
    { length: pagination.last_page },
    (_, idx) => idx + 1
  ).filter((pageNumber) => {
    const current = pagination.current_page;
    return (
      pageNumber === 1 ||
      pageNumber === pagination.last_page ||
      (pageNumber >= current - 2 && pageNumber <= current + 2)
    );
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="px-6 py-4 font-semibold w-[300px]">Station Info</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-40 text-center text-slate-500">
                  No fire stations found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <Shield size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone size={12} className="text-orange-500" />
                          {item.phone_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        {item.upazila?.name}, {item.district?.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        <span className="truncate max-w-[200px]">{item.address || "No address provided"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={item.is_active ? "success" : "secondary"}
                      className="rounded-full px-3 py-1 font-semibold"
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/fire-stations/${item.id}/edit`}>
                        <Button variant="secondary" size="sm" className="h-9 w-9 p-0 hover:bg-orange-50 hover:text-orange-600 border-slate-200">
                          <Edit2 size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 border-slate-200"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                      >
                        {isDeleting === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="text-sm text-slate-500">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
            {pagination.total} entries
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={getPageHref(Math.max(1, pagination.current_page - 1))}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pagination.current_page <= 1
                  ? "pointer-events-none bg-slate-100 text-slate-400"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Prev
            </Link>

            {pageLinks.map((pageNumber) => (
              <Link
                key={pageNumber}
                href={getPageHref(pageNumber)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pageNumber === pagination.current_page
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href={getPageHref(Math.min(pagination.last_page, pagination.current_page + 1))}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pagination.current_page >= pagination.last_page
                  ? "pointer-events-none bg-slate-100 text-slate-400"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
