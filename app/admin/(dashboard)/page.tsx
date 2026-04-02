import Link from "next/link";
import {
  Briefcase,
  FolderKanban,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";

type KpiCard = {
  label: string;
  value: number;
  deltaLabel: string;
  delta: number;
  icon: React.ElementType;
};

type StatusSummary = {
  label: string;
  count: number;
  colorClass: string;
};

type ActivityItem = {
  id: number;
  name: string;
  meta: string;
  status: string;
  createdAt: string;
};

const mockKpis: KpiCard[] = [
 
  {
    label: "Total Services",
    value: 18,
    deltaLabel: "vs last month",
    delta: 6,
    icon: Wrench,
  },
 
  {
    label: "Team Members",
    value: 11,
    deltaLabel: "active",
    delta: 0,
    icon: UserRound,
  },
  {
    label: "Published Content",
    value: 40,
    deltaLabel: "publish ratio",
    delta: 75,
    icon: ShieldCheck,
  },
];

const mockMessageStatus: StatusSummary[] = [
  { label: "new", count: 7, colorClass: "bg-sky-500" },
  { label: "processing", count: 5, colorClass: "bg-amber-500" },
  { label: "resolved", count: 12, colorClass: "bg-emerald-500" },
];

const mockCareerStatus: StatusSummary[] = [
  { label: "new", count: 6, colorClass: "bg-sky-500" },
  { label: "reviewing", count: 3, colorClass: "bg-indigo-500" },
  { label: "shortlisted", count: 2, colorClass: "bg-emerald-500" },
  { label: "rejected", count: 1, colorClass: "bg-rose-500" },
];

const mockRecentMessages: ActivityItem[] = [
  { id: 28, name: "Rahim Ahmed", meta: "Bridge renovation inquiry", status: "new", createdAt: "2026-03-30T10:22:00Z" },
  { id: 27, name: "Nusrat Jahan", meta: "Consultation request", status: "processing", createdAt: "2026-03-30T08:14:00Z" },
  { id: 26, name: "Abrar Hasan", meta: "Project quote", status: "resolved", createdAt: "2026-03-29T17:32:00Z" },
  { id: 25, name: "Maliha Noor", meta: "Permit support", status: "new", createdAt: "2026-03-29T14:05:00Z" },
];

const mockRecentApplications: ActivityItem[] = [
  { id: 19, name: "Siam Chowdhury", meta: "Assistant Team Leader", status: "reviewing", createdAt: "2026-03-30T09:03:00Z" },
  { id: 18, name: "Tahsin Kabir", meta: "Team Leader", status: "new", createdAt: "2026-03-30T07:40:00Z" },
  { id: 17, name: "Farzana Islam", meta: "Project Engineer", status: "shortlisted", createdAt: "2026-03-29T13:18:00Z" },
  { id: 16, name: "Rifat Karim", meta: "Intern", status: "rejected", createdAt: "2026-03-28T11:29:00Z" },
];

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

function getStatusClasses(status: string) {
  const normalized = status.trim().toLowerCase();

  if (["resolved", "shortlisted", "hired", "published"].includes(normalized)) {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (["new", "reviewing", "processing"].includes(normalized)) {
    return "border-sky-100 bg-sky-50 text-sky-700";
  }

  if (["rejected", "blocked", "failed"].includes(normalized)) {
    return "border-rose-100 bg-rose-50 text-rose-700";
  }

  return "border-slate-100 bg-slate-50 text-slate-700";
}

function Trend({ value, label }: { value: number; label: string }) {
  if (value === 0) {
    return <span className="text-xs text-slate-500">{label}</span>;
  }

  const positive = value > 0;

  return (
    <div className="flex items-center gap-1 text-xs">
      <span
        className={positive ? "flex items-center text-emerald-600" : "flex items-center text-rose-600"}
      >
        {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {Math.abs(value)}%
      </span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

function StatusBars({ items }: { items: StatusSummary[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);

        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="capitalize text-slate-700">{item.label}</span>
              <span className="text-slate-500">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${item.colorClass}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityList({
  title,
  viewHref,
  items,
}: {
  title: string;
  viewHref: string;
  items: ActivityItem[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href={viewHref} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {!items.length && <p className="text-sm text-slate-500">No data available.</p>}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-100 p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">{item.meta}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(item.status)}`}>
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(item.createdAt)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  // Replace mock constants with API data when endpoints are ready.
  const kpis = mockKpis;
  const messageStatus = mockMessageStatus;
  const careerStatus = mockCareerStatus;
  const recentMessages = mockRecentMessages;
  const recentApplications = mockRecentApplications;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Dashboard Overview"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        action={(
          <div className="flex items-center gap-2">
            <Link href="/admin/projects/add">
              <Button size="sm">Add Project</Button>
            </Link>
            <Link href="/admin/services/add">
              <Button size="sm" variant="secondary">Add Service</Button>
            </Link>
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatNumber(item.value)}</p>
                <div className="mt-2">
                  <Trend value={item.delta} label={item.deltaLabel} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
