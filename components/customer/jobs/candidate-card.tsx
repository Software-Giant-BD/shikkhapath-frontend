"use client";

import { Download, Briefcase, GraduationCap, MapPin, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export interface Candidate {
  id: string;
  name: string;
  profession: string;
  experience: string;
  education: string;
  location: string;
  skills: string[];
}

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const handleDownloadCV = () => {
    // Mock download action
    alert(`Downloading CV for ${candidate.name}...`);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-100 bg-white">
      <CardHeader className="flex flex-row items-start justify-between bg-slate-50 border-b border-slate-100 pb-4 pt-5 px-5">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {candidate.name}
            </h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 w-fit">
              Available
            </span>
          </div>
          <p className="text-sm font-bold text-[#b38716]">{candidate.profession}</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
          <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Briefcase className="h-3 w-3" />
              Experience
            </div>
            <span className="text-slate-800 font-bold">{candidate.experience}</span>
          </div>
          <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <MapPin className="h-3 w-3" />
              Location
            </div>
            <span className="text-slate-800 font-bold">{candidate.location}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <div className="mt-0.5 rounded-full bg-blue-50 p-1.5 shrink-0">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Education</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5 leading-snug">{candidate.education}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Key Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-400">
                +{candidate.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4">
        <button
          onClick={handleDownloadCV}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
        >
          <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Download CV
        </button>
      </CardFooter>
    </Card>
  );
}
