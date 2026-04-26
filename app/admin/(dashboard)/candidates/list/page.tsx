import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { getCandidatesList } from "@/lib/api/jobs";
import { CandidateTable } from "./candidate-table";

type SearchParams = Promise<{ page?: string }>;

export default async function CandidateListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const { items: candidates, pagination } = await getCandidatesList(
    { page: current_page, per_page: 20 },
    true, // isAdmin = true
  );

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
  const getPageHref = (pageNumber: number) =>
    `/admin/candidates/list?page=${pageNumber}`;

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Jobs", href: "/admin/jobs/list" },
          { label: "Candidates" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Candidate List
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage and moderate job seekers profiles
              </p>
            </div>
          </div>

          <CandidateTable candidates={candidates as any} />

          {pagination.last_page > 1 && (
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
                  aria-disabled={
                    pagination.current_page >= pagination.last_page
                  }
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
