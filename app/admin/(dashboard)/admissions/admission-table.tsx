"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { type AdmissionUniversityModel } from "@/lib/api/admission";
import { type BasePagination } from "@/lib/api/common";
import { deleteAdmissionAction } from "@/lib/api/admission-actions";
import { Button } from "@/components/admin/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdmissionTableProps {
  items: AdmissionUniversityModel[];
  pagination: BasePagination;
}

export function AdmissionTable({ items, pagination }: AdmissionTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admission record?")) return;
    
    setIsDeleting(id);
    try {
      await deleteAdmissionAction(id);
      toast.success("Admission deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete admission");
    } finally {
      setIsDeleting(null);
    }
  };

  const getPageHref = (pageNumber: number) => {
    const query = new URLSearchParams(window.location.search);
    query.set("page", String(pageNumber));
    return `/admin/admissions?${query.toString()}`;
  };

  const pageLinks = Array.from(
    { length: pagination.last_page },
    (_, idx) => idx + 1,
  );

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="px-6 py-4 font-semibold">University</th>
              <th className="px-6 py-4 font-semibold">Exam Date</th>
              <th className="px-6 py-4 font-semibold">Requirements</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.unit}</div>
                  <div className="text-xs text-indigo-600 mt-1">{item.tags?.join(", ")}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-600">
                    {item.exam_date ? new Date(item.exam_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400">Type: {item.exam_type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-600">
                    SSC: {item.req_ssc} | HSC: {item.req_hsc} | Total: {item.req_total}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/admissions/${item.id}`}>
                      <Button variant="secondary" size="sm">
                        <Pencil size={14} />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                    >
                      <Trash2 size={14} />
                      {isDeleting === item.id ? "..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No admission records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-slate-500">
          Showing {pagination.total === 0 ? 0 : (pagination.current_page - 1) * pagination.per_page + 1} to{" "}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
          {pagination.total} entries
        </p>

        {pagination.last_page > 1 && (
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
                    ? "bg-indigo-600 text-white"
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
        )}
      </div>
    </div>
  );
}
