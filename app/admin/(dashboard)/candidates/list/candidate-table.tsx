"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { updateCandidateStatusAction } from "@/lib/api/jobs-actions";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  profession: string;
  experience: string;
  education?: string;
  location?: string;
  skills: string[];
  cv_path: string;
  status: "approved" | "rejected";
  created_at: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates: initialCandidates }: CandidateTableProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    setLoadingId(id);
    try {
      const result = await updateCandidateStatusAction(id, status);
      if (result.success) {
        toast.success(`Candidate ${status === "approved" ? "approved" : "rejected"} successfully`);
        setCandidates(prev => 
          prev.map(c => c.id === id ? { ...c, status } : c)
        );
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const statusClass = (status: string) => {
    return status === "approved" 
      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
      : "bg-rose-50 text-rose-700 border-rose-100";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4">Candidate</th>
            <th className="px-6 py-4">Profession & Exp</th>
            <th className="px-6 py-4">Skills</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Submitted</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{candidate.name}</span>
                  <span className="text-slate-500 text-xs">{candidate.education || "No education info"}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700">{candidate.profession}</span>
                  <span className="text-slate-500 text-xs">{candidate.experience} Experience</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {candidate.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[10px]">
                      +{candidate.skills.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">
                {candidate.location || "-"}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusClass(candidate.status)}`}>
                  {candidate.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                {formatDate(candidate.created_at)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a 
                    href={candidate.cv_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View CV"
                  >
                    <Download size={18} />
                  </a>
                  
                  {candidate.status === "rejected" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => handleStatusUpdate(candidate.id, "approved")}
                      disabled={loadingId === candidate.id}
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleStatusUpdate(candidate.id, "rejected")}
                      disabled={loadingId === candidate.id}
                    >
                      <XCircle size={14} className="mr-1" />
                      Reject
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-slate-200" />
                  <p>No candidates found.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
