import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getNewsList } from "@/lib/api/news";

type SearchParams = Promise<{
  page?: string;
  search?: string;
}>;

function formatDateTime(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function GuestArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const normalizedSearch = (search ?? "").trim();

  const { items: newsItems, pagination } = await getNewsList({
    page: current_page,
    per_page: 20,
    search: normalizedSearch || undefined,
    status: "pending" as any, // Only fetch pending articles
  });

  const rows = newsItems.map((item) => ({
    id: item.id,
    title: item.title,
    unique_code: item.unique_code,
    category: item.category?.title || "-",
    author: item.author_name || "-",
    publishAt: formatDateTime(item.publish_at),
    createdAt: formatDateTime(item.created_at),
  }));

  const startItem =
    pagination.total === 0
      ? 0
      : (pagination.current_page - 1) * pagination.per_page + 1;
  const endItem = Math.min(
    pagination.current_page * pagination.per_page,
    pagination.total,
  );
  const pageLinks = Array.from(
    { length: pagination.last_page },
    (_, idx) => idx + 1,
  );
  
  const getPageHref = (pageNumber: number) => {
    const query = new URLSearchParams();
    query.set("page", String(pageNumber));
    if (normalizedSearch) query.set("search", normalizedSearch);
    return `/admin/news/guest-articles?${query.toString()}`;
  };

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "News" }, { label: "Guest Articles" }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
               <h1 className="text-2xl font-bold text-slate-800">Guest Articles</h1>
               <p className="text-sm text-slate-500 mt-1">Review and moderate articles submitted by guest users.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold">Submitted At</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((news) => (
                  <tr
                    key={news.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="max-w-90 px-6 py-4 font-medium text-slate-800">
                      {news.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {news.category}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{news.author}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {news.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700">
                        Pending Review
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/news/${news.id}/edit`}>
                        <Button variant="secondary" size="sm" className="gap-2">
                          <Pencil size={14} />
                          Review & Publish
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-12 text-center text-slate-500 font-medium"
                      colSpan={6}
                    >
                      No guest articles found for moderation.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {pagination.total > pagination.per_page && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <p className="text-sm text-slate-500">
                Showing {startItem}-{endItem} of {pagination.total}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={getPageHref(Math.max(1, pagination.current_page - 1))}
                  aria-disabled={pagination.current_page <= 1}
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
                  href={getPageHref(
                    Math.min(pagination.last_page, pagination.current_page + 1),
                  )}
                  aria-disabled={pagination.current_page >= pagination.last_page}
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
        </CardContent>
      </Card>
    </div>
  );
}
