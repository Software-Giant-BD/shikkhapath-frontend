import Link from "next/link";
import {
  Briefcase,
  UserRound,
  ShieldCheck,
  Wrench,
  Siren,
  Flame,
  Newspaper,
  Megaphone,
  School,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";

import { getDashboardStats } from "@/lib/api/admin/dashboard-actions";
import type {
  ActivityItem,
  StatusSummary,
} from "@/lib/api/admin/dashboard-actions";

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  "user-round": UserRound,
  "shield-check": ShieldCheck,
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusBadge(status: string) {
  const normalized = status.trim().toLowerCase();

  if (
    [
      "resolved",
      "shortlisted",
      "hired",
      "published",
      "active",
      "approved",
    ].includes(normalized)
  ) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (
    ["new", "reviewing", "processing", "pending", "scheduled"].includes(
      normalized,
    )
  ) {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }

  if (
    ["rejected", "blocked", "failed", "expired", "inactive"].includes(
      normalized,
    )
  ) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function Trend({ value, label }: { value: number; label: string }) {
  if (value === 0) {
    return <span className="text-xs font-medium text-slate-400">{label}</span>;
  }

  const positive = value > 0;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span
        className={
          positive
            ? "flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full"
            : "flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full"
        }
      >
        {positive ? (
          <ArrowUpRight className="h-3 w-3 mr-0.5" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-0.5" />
        )}
        {Math.abs(value)}%
      </span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

function StatusCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: StatusSummary[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-slate-700">
          {title}
        </CardTitle>
        <div className="bg-slate-100 text-slate-600 p-1.5 rounded-md">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-2xl font-extrabold text-slate-800 mb-4">
          {formatNumber(total)}
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const percentage =
              total === 0 ? 0 : Math.round((item.count / total) * 100);
            return (
              <div key={item.label} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="capitalize text-slate-500 group-hover:text-slate-700 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-slate-700">
                    {formatNumber(item.count)}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.colorClass} opacity-85 group-hover:opacity-100 transition-opacity`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: ActivityItem[];
  icon: React.ElementType;
}) {
  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b border-slate-100 bg-slate-50/50">
        <Icon className="w-5 h-5 text-slate-500 mr-2" />
        <CardTitle className="text-base font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
            <Activity className="w-8 h-8 text-slate-200" />
            No recent activity found.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-700 text-sm line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {item.meta}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="w-full p-10 flex flex-col items-center justify-center text-slate-500 gap-4 min-h-[400px]">
        <Activity className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">
          Failed to load dashboard statistics.
        </p>
        <Link href="/admin">
          <Button variant="secondary">Retry</Button>
        </Link>
      </div>
    );
  }

  const kpis = (stats.kpis || []).map((kpi) => ({
    ...kpi,
    icon: iconMap[kpi.icon] || Activity,
  }));

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
      <PageHeader
        title="Dashboard Overview"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/news/add">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                New Publication
              </Button>
            </Link>
          </div>
        }
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="border-transparent shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_4px_15px_-3px_rgba(6,81,237,0.15)] transition-all bg-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Icon className="w-24 h-24 text-indigo-600" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <div className="rounded-xl bg-indigo-50/80 p-2.5 text-indigo-600 ring-1 ring-indigo-100">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {formatNumber(item.value)}
                </p>
                {item.delta && (
                  <div className="mt-3">
                    <Trend value={item.delta} label={item.deltaLabel} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 pb-2 border-b border-slate-200/60">
        <h2 className="text-lg font-bold text-slate-800">
          System Status & Services
        </h2>
      </div>

      {/* Status Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <StatusCard
          title="Ambulance Services"
          icon={Siren}
          items={stats.ambulanceStatus || []}
        />
        <StatusCard
          title="Doctor Applications"
          icon={Stethoscope}
          items={stats.doctorStatus || []}
        />
        <StatusCard
          title="Job Candidates"
          icon={UserRound}
          items={stats.candidateStatus || []}
        />
        <StatusCard
          title="Job Posts"
          icon={Briefcase}
          items={stats.jobPostStatus || []}
        />
        <StatusCard
          title="News Content"
          icon={Newspaper}
          items={stats.newsStatus || []}
        />
        <StatusCard
          title="Police Stations"
          icon={ShieldCheck}
          items={stats.policeStatus || []}
        />
        <StatusCard
          title="Fire Stations"
          icon={Flame}
          items={stats.fireStationStatus || []}
        />
        <StatusCard
          title="Admissions"
          icon={School}
          items={stats.admissionStatus || []}
        />
        <StatusCard
          title="Advertisements"
          icon={Megaphone}
          items={stats.advertisementStatus || []}
        />
      </div>

      <div className="flex items-center justify-between pt-6 pb-2 border-b border-slate-200/60">
        <h2 className="text-lg font-bold text-slate-800">
          Recent Activity Flow
        </h2>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityList
          title="Recent Service Requests"
          icon={Activity}
          items={stats.recentServices || []}
        />
        <ActivityList
          title="Recent Applications"
          icon={FileText}
          items={stats.recentApplications || []}
        />
      </div>
    </div>
  );
}
