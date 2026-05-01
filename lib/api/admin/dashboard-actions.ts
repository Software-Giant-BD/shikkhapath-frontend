"use server";

import { fetchApi, rethrowNextErrors } from "../common";

export type KpiCard = {
  label: string;
  value: number;
  deltaLabel: string;
  delta: number;
  icon: string;
};

export type StatusSummary = {
  label: string;
  count: number;
  colorClass: string;
};

export type ActivityItem = {
  id: number;
  name: string;
  meta: string;
  status: string;
  createdAt: string;
};

export type DashboardStats = {
  kpis: KpiCard[];
  ambulanceStatus: StatusSummary[];
  doctorStatus: StatusSummary[];
  candidateStatus: StatusSummary[];
  newsStatus: StatusSummary[];
  policeStatus: StatusSummary[];
  fireStationStatus: StatusSummary[];
  jobPostStatus: StatusSummary[];
  admissionStatus: StatusSummary[];
  advertisementStatus: StatusSummary[];
  recentServices: ActivityItem[];
  recentApplications: ActivityItem[];
};

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetchApi("/admin/dashboard-stats", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.resources || null;
  } catch (error) {
    rethrowNextErrors(error);
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}
