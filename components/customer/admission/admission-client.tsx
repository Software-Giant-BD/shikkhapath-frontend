"use client";

import { useState, useEffect } from "react";
import { University, Search, CheckCircle2, XCircle, ChevronRight, CalendarDays, Loader2, Target, Award, MapPin } from "lucide-react";
import { fetchAdmissionsAction } from "@/lib/api/admission-actions";
import type { AdmissionUniversityModel } from "@/lib/api/admission";
import Link from "next/link";
import { ServiceAdBanner } from "../common/service-ad-banner";

interface FilterState {
  hasChecked: boolean;
  sscGpa: string;
  hscGpa: string;
  group: string;
}

export function AdmissionClient({ isAdmin = true }: { isAdmin?: boolean }) {
  const [universities, setUniversities] = useState<AdmissionUniversityModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    hasChecked: false,
    sscGpa: "",
    hscGpa: "",
    group: "Science"
  });

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true);
      try {
        const response = await fetchAdmissionsAction({ isAdmin });
        setUniversities(response.items);
      } catch (error) {
        console.error("Failed to load admissions", error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
  }, [isAdmin]);

  const handleEligibilityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, hasChecked: true }));
  };

  const getEligibilityStatus = (uni: AdmissionUniversityModel) => {
    if (!filters.hasChecked) return null; // Neutral
    
    const sscVal = parseFloat(filters.sscGpa);
    const hscVal = parseFloat(filters.hscGpa);
    const total = sscVal + hscVal;

    if (isNaN(sscVal) || isNaN(hscVal)) return false; // Invalid input means not eligible

    const validGroup = uni.allowed_groups.includes(filters.group);
    const validGrades = sscVal >= uni.req_ssc && hscVal >= uni.req_hsc && total >= uni.req_total;

    return validGroup && validGrades;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-indigo-100 p-4 mb-4">
          <University className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-black md:text-5xl text-slate-900 tracking-tight mb-4">
          Admission <span className="text-indigo-600">News</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Get the latest university circulars. Enter your HSC and SSC statistics to automatically discover which universities you are eligible to apply for.
        </p>
      </div>

      <div className="mb-8 max-w-4xl mx-auto">
        <ServiceAdBanner label="[ Admission Directory Sponsor ]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar: Smart Checker */}
        <div className="w-full lg:w-80 lg:sticky top-24 shrink-0">
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex items-center gap-3 mb-6 mt-2">
              <Target className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Am I Eligible?</h2>
            </div>

            <form onSubmit={handleEligibilityCheck} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SSC GPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="5"
                  required
                  placeholder="e.g. 5.00"
                  value={filters.sscGpa}
                  onChange={(e) => setFilters({...filters, sscGpa: e.target.value, hasChecked: false})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">HSC GPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="5"
                  required
                  placeholder="e.g. 4.50"
                  value={filters.hscGpa}
                  onChange={(e) => setFilters({...filters, hscGpa: e.target.value, hasChecked: false})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Background Group</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Science", "Commerce", "Arts"].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFilters({...filters, group: g, hasChecked: false})}
                      className={`py-2 rounded-xl text-sm font-bold border transition-colors ${filters.group === g ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white hover:bg-indigo-600 transition-colors shadow-md"
              >
                Scan Universities
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {filters.hasChecked && (
               <div className="mt-6 pt-6 border-t border-slate-100 text-center animate-in zoom-in-95">
                 <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Your Total GPA</p>
                 <p className="text-3xl font-black text-indigo-600">{(parseFloat(filters.sscGpa) + parseFloat(filters.hscGpa)).toFixed(2)}</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Content: Feed */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
              <p className="text-slate-500 font-bold">Scanning admission databases...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {universities.map(uni => {
                const isEligible = getEligibilityStatus(uni);
                const showMask = isEligible === false;

                return (
                  <div 
                    key={uni.id} 
                    className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isEligible === true 
                        ? "border-emerald-200 shadow-emerald-500/10 shadow-xl bg-white" 
                        : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Dim Mask for Not Eligible */}
                    {showMask && (
                      <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                        <div className="bg-white/90 shadow-sm p-4 text-center rounded-2xl w-full border border-slate-200">
                           <XCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                           <p className="text-slate-900 font-bold">Not Eligible</p>
                           <p className="text-xs text-slate-500 mt-1 leading-tight">Your GPA or academic group does not meet the minimum requirements for {uni.unit}.</p>
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-8">
                       <div className="flex justify-between items-start mb-6">
                         <div>
                           <div className="flex items-center gap-2 mb-2">
                             <div className="p-1.5 rounded-lg bg-indigo-50">
                               <University className="w-4 h-4 text-indigo-600" />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                               {uni.tags[0]}
                             </span>
                           </div>
                           <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{uni.name}</h2>
                           {uni.unit && <p className="text-indigo-600 font-bold text-sm">{uni.unit}</p>}
                         </div>

                         {isEligible === true && (
                            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full shadow-sm animate-in zoom-in-50">
                               <CheckCircle2 className="w-5 h-5" />
                            </div>
                         )}
                       </div>

                       <div className="space-y-4 mb-6">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                             <CalendarDays className="w-4 h-4 text-slate-500" />
                           </div>
                           <div>
                             <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Exam Date</p>
                             <p className="text-sm font-bold text-slate-900">{new Date(uni.exam_date).toLocaleDateString()}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                             <Award className="w-4 h-4 text-slate-500" />
                           </div>
                           <div>
                             <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Requirements</p>
                             <p className="text-xs font-medium text-slate-600">
                               SSC: {uni.req_ssc.toFixed(2)} | HSC: {uni.req_hsc.toFixed(2)} | Total: {uni.req_total.toFixed(2)}
                             </p>
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-2 mb-6">
                          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                             <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Exam Method</p>
                             <p className="text-xs font-bold text-slate-700">{uni.exam_type}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                             <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Seats Target</p>
                             <p className="text-xs font-bold text-slate-700">{uni.seats}</p>
                          </div>
                       </div>

                       <a 
                         href={uni.apply_url} 
                         target="_blank" 
                         rel="noreferrer"
                         className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all
                           ${isEligible === true 
                             ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700" 
                             : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
                         }
                       >
                         Apply Now
                       </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
