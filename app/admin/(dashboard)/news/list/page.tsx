import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getNewsList } from "@/lib/api/news";

type SearchParams = Promise<{ page?: string }>;

type DisplayNewsStatus = "Draft" | "Published" | "Scheduled";

function toDisplayNewsStatus(status: string): DisplayNewsStatus {
  if (status === "published") return "Published";
  if (status === "scheduled") return "Scheduled";
  return "Draft";
}

function statusClass(status: DisplayNewsStatus) {
  if (status === "Published") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "Scheduled") {
    return "bg-sky-50 text-sky-700";
  }
  return "bg-amber-50 text-amber-700";
}

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

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { items: newsItems, pagination } = await getNewsList({ page: currentPage, per_page: 20 });

  const rows = newsItems.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category?.title || "-",
    subCategory: item.sub_category?.title || "-",
    author: item.author_name || "-",
    status: (
      item.status === "published" ? "Published" : item.status === "scheduled" ? "Scheduled" : "Draft"
    ) as "Published" | "Scheduled" | "Draft",
    publishAt: formatDateTime(item.publish_at),
  }));

  const startItem = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.perPage, pagination.total);
  const pageLinks = Array.from({ length: pagination.lastPage }, (_, idx) => idx + 1);
  const getPageHref = (pageNumber: number) => `/admin/news/list?page=${pageNumber}`;

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "News" }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-6">
            <h1 className="text-2xl font-bold text-slate-800">News List</h1>

            <Link href="/admin/news/add">
              <Button>
                <Plus size={16} />
                Add News
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Sub-category</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Publish At</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((news) => (
                  <tr key={news.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="max-w-90 px-6 py-4 font-medium text-slate-800">{news.title}</td>
                    <td className="px-6 py-4 text-slate-600">/{news.slug}</td>
                    <td className="px-6 py-4 text-slate-600">{news.category}</td>
                    <td className="px-6 py-4 text-slate-600">{news.subCategory}</td>
                    <td className="px-6 py-4 text-slate-600">{news.author}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(news.status)}`}>
                        {news.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{news.publishAt}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/news/${news.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={8}>
                      No news found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
