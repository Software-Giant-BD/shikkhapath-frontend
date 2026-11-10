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
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquareText,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import {
  getFacebookShareLogsAction,
  retryFacebookShareAction,
  retryAllFailedFacebookSharesAction,
  type FacebookShareLogItem,
} from "@/lib/api/admin/auto-news-actions";

type StatusFilter = "all" | "pending" | "posted" | "failed";

function getPostTone(status: string) {
  switch (status) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "failed":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

function labelForStatus(status: string | null | undefined) {
  switch (status) {
    case "success":
      return "Success";
    case "failed":
      return "Failed";
    case "pending":
      return "Pending";
    case "not_required":
      return "Not Required";
    default:
      return "Unknown";
  }
}

export default function FacebookShareReportPage() {
  const [logs, setLogs] = useState<FacebookShareLogItem[]>([]);
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
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [isRetryingAll, setIsRetryingAll] = useState(false);

  async function fetchLogs(targetPage = page, targetStatus = statusFilter) {
    setIsLoading(true);
    const res = await getFacebookShareLogsAction(targetPage, perPage, targetStatus);
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

  const handleRetrySingle = async (shareId: number) => {
    setRetryingId(shareId);
    try {
      const res = await retryFacebookShareAction(shareId);
      if (res.success) {
        toast.success(res.message);
        if (res.item) {
          setLogs((prev) => prev.map((item) => (item.id === shareId ? res.item! : item)));
        } else {
          fetchLogs();
        }
      } else {
        toast.error(res.message);
        fetchLogs();
      }
    } catch {
      toast.error("পুনরায় চেষ্টা করতে সমস্যা হয়েছে");
    } finally {
      setRetryingId(null);
    }
  };

  const handleRetryAll = async () => {
    if (!window.confirm("আপনি কি সকল ব্যর্থ ফেসবুক পোস্ট পুনরায় কিউতে পাঠাতে চান?")) {
      return;
    }
    setIsRetryingAll(true);
    try {
      const res = await retryAllFailedFacebookSharesAction();
      if (res.success) {
        toast.success(res.message);
        fetchLogs();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("সার্ভার সংযোগে সমস্যা হয়েছে");
    } finally {
      setIsRetryingAll(false);
    }
  };

  const canRetry = (log: FacebookShareLogItem) => {
    if (!log.news) return false;
    if (log.status === "failed" || log.post_status === "failed") return true;
    if (log.status === "posted" && !log.external_comment_id && log.comment_status !== "not_required") return true;
    return false;
  };

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-5 lg:px-6">
      <PageHeader
        title="Facebook Share Report"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Reports" },
          { label: "Facebook Share" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRetryAll}
              variant="outline"
              size="sm"
              disabled={isRetryingAll || isLoading || isPending}
              className="text-xs h-8 gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetryingAll ? "animate-spin" : ""}`} />
              {isRetryingAll ? "Retrying All..." : "Retry All Failed"}
            </Button>
            <Button
              onClick={() => fetchLogs()}
              variant="outline"
              size="sm"
              disabled={isLoading || isPending || isRetryingAll}
              className="text-xs h-8 gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {([
            { id: "all", label: "All" },
            { id: "posted", label: "Posted" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
          ] as const).map((tab) => (
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

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">Created</th>
                  <th className="p-3.5 min-w-[220px]">News</th>
                  <th className="p-3.5 whitespace-nowrap">Post</th>
                  <th className="p-3.5 whitespace-nowrap">Comment</th>
                  <th className="p-3.5 whitespace-nowrap">Status</th>
                  <th className="p-3.5 min-w-[200px]">Reason / Error</th>
                  <th className="p-3.5 text-center whitespace-nowrap">Link</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                      Loading Facebook share report...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No share log found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        {log.created_at ? new Date(log.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "—"}
                      </td>

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
                          <span className="text-slate-400 italic">News deleted</span>
                        )}
                        {log.news?.unique_code ? (
                          <div className="text-[11px] text-slate-500 mt-1">{log.news.unique_code}</div>
                        ) : null}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${getPostTone(log.post_status)}`}>
                          {log.post_status === "success" ? <CheckCircle2 className="w-3 h-3" /> : log.post_status === "failed" ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {labelForStatus(log.post_status)}
                        </span>
                        {log.external_post_id ? (
                          <div className="mt-1 text-[11px] text-slate-500 font-mono break-all">{log.external_post_id}</div>
                        ) : null}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${getPostTone(log.comment_status)}`}>
                          {log.comment_status === "success" ? <CheckCircle2 className="w-3 h-3" /> : log.comment_status === "failed" ? <XCircle className="w-3 h-3" /> : log.comment_status === "pending" ? <MessageSquareText className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {labelForStatus(log.comment_status)}
                        </span>
                        {log.external_comment_id ? (
                          <div className="mt-1 text-[11px] text-slate-500 font-mono break-all">{log.external_comment_id}</div>
                        ) : null}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          log.status === "posted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : log.status === "failed"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {log.status === "posted" ? <CheckCircle2 className="w-3 h-3" /> : log.status === "failed" ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {log.status === "posted" ? "Posted" : log.status === "failed" ? "Failed" : "Pending"}
                        </span>
                      </td>

                      <td className="p-3.5 text-[11px] text-slate-600">
                        {log.error_message ? (
                          <span className="block text-rose-600 font-medium line-clamp-3" title={log.error_message}>
                            {log.error_message}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">No error. Share was processed successfully.</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap">
                        {log.external_post_id ? (
                          <a
                            href={`https://facebook.com/${log.external_post_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-100"
                            title="Open post on Facebook"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">N/A</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        {canRetry(log) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetrySingle(log.id)}
                            disabled={retryingId === log.id || isRetryingAll}
                            className="h-7 px-2.5 text-[11px] font-semibold gap-1 text-slate-700 hover:text-indigo-600 hover:border-indigo-200"
                            title={log.status === "failed" ? "Retry sharing post to Facebook" : "Retry adding Facebook comment"}
                          >
                            <RotateCcw className={`w-3 h-3 ${retryingId === log.id ? "animate-spin text-indigo-600" : ""}`} />
                            {retryingId === log.id ? "Retrying..." : "Retry"}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-300 select-none">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-slate-200 bg-slate-50/70 text-xs text-slate-600">
              <div>
                Showing <span className="font-semibold text-slate-900">{Math.min(pagination.total, (page - 1) * perPage + 1)}</span> to <span className="font-semibold text-slate-900">{Math.min(pagination.total, page * perPage)}</span> of <span className="font-semibold text-slate-900">{pagination.total}</span> records
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
