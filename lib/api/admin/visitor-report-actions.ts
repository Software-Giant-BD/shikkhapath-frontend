"use server";

import { fetchApi } from "../common";

export type PeriodType = "today" | "yesterday" | "7days" | "30days" | "this_month" | "custom";

export type VisitorKpis = {
  total_views: number;
  views_growth: number;
  unique_visitors: number;
  visitors_growth: number;
  avg_read_time_seconds: number;
  avg_read_time_human: string;
  completion_rate: number;
  completed_reads: number;
};

export type TimeseriesPoint = {
  label: string;
  full_date: string;
  views: number;
  visitors: number;
};

export type DeviceBreakdownItem = {
  device: string;
  count: number;
  percentage: number;
};

export type TrafficSourceItem = {
  source: string;
  count: number;
  percentage: number;
};

export type TopNewsItem = {
  id: number;
  title: string;
  unique_code: string;
  slug: string;
  category_id: number;
  category_title: string | null;
  period_views: number;
  unique_readers: number;
  avg_read_time: number | null;
  completion_pct: number | null;
  lifetime_views: number;
  publish_at: string | null;
};

export type CategoryBreakdownItem = {
  id: number;
  title: string;
  views: number;
  percentage: number;
};

export type VisitorReportData = {
  period: {
    label: string;
    start_date: string;
    end_date: string;
  };
  kpis: VisitorKpis;
  chart_data: TimeseriesPoint[];
  device_breakdown: DeviceBreakdownItem[];
  traffic_sources: TrafficSourceItem[];
  top_news: {
    data: TopNewsItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  category_breakdown: CategoryBreakdownItem[];
};

export type VisitorReportActionResponse = {
  report: VisitorReportData;
  categories: { id: number; title: string; slug: string }[];
};

export async function getVisitorReportAction(params: {
  period?: PeriodType;
  startDate?: string;
  endDate?: string;
  categoryId?: number | string;
  page?: number;
  perPage?: number;
}): Promise<VisitorReportActionResponse | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params.period) searchParams.set("period", params.period);
    if (params.startDate) searchParams.set("start_date", params.startDate);
    if (params.endDate) searchParams.set("end_date", params.endDate);
    if (params.categoryId && params.categoryId !== "all") {
      searchParams.set("category_id", String(params.categoryId));
    }
    if (params.page) searchParams.set("page", String(params.page));
    if (params.perPage) searchParams.set("per_page", String(params.perPage));

    const res = await fetchApi(`/admin/visitor-reports/summary?${searchParams.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[getVisitorReportAction] Failed:", payload);
      return null;
    }

    return payload?.resources || payload?.data || payload;
  } catch (error) {
    console.error("[getVisitorReportAction] Error:", error);
    return null;
  }
}
