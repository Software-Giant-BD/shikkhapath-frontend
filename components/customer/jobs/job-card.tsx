"use client";

import Link from "next/link";
import { Building2, MapPin, Clock, Timer, Banknote, ExternalLink } from "lucide-react";
import type { JobApiModel } from "@/lib/api/jobs";

interface JobCardProps {
  job: JobApiModel;
}

export function JobCard({ job }: JobCardProps) {
  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.apply_link) {
      window.open(job.apply_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-[#b38716]/30 hover:shadow-md h-full flex flex-col"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {job.category}
            </span>
            <span className="rounded-md bg-[#b38716]/10 px-2.5 py-1 text-[11px] font-bold text-[#b38716] uppercase tracking-wider">
              {job.job_type}
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-900 group-hover:text-[#b38716] transition-colors">
            {job.title}
          </h3>
        </div>
      </div>

      <div className="mb-6 space-y-2.5 text-[14px] text-slate-600 flex-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-medium truncate">{job.company_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="font-medium text-amber-700">{job.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 shrink-0 text-red-400" />
          <span className="text-red-600 font-medium whitespace-nowrap">
            Deadline: {job.deadline}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#b38716] group-hover:underline">
          View Details
        </span>

        <button
          onClick={handleApply}
          className="flex flex-none items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#b38716] active:scale-95"
        >
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}
