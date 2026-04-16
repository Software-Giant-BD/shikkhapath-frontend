"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import type { JobApiModel, GetJobsParams } from "@/lib/api/jobs";
import { fetchJobsAction } from "@/lib/api/jobs-actions";
import { JobCard } from "./job-card";

export function JobsPageClient() {
  const [jobs, setJobs] = useState<JobApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    job_type: "",
    location: "",
  });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params: GetJobsParams = { status: "active" };
      if (filters.category) params.category = filters.category;
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.location) params.location = filters.location;
      
      const res = await fetchJobsAction(params);
      setJobs(res.items);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black md:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
          Browse Latest <span className="text-[#b38716]">Jobs</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Find your dream job from our daily updated list of government, private, NGO, and freelance opportunities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sticky top-24">
          <h2 className="mb-5 text-lg font-bold flex items-center gap-2">
            <Search className="h-5 w-5 text-[#b38716]" />
            Filter Jobs
          </h2>

          <div className="space-y-5 flex flex-col gap-1">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716]"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Govt">Government</option>
                <option value="Private">Private</option>
                <option value="NGO">NGO</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Job Type</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716]"
                value={filters.job_type}
                onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Remote"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716]"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            
            <button
              onClick={() => setFilters({ category: "", job_type: "", location: "" })}
              className="mt-2 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Jobs Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#b38716]" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
              <Search className="mb-3 h-10 w-10 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700">No jobs found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
