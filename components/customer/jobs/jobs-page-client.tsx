"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, UploadCloud, Users, Briefcase, FileText, FileUp, X, CheckCircle2 } from "lucide-react";
import type { JobApiModel, GetJobsParams } from "@/lib/api/jobs";
import { fetchJobsAction } from "@/lib/api/jobs-actions";
import { JobCard } from "./job-card";
import { CandidateCard, type Candidate } from "./candidate-card";
import { ServiceAdBanner } from "../common/service-ad-banner";

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Rahim Uddin",
    profession: "Senior Software Engineer",
    experience: "5+ Years",
    education: "BSc in Computer Science, BUET",
    location: "Dhaka, Bangladesh",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
  },
  {
    id: "2",
    name: "Sadia Rahman",
    profession: "UX/UI Designer",
    experience: "3 Years",
    education: "BFA, Dhaka University",
    location: "Chattogram, Bangladesh",
    skills: ["Figma", "Illustrator", "Prototyping", "User Research"],
  },
  {
    id: "3",
    name: "Kamrul Hasan",
    profession: "Digital Marketing Analyst",
    experience: "4 Years",
    education: "BBA in Marketing, NSU",
    location: "Remote",
    skills: ["SEO", "Google Ads", "Facebook Ads", "Analytics"],
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    profession: "Frontend Developer",
    experience: "2 Years",
    education: "BSc in CSE, BRAC University",
    location: "Sylhet, Bangladesh",
    skills: ["Vue.js", "TailwindCSS", "JavaScript", "HTML/CSS"],
  }
];

export function JobsPageClient() {
  const [activeTab, setActiveTab] = useState<"jobs" | "candidates">("jobs");
  
  const [jobs, setJobs] = useState<JobApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    job_type: "",
    location: "",
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

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
    if (activeTab === "jobs") {
      loadJobs();
    }
  }, [filters, activeTab]);

  const handleUploadCV = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadSuccess(true);
    setTimeout(() => {
      setIsUploadSuccess(false);
      setIsUploadModalOpen(false);
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-black md:text-5xl text-slate-900 tracking-tight mb-4">
          Shikkhapath <span className="text-[#b38716] tracking-tighter">Careers Hub</span>
        </h1>
        <p className="text-slate-500 font-medium md:text-lg">
          Whether you are looking for your dream job, or searching for top talent to join your team - you are in the right place.
        </p>
      </div>

      <div className="mb-8 max-w-4xl mx-auto">
        <ServiceAdBanner label="[ Career Platform Sponsor ]" />
      </div>

      {/* Tabs */}
      <div className="flex flex-col items-center mb-10">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === "jobs"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === "candidates"
                ? "bg-[#b38716] text-white shadow-md shadow-[#b38716]/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4" />
            Hire Talent
          </button>
        </div>
      </div>

      {activeTab === "jobs" && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sticky top-24">
            <h2 className="mb-5 text-lg font-bold flex items-center gap-2 text-slate-800">
              <Search className="h-5 w-5 text-[#b38716]" />
              Filter Jobs
            </h2>
            <div className="space-y-5 flex flex-col gap-1">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716] transition-all"
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Type</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716] transition-all"
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Remote"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:outline-none focus:ring-1 focus:ring-[#b38716] transition-all"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              
              <button
                onClick={() => setFilters({ category: "", job_type: "", location: "" })}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          </aside>

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
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center px-4">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800">No jobs found</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm">We couldn't find any jobs matching your current filters. Try adjusting them or check back later.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "candidates" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
            <div className="space-y-1.5 flex-1text-center sm:text-left">
              <h2 className="text-2xl font-black flex items-center justify-center sm:justify-start gap-2">
                <FileText className="h-6 w-6 text-[#b38716]" />
                Job Seekers Directory
              </h2>
              <p className="text-slate-300 font-medium text-sm sm:text-base max-w-md">Browse through profiles of talented professionals actively looking for their next big opportunity.</p>
            </div>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap bg-[#b38716] hover:bg-[#9a7310] text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-[#b38716]/30 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <UploadCloud className="h-5 w-5" />
              Upload Your CV
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_CANDIDATES.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      )}

      {/* Upload CV Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-auto">
            <button 
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isUploadSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800">CV Uploaded!</h3>
                  <p className="text-slate-500 font-medium">Your profile is now visible to potential employers.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 border-b border-slate-100 p-6 pt-7 text-center">
                  <div className="mx-auto w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-3 text-[#b38716]">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Submit Your CV</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">Get noticed by top companies</p>
                </div>
                <form onSubmit={handleUploadCV} className="p-6 space-y-4.5 bg-white">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <input required type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:bg-white focus:ring-1 focus:ring-[#b38716] outline-none transition-all placeholder:text-slate-400" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Profession / Expected Role</label>
                      <input required type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:bg-white focus:ring-1 focus:ring-[#b38716] outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Software Engineer" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Experience</label>
                        <select required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:bg-white focus:ring-1 focus:ring-[#b38716] outline-none transition-all text-slate-700">
                          <option value="">Select...</option>
                          <option value="fresher">Fresher</option>
                          <option value="1-3">1-3 Years</option>
                          <option value="3-5">3-5 Years</option>
                          <option value="5+">5+ Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Location</label>
                        <input required type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-[#b38716] focus:bg-white focus:ring-1 focus:ring-[#b38716] outline-none transition-all placeholder:text-slate-400" placeholder="City/Area" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Upload CV (PDF)</label>
                      <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-6 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                        <div className="text-center">
                          <UploadCloud className="mx-auto h-8 w-8 text-slate-400 group-hover:text-[#b38716] transition-colors" aria-hidden="true" />
                          <div className="mt-2 text-sm text-slate-600 font-medium">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-bold text-[#b38716] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#b38716] focus-within:ring-offset-2 hover:text-[#9a7310]">
                              <span>Click to upload</span>
                              <input id="file-upload" name="file-upload" type="file" required accept=".pdf" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-slate-500 mt-1">PDF up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#b38716] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#b38716]/20 transition-all hover:bg-[#9a7310] hover:scale-[1.02] active:scale-98">
                      <FileUp className="h-4 w-4" />
                      Submit Profile
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
