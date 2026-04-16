"use client";

import { useState, useEffect } from "react";
import { Search, GraduationCap, CalendarDays, FileText, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { fetchRoutinesAction, fetchResultsAction } from "@/lib/api/ssc-hsc-actions";
import type { RoutineModel, ResultModel } from "@/lib/api/ssc-hsc";

type TabMode = "routine" | "result";

const BOARDS = [
  "Dhaka", "Rajshahi", "Cumilla", "Jashore", "Chattogram", "Barishal", "Sylhet", "Dinajpur", "Mymensingh", "Madrasah", "Technical"
];

const YEARS = [2026, 2025, 2024, 2023, 2022];

export function SscHscClient() {
  const [activeTab, setActiveTab] = useState<TabMode>("routine");

  // Routine States
  const [routineType, setRoutineType] = useState<"SSC" | "HSC">("SSC");
  const [routineYear, setRoutineYear] = useState<number>(new Date().getFullYear());
  const [routines, setRoutines] = useState<RoutineModel[]>([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);

  // Result States
  const [searchRoll, setSearchRoll] = useState("");
  const [searchBoard, setSearchBoard] = useState("Dhaka");
  const [searchType, setSearchType] = useState<"SSC" | "HSC">("SSC");
  const [searchYear, setSearchYear] = useState<number>(new Date().getFullYear());
  const [result, setResult] = useState<ResultModel | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Fetch Routines on Change
  useEffect(() => {
    if (activeTab !== "routine") return;
    
    const loadRoutines = async () => {
      setLoadingRoutines(true);
      try {
        const res = await fetchRoutinesAction({ exam_type: routineType, year: routineYear });
        setRoutines(res.items);
      } catch (err) {
        console.error("Failed to load routines", err);
      } finally {
        setLoadingRoutines(false);
      }
    };
    loadRoutines();
  }, [activeTab, routineType, routineYear]);

  const handleSearchResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) {
      setSearchError("Please enter a valid roll number.");
      return;
    }

    setSearching(true);
    setSearchError("");
    setResult(null);

    try {
      const res = await fetchResultsAction({
        roll_number: searchRoll,
        board_name: searchBoard,
        exam_type: searchType,
        year: searchYear,
      });

      if (res.items && res.items.length > 0) {
        setResult(res.items[0]);
      } else {
        setSearchError("No result found for this Roll Number and parameters.");
      }
    } catch (err) {
      setSearchError("Error communicating with the server.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-4 mb-4">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-black md:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
          SSC/HSC <span className="text-blue-600">Portal</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-8">
          Access the latest official routines or securely lookup your individual board exam results.
        </p>

        {/* Top Tab Switcher */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab("routine")}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-base font-bold transition-all ${
              activeTab === "routine" 
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            Exam Routines
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-base font-bold transition-all ${
              activeTab === "result" 
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <FileText className="w-5 h-5" />
            Find Result
          </button>
        </div>
      </div>

      {/* Routine Tab Interface */}
      {activeTab === "routine" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex w-full md:w-auto bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setRoutineType("SSC")}
                className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${routineType === "SSC" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
              >
                SSC
              </button>
              <button
                onClick={() => setRoutineType("HSC")}
                className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${routineType === "HSC" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
              >
                HSC
              </button>
            </div>
            <div className="w-full md:w-48 ml-auto">
              <select
                value={routineYear}
                onChange={(e) => setRoutineYear(Number(e.target.value))}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold focus:border-blue-500 focus:ring-blue-500"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y} Examination</option>
                ))}
              </select>
            </div>
          </div>

          {loadingRoutines ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-4 text-slate-500 font-bold">Loading schedules...</p>
            </div>
          ) : routines.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No Routine Published Yet</h3>
              <p className="text-slate-500 text-sm">The routine for {routineType} {routineYear} is not currently available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routines.map((routine) => (
                <div key={routine.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText className="w-24 h-24" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg mb-4 tracking-wider uppercase">
                     {routine.exam_type} {routine.year}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 truncate" title={routine.subject_name}>{routine.subject_name}</h3>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center text-slate-600 text-sm">
                      <CalendarDays className="w-4 h-4 mr-3 text-slate-400" />
                      <strong>{new Date(routine.exam_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </div>
                    <div className="flex items-center text-slate-600 text-sm">
                      <Clock className="w-4 h-4 mr-3 text-slate-400" />
                      <span>{routine.start_time} - {routine.end_time}</span>
                    </div>
                  </div>

                  {routine.pdf_url && (
                    <button className="w-full mt-6 bg-slate-50 text-slate-700 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-sm font-bold transition-colors">
                      View Official PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result Tab Interface */}
      {activeTab === "result" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
          <form onSubmit={handleSearchResult} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Search Official Results</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Examination</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as "SSC" | "HSC")}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="SSC">SSC / Dakhil / Equivalent</option>
                  <option value="HSC">HSC / Alim / Equivalent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Passing Year</label>
                <select
                  value={searchYear}
                  onChange={(e) => setSearchYear(Number(e.target.value))}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Board</label>
                <select
                  value={searchBoard}
                  onChange={(e) => setSearchBoard(e.target.value)}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                >
                  {BOARDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  value={searchRoll}
                  onChange={(e) => setSearchRoll(e.target.value)}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={searching}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl py-4 font-black tracking-wide text-lg transition-colors flex items-center justify-center gap-2"
            >
              {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {searching ? "Searching Database..." : "Fetch Result"}
            </button>

            {searchError && (
              <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{searchError}</span>
              </div>
            )}
          </form>

          {/* Authentic GPA Result Card Drop-in */}
          {result && (
            <div className="mt-8 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-white/10 pb-6 mb-6">
                 <div>
                    <h3 className="text-white text-2xl font-black">{result.exam_type} Examination {result.year}</h3>
                    <p className="text-slate-400 font-medium">{result.board_name} Board of Education</p>
                 </div>
                 <div className="text-right">
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Roll Number</p>
                    <p className="text-white text-xl font-mono tracking-wider">{result.roll_number}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Final GPA</p>
                    <p className="text-5xl font-black text-white">{result.gpa}</p>
                 </div>
                 <div className={`rounded-2xl p-6 border text-center flex flex-col items-center justify-center ${result.status === "Pass" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Status</p>
                    {result.status === "Pass" ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                        <span className="text-3xl font-black uppercase">Passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-8 h-8" />
                        <span className="text-3xl font-black uppercase">Failed</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Ensure proper internal imports
import { Clock } from "lucide-react";
