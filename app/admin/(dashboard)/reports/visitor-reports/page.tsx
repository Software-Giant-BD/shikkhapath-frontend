"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import {
  getVisitorReportAction,
  type PeriodType,
  type VisitorReportData,
} from "@/lib/api/admin/visitor-report-actions";

export default function VisitorReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<VisitorReportData | null>(null);
  const [categories, setCategories] = useState<{ id: number; title: string; slug: string }[]>([]);
  const [period, setPeriod] = useState<PeriodType>("7days");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = (
    currentPeriod = period,
    currentCat = categoryId,
    currentPage = page,
    currentStart = startDate,
    currentEnd = endDate
  ) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const res = await getVisitorReportAction({
          period: currentPeriod,
          categoryId: currentCat,
          page: currentPage,
          startDate: currentPeriod === "custom" ? currentStart : undefined,
          endDate: currentPeriod === "custom" ? currentEnd : undefined,
          perPage: 10,
        });

        if (res?.report) {
          setData(res.report);
          if (res.categories) {
            setCategories(res.categories);
          }
        } else {
          toast.error("রিপোর্ট লোড করা সম্ভব হয়নি।");
        }
      } catch (err) {
        console.error(err);
        toast.error("সার্ভার এরর হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData(period, categoryId, page, startDate, endDate);
  }, [period, categoryId, page]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setPage(1);
  };

  const handleCustomDateApply = () => {
    if (!startDate || !endDate) {
      toast.error("শুরুর এবং শেষের তারিখ দুটিই নির্বাচন করুন।");
      return;
    }
    setPeriod("custom");
    setPage(1);
    loadData("custom", categoryId, 1, startDate, endDate);
  };

  const kpis = data?.kpis;
  const chartData = data?.chart_data || [];
  const topNews = data?.top_news?.data || [];
  const pagination = data?.top_news;
  const deviceBreakdown = data?.device_breakdown || [];
  const trafficSources = data?.traffic_sources || [];
  const categoryBreakdown = data?.category_breakdown || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <PageHeader
        title="ভিজিটর ও পঠিত সংবাদ রিপোর্ট"
        breadcrumbs={[
          { label: "ড্যাশবোর্ড", href: "/admin" },
          { label: "রিপোর্টস", href: "/admin/reports/visitor-reports" },
          { label: "ভিজিটর ও নিউজ অ্যানালিটিক্স" },
        ]}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(period, categoryId, page, startDate, endDate)}
            disabled={isLoading || isPending}
            className="flex items-center gap-2 border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            রিফ্রেশ
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Period Quick Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: "today", label: "আজ" },
                { key: "yesterday", label: "গতকাল" },
                { key: "7days", label: "গত ৭ দিন" },
                { key: "30days", label: "গত ৩০ দিন" },
                { key: "this_month", label: "চলতি মাস" },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePeriodChange(p.key as PeriodType)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    period === p.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Filters: Category & Custom Range */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">বিভাগ:</span>
                <select
                  value={categoryId}
                  onChange={handleCategoryChange}
                  className="text-xs sm:text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">সব বিভাগ</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Pickers */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs border-0 bg-transparent text-slate-800 focus:ring-0 p-0"
                />
                <span className="text-xs text-slate-400">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs border-0 bg-transparent text-slate-800 focus:ring-0 p-0"
                />
                <button
                  type="button"
                  onClick={handleCustomDateApply}
                  className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium shadow-2xs"
                >
                  ফিল্টার
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <Card className="border border-slate-200/80 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                মোট সংবাদ ভিউ
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {kpis ? kpis.total_views.toLocaleString("bn-BD") : "—"}
              </span>
              {kpis && kpis.views_growth !== 0 && (
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    kpis.views_growth >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {kpis.views_growth >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {Math.abs(kpis.views_growth)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">পূর্ববর্তী মেয়াদের তুলনায়</p>
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card className="border border-slate-200/80 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                ইউনিক পাঠক
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {kpis ? kpis.unique_visitors.toLocaleString("bn-BD") : "—"}
              </span>
              {kpis && kpis.visitors_growth !== 0 && (
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    kpis.visitors_growth >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {kpis.visitors_growth >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {Math.abs(kpis.visitors_growth)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">অনন্য ভিজিটর উপস্থিতি</p>
          </CardContent>
        </Card>

        {/* Average Read Time */}
        <Card className="border border-slate-200/80 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                গড় পড়ার সময়
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {kpis ? kpis.avg_read_time_human : "—"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">প্রতি পাঠক সংবাদের গড় সক্রিয় সময়</p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border border-slate-200/80 bg-white shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                পড়ার পূর্ণতা (Engagement)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {kpis ? `${kpis.completion_rate}%` : "—"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {kpis ? `${kpis.completed_reads.toLocaleString("bn-BD")} টি সম্পন্ন পাঠ` : "৬৫%+ অংশ পঠিত"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              ভিউ ও ভিজিটর ট্রেন্ড
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              নির্বাচিত মেয়াদের সময়ানুক্রমিক পাঠক এনগেজমেন্ট
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-slate-600">মোট ভিউ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
              <span className="text-slate-600">ইউনিক ভিজিটর</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-72 w-full">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="মোট ভিউ"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#viewsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="ইউনিক ভিজিটর"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#visitorsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                {isLoading ? "ডাটা লোড হচ্ছে..." : "কোনো ভিউ রেকর্ড পাওয়া যায়নি"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Breakdowns Row: Device & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              ডিভাইস বণ্টন
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {deviceBreakdown.length > 0 ? (
              <div className="flex flex-col gap-4">
                {deviceBreakdown.map((item, idx) => {
                  const getIcon = () => {
                    const dev = item.device.toLowerCase();
                    if (dev.includes("mobile")) return <Smartphone className="w-4 h-4 text-emerald-600" />;
                    if (dev.includes("tablet")) return <Tablet className="w-4 h-4 text-amber-600" />;
                    return <Monitor className="w-4 h-4 text-indigo-600" />;
                  };

                  return (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2 text-slate-700">
                          {getIcon()}
                          <span>{item.device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{item.count.toLocaleString("bn-BD")} ভিউ</span>
                          <span className="font-bold text-slate-800">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">ডিভাইস তথ্য নেই</p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              ট্রাফিক উৎস (Sources)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {trafficSources.length > 0 ? (
              <div className="flex flex-col gap-4">
                {trafficSources.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 font-medium truncate max-w-[200px]">
                        {item.source}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{item.count.toLocaleString("bn-BD")} ভিউ</span>
                        <span className="font-bold text-slate-800">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">উৎস তথ্য নেই</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Read News Table */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              সর্বোচ্চ পঠিত সংবাদের তালিকা (Top Read News)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              নির্বাচিত সময়ে পাঠকদের সবচেয়ে বেশি পঠিত খবর ও সক্রিয়তা
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                  <th className="py-3 px-4">সংবাদ শিরোনাম</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4 text-right">মেয়াদের ভিউ</th>
                  <th className="py-3 px-4 text-right">ইউনিক পাঠক</th>
                  <th className="py-3 px-4 text-right">গড় সময়</th>
                  <th className="py-3 px-4 text-right">পূর্ণতা %</th>
                  <th className="py-3 px-4 text-right">সর্বমোট ভিউ</th>
                  <th className="py-3 px-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      লোড হচ্ছে...
                    </td>
                  </tr>
                ) : topNews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      কোনো পঠিত সংবাদ পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  topNews.map((news) => (
                    <tr key={news.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm">
                        <span className="line-clamp-2">{news.title}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          {news.category_title || "সাধারণ"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-indigo-600">
                        {news.period_views.toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                        {news.unique_readers.toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {news.avg_read_time ? `${news.avg_read_time}s` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {news.completion_pct !== null ? `${news.completion_pct}%` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 text-xs">
                        {news.lifetime_views.toLocaleString("bn-BD")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/news/${news.id}/edit`}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                মোট {pagination.total.toLocaleString("bn-BD")} টির মধ্যে পৃষ্ঠা{" "}
                {pagination.current_page.toLocaleString("bn-BD")} /{" "}
                {pagination.last_page.toLocaleString("bn-BD")}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="h-8 px-2.5"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  আগে
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.last_page || isLoading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="h-8 px-2.5"
                >
                  পরে
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Views Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900">
              বিভাগভিত্তিক পাঠকপ্রিয়তা (Category Performance)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryBreakdown.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700 truncate">{cat.title}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-bold text-slate-900">
                      {cat.views.toLocaleString("bn-BD")}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
