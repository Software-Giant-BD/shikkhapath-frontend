import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import Link from "next/link";
import { getContactMessages } from "@/lib/api/contact-messages";
import { StatusUpdateControl } from "@/components/admin/contact-messages/status-update-control";

const DEFAULT_PER_PAGE = 10;
const DEFAULT_STATUS_OPTIONS = ["processing", "processed", "resolved", "new"];

type ContactMessagesPageProps = {
  searchParams?: Promise<{
    page?: string;
    per_page?: string;
  }>;
};

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildPageHref(page: number, perPage: number) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  return `/admin/contact-messages?${query.toString()}`;
}

function getVisiblePages(currentPage: number, lastPage: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default async function ContactMessagesPage({ searchParams }: ContactMessagesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page ?? 1) || 1);
  const perPage = Math.max(
    1,
    Number(resolvedSearchParams?.per_page ?? DEFAULT_PER_PAGE) || DEFAULT_PER_PAGE,
  );

  let messages = [];
  let pagination = {
    currentPage,
    lastPage: 1,
    perPage,
    total: 0,
  };
  let loadError: string | null = null;

  try {
    const response = await getContactMessages(currentPage, perPage);
    messages = response.messages;
    pagination = response.pagination;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load contact messages.";
  }

  const visiblePages = getVisiblePages(pagination.currentPage, pagination.lastPage);
  const startItem = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = pagination.total === 0
    ? 0
    : Math.min(pagination.total, pagination.currentPage * pagination.perPage);

  const statusOptions = Array.from(
    new Set([
      ...DEFAULT_STATUS_OPTIONS,
      ...messages.map((message: { status: string }) => String(message.status || "")).filter(Boolean),
    ]),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Contact Messages"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Messages" }]}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Incoming Contact Requests</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loadError && (
            <div className="border-b border-red-100 bg-red-50 px-6 py-4 text-sm text-red-600">
              {loadError}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-280 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="rounded-tl-lg px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Message</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="rounded-tr-lg px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {messages.map((message: any) => (
                  <tr
                    key={message.id}
                    className="align-top transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 text-slate-500">#{message.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{message.name || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{message.email || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{message.phone || "-"}</td>
                    <td className="max-w-65 px-6 py-4 text-slate-700">
                      <p className="line-clamp-2">{message.subject || "-"}</p>
                    </td>
                    <td className="max-w-95 px-6 py-4 text-slate-600">
                      <p className="line-clamp-3 whitespace-pre-wrap">{message.message || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(message.createdAt)}</td>
                    <td className="px-6 py-4">
                      <StatusUpdateControl
                        contactMessageId={message.id}
                        initialStatus={message.status || "pending"}
                        options={statusOptions}
                      />
                    </td>
                  </tr>
                ))}
                {!messages.length && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      {loadError ? "Could not load contact messages." : "No contact messages found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing {startItem}-{endItem} of {pagination.total} messages
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={buildPageHref(Math.max(1, pagination.currentPage - 1), pagination.perPage)}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.currentPage <= 1}
                >
                  Previous
                </Button>
              </Link>
              {visiblePages.map((page) => (
                <Link key={page} href={buildPageHref(page, pagination.perPage)}>
                  <Button
                    variant={page === pagination.currentPage ? "primary" : "secondary"}
                    size="sm"
                  >
                    {page}
                  </Button>
                </Link>
              ))}
              <Link
                href={buildPageHref(
                  Math.min(pagination.lastPage, pagination.currentPage + 1),
                  pagination.perPage,
                )}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.lastPage}
                >
                  Next
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
