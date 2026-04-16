"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, RefreshCw } from "lucide-react";
import { Breadcrumb } from "@/components/customer/ui/breadcrumb"; // Removed: wait, we don't have breadcrumb as seen previously.

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 3.75,
  "A-": 3.5,
  "B+": 3.25,
  "B": 3.0,
  "B-": 2.75,
  "C+": 2.5,
  "C": 2.25,
  "D": 2.0,
  "F": 0.0,
};

interface SubjectData {
  id: string;
  name: string;
  grade: string;
  credit: string;
}

export function CgpaCalculatorClient() {
  const [subjects, setSubjects] = useState<SubjectData[]>([
    { id: "1", name: "", grade: "", credit: "" },
    { id: "2", name: "", grade: "", credit: "" },
    { id: "3", name: "", grade: "", credit: "" },
  ]);

  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [cgpa, setCgpa] = useState<string>("0.00");

  useEffect(() => {
    let tCredits = 0;
    let tPoints = 0;

    subjects.forEach((sub) => {
      if (sub.grade && sub.credit && !isNaN(Number(sub.credit))) {
        const creditVal = Number(sub.credit);
        const gradeVal = GRADE_POINTS[sub.grade];
        if (gradeVal !== undefined) {
          tCredits += creditVal;
          tPoints += creditVal * gradeVal;
        }
      }
    });

    setTotalCredits(tCredits);
    setTotalPoints(tPoints);
    if (tCredits > 0) {
      setCgpa((tPoints / tCredits).toFixed(2));
    } else {
      setCgpa("0.00");
    }
  }, [subjects]);

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: "", grade: "", credit: "" },
    ]);
  };

  const handleRemoveSubject = (idToRemove: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((sub) => sub.id !== idToRemove));
    }
  };

  const handleUpdate = (id: string, field: keyof SubjectData, value: string) => {
    setSubjects(
      subjects.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  const handleReset = () => {
    setSubjects([
      { id: Date.now().toString() + "1", name: "", grade: "", credit: "" },
      { id: Date.now().toString() + "2", name: "", grade: "", credit: "" },
      { id: Date.now().toString() + "3", name: "", grade: "", credit: "" },
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-purple-100 p-3 mb-4">
          <Calculator className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-black md:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
          <span className="text-purple-600">CGPA</span> Calculator
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Calculate your semester grade point average easily. Add your subjects, select the earned grades and specify credits to get an instant result.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Side: Input Form */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 md:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Academic Records</h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 mb-3 px-2">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Subject Name (Optional)</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Credit</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Grade</div>
              <div></div>
            </div>

            <div className="space-y-4">
              {subjects.map((sub, index) => (
                <div 
                  key={sub.id} 
                  className="flex flex-col md:grid md:grid-cols-[1fr_120px_120px_40px] gap-3 md:gap-4 items-end md:items-center rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-2 md:border-transparent md:bg-transparent"
                >
                  <div className="w-full">
                    <label className="md:hidden block mb-1 text-xs font-bold text-slate-500 uppercase">Subject {index + 1}</label>
                    <input
                      type="text"
                      placeholder={`Subject ${index + 1}`}
                      value={sub.name}
                      onChange={(e) => handleUpdate(sub.id, "name", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="w-full flex gap-3 md:contents">
                    <div className="w-full">
                      <label className="md:hidden block mb-1 text-xs font-bold text-slate-500 uppercase">Credit</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="e.g. 3"
                        value={sub.credit}
                        onChange={(e) => handleUpdate(sub.id, "credit", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="w-full">
                      <label className="md:hidden block mb-1 text-xs font-bold text-slate-500 uppercase">Grade</label>
                      <select
                        value={sub.grade}
                        onChange={(e) => handleUpdate(sub.id, "grade", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="" disabled>Select</option>
                        {Object.keys(GRADE_POINTS).map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSubject(sub.id)}
                    disabled={subjects.length <= 1}
                    className="mt-2 md:mt-0 flex h-10 w-full md:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddSubject}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Another Subject
            </button>
          </div>
        </div>

        {/* Right Side: Results Highlight */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sticky top-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            
            <h3 className="mb-6 text-xl font-bold text-slate-900 mt-2">Calculation Result</h3>

            <div className="rounded-2xl bg-slate-50 p-6 text-center ring-1 ring-slate-100 mb-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-10">Your Final CGPA</p>
              <p className="text-6xl font-black text-slate-900 tracking-tighter relative z-10">
                {cgpa}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-4">
                <span className="text-sm font-bold text-slate-500">Total Credits completed</span>
                <span className="text-lg font-black text-slate-900">{totalCredits.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-4">
                <span className="text-sm font-bold text-slate-500">Total Grade Points</span>
                <span className="text-lg font-black text-slate-900">{totalPoints.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-amber-50 p-4 border border-amber-100">
              <h4 className="text-sm font-bold text-amber-900 mb-1">Standard Grading System</h4>
              <p className="text-xs text-amber-700/80 leading-relaxed">
                This calculator uses standard scaling where A+ is 4.00, A is 3.75, and incrementally lowers 0.25 points per letter. Check your institution's manual if your scale differs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
