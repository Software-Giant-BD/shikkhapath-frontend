"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import {
  getAutoNewsLogsAction,
  type AutoNewsLogItem,
} from "@/lib/api/admin/auto-news-actions";

type StatusFilter = "all" | "success" | "skipped" | "failed";

export default function AutoNewsLogsReportPage() {
  const [logs, setLogs] = useState<AutoNewsLogItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState<{
    total: number;
    current_page: number;
    last_page: number;
  }>({
    total: 0,
    current_page: 1,
    last_page: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  async function fetchLogs(targetPage = page, targetStatus = statusFilter) {
    setIsLoading(true);
    const res = await getAutoNewsLogsAction(
      targetPage,
      perPage,
      targetStatus === "all" ? undefined : targetStatus
    );
    if (res.success) {
      setLogs(res.items);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    startTransition(() => {
      fetchLogs(page, statusFilter);
    });
  }, [page, statusFilter, perPage]);

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-5 lg:px-6">
      {/* Header */}
      <PageHeader
        title="Auto News Ingestion Logs & Report"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Reports" },
          { label: "Auto News Logs" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/settings/auto-news">
              <Button variant="outline" size="sm" className="text-xs h-8">
                Settings & Sources
              </Button>
            </Link>
            <Button
              onClick={() => fetchLogs()}
              variant="outline"
              size="sm"
              disabled={isLoading || isPending}
              className="text-xs h-8 gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Filter Tabs & Per Page Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {(
            [
              { id: "all", label: "All Logs" },
              { id: "success", label: "Published (সফল)" },
              { id: "skipped", label: "Skipped (স্কিপড/ফিল্টার্ড)" },
              { id: "failed", label: "Failed (ব্যর্থ)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">Per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Main Logs Table Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">Date & Time</th>
                  <th className="p-3.5 min-w-[220px]">Original Headline & Source</th>
                  <th className="p-3.5 min-w-[240px]">AI Processed Title</th>
                  <th className="p-3.5 whitespace-nowrap">Category</th>
                  <th className="p-3.5 whitespace-nowrap">Status</th>
                  <th className="p-3.5 min-w-[200px]">Reason / Message</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No logs found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isSuccess = log.status === "success";
                    const isSkipped = log.status === "skipped";
                    const isFailed = log.status === "failed";

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Timestamp */}
                        <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {new Date(log.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Original Title & Source */}
                        <td className="p-3.5">
                          <div className="font-medium text-slate-900 line-clamp-2" title={log.original_title}>
                            {log.original_title}
                          </div>
                          <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                            {log.news_source?.name || "External Portal"}
                          </span>
                        </td>

                        {/* Rewritten Title */}
                        <td className="p-3.5">
                          {log.news ? (
                            <Link
                              href={`/admin/news/${log.news.id}/edit`}
                              className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-2 transition-colors"
                              title={log.news.title}
                            >
                              {log.news.title}
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">Not created</span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-3.5 whitespace-nowrap">
                          {log.assigned_category ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {log.assigned_category.title}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isSkipped
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                            {isSkipped && <AlertTriangle className="w-3 h-3" />}
                            {isFailed && <XCircle className="w-3 h-3" />}
                            {isSuccess ? "Published" : isSkipped ? "Skipped" : "Failed"}
                          </span>
                        </td>

                        {/* Reason / Error Message */}
                        <td className="p-3.5 text-[11px] text-slate-600">
                          {log.error_message ? (
                            <span
                              className={`line-clamp-2 ${
                                isFailed ? "text-rose-600 font-medium" : "text-slate-600"
                              }`}
                              title={log.error_message}
                            >
                              {log.error_message}
                            </span>
                          ) : isSuccess ? (
                            <span className="text-emerald-600 font-medium">Successfully written & live</span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Original Link */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {log.original_url ? (
                            <a
                              href={log.original_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-100"
                              title="Open original portal source"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 bg-slate-50/70 text-xs text-slate-600">
              <div>
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(pagination.total, (page - 1) * perPage + 1)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(pagination.total, page * perPage)}
                </span>{" "}
                of <span className="font-semibold text-slate-900">{pagination.total}</span> total logs
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>

                <span className="px-2 text-xs font-semibold text-slate-700">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                  disabled={page >= pagination.last_page || isLoading}
                  className="h-8 px-2.5 text-xs gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
