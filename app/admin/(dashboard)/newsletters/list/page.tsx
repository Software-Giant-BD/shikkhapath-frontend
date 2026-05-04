import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { NewsletterListFilters } from "@/components/admin/newsletters/NewsletterListFilters";
import { getNewslettersList } from "@/lib/api/newsletters";
import { DeleteNewsletterButton } from "@/components/admin/newsletters/DeleteNewsletterButton";
import Link from "next/link";

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function NewslettersListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);
  const searchValue = search?.trim() || "";

  const result = await getNewslettersList({
    page: current_page,
    per_page: 20,
    search: searchValue || undefined,
  });

  const { items, pagination } = result;

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

    if (searchValue) {
      query.set("search", searchValue);
    }

    return `/admin/newsletters/list?${query.toString()}`;
  };

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Newsletters" }]}
      />

      <Card>
        <CardContent className="p-0">
          <NewsletterListFilters
            initialSearch={searchValue}
            title="Newsletter Subscribers"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-270 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Subscribed At</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-600">#{item.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteNewsletterButton id={item.id} />
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-8 text-center text-slate-500"
                      colSpan={4}
                    >
                      No subscribers found.
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
        </CardContent>
      </Card>
    </div>
  );
}
