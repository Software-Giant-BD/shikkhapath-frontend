import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getAdvertisements } from "@/lib/api/advertisements";
import { DeleteAdvertisementButton } from "@/components/admin/advertisements/DeleteAdvertisementButton";

type SearchParams = Promise<{ page?: string }>;

export default async function AdvertisementsListPage({ searchParams }: { searchParams: SearchParams }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { items, pagination } = await getAdvertisements({ page: currentPage, per_page: 20 });

  const startItem = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.perPage, pagination.total);
  const pageLinks = Array.from({ length: pagination.lastPage }, (_, idx) => idx + 1);
  const getPageHref = (pageNumber: number) => `/admin/advertisements/list?page=${pageNumber}`;

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Advertisements" }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-6">
            <h1 className="text-2xl font-bold text-slate-800">Advertisement List</h1>

            <Link href="/admin/advertisements/add">
              <Button>
                <Plus size={16} />
                Add Advertisement
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Placement</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((ad) => (
                  <tr key={ad.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      {ad.image ? (
                        <div className="relative h-12 w-20 overflow-hidden rounded-md border border-slate-200">
                          <Image src={ad.image} alt={ad.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <span className="text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="max-w-90 px-6 py-4 font-medium text-slate-800">{ad.name}</td>
                    <td className="px-6 py-4 text-slate-600">{ad.category}</td>
                    <td className="px-6 py-4 text-slate-600">{ad.placement}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ad.status ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {ad.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/admin/advertisements/${ad.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            <Pencil size={14} />
                            Edit
                          </Button>
                        </Link>
                        <DeleteAdvertisementButton id={ad.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={6}>
                      No advertisements found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {pagination.total > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <p className="text-sm text-slate-500">
                Showing {startItem}-{endItem} of {pagination.total}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={getPageHref(Math.max(1, pagination.currentPage - 1))}
                  aria-disabled={pagination.currentPage <= 1}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pagination.currentPage <= 1
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
                      pageNumber === pagination.currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}

                <Link
                  href={getPageHref(Math.min(pagination.lastPage, pagination.currentPage + 1))}
                  aria-disabled={pagination.currentPage >= pagination.lastPage}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pagination.currentPage >= pagination.lastPage
                      ? "pointer-events-none bg-slate-100 text-slate-400"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
