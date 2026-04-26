"use client";

import Link from "next/link";
import { Building2, MapPin, Clock, Timer, Banknote, ExternalLink, ChevronLeft } from "lucide-react";
import type { JobApiModel } from "@/lib/api/jobs";

interface JobDetailsProps {
  job: JobApiModel;
}

export function JobDetails({ job }: JobDetailsProps) {
  const handleApply = () => {
    if (job.apply_link) {
      window.open(job.apply_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#b38716] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                {job.category}
              </span>
              <span className="rounded-lg bg-[#b38716]/10 px-3 py-1.5 text-xs font-bold text-[#b38716] uppercase tracking-wider">
                {job.job_type}
              </span>
            </div>

            <h1 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl lg:text-4xl leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <Building2 className="h-5 w-5 text-slate-400" />
                {job.company_name}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                {job.location}
              </div>
            </div>

            <hr className="my-8 border-slate-100" />

            <div className="prose prose-slate max-w-none prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed">
              <h3 className="not-prose text-xl font-bold text-slate-900 mb-4">Job Description</h3>
              <div
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Job Overview</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Timer className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</p>
                  <p className="font-medium text-red-600">{job.deadline}</p>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-start gap-3">
                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary</p>
                    <p className="font-medium text-amber-700">{job.salary}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posted On</p>
                  <p className="font-medium text-slate-700">
                    {job.publish_at || job.created_at?.split("T")[0] || "Recently"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-base font-black text-white hover:bg-[#b38716] transition-all active:scale-95 shadow-md shadow-[#b38716]/20"
            >
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
