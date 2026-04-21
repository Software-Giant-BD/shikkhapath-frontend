"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit, 
  Clock, 
  FileText, 
  Search, 
  MoreVertical,
  Filter,
  Check,
  AlertTriangle
} from "lucide-react";
import Image from "next/image";

// Mock Data for Pending Articles
const MOCK_SUBMISSIONS = [
  {
    id: "art-101",
    authorName: "Rafiqul Islam",
    authorEmail: "rafiq@example.com",
    title: "How to prepare for Medical Admission English?",
    category: "Medical",
    status: "pending",
    date: "2026-04-18T10:30:00Z",
    contentSnippet: "English is often neglected by medical aspirants, but it holds a critical 15 marks. Here is a breakdown of the syllabus..."
  },
  {
    id: "art-102",
    authorName: "Sabina Yasmin",
    authorEmail: "sabina@example.com",
    title: "The future of EdTech in Rural Bangladesh",
    category: "Technology",
    status: "pending",
    date: "2026-04-17T14:20:00Z",
    contentSnippet: "With internet connectivity reaching remote areas, the landscape of education in Bangladesh is rapidly changing..."
  },
  {
    id: "art-103",
    authorName: "Tanvir Ahmed",
    authorEmail: "tanvir@test.com",
    title: "Dhaka University A Unit Subject Preferences",
    category: "Admission",
    status: "pending",
    date: "2026-04-16T09:15:00Z",
    contentSnippet: "Choosing the correct subject order in DU A unit is crucial. Many students make the mistake of tracking pure passion over..."
  }
];

export function ModerationClient() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [selectedArticle, setSelectedArticle] = useState<typeof MOCK_SUBMISSIONS[0] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    alert("Article Approved and Published successfully!");
  };

  const handleReject = () => {
    if (!rejectReason) return;
    setSubmissions(prev => prev.filter(s => s.id !== selectedArticle?.id));
    setShowRejectModal(false);
    setSelectedArticle(null);
    setRejectReason("");
    alert("Article Rejected. Author notified with reason.");
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Article Moderation</h1>
          <p className="text-sm text-slate-500 mt-1">Review, approve, edit, or reject user-submitted articles.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700">Pending ({submissions.length})</button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">Approved</button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">Rejected</button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, author, or email..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Article Title</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date Submitted</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                      <FileText className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 line-clamp-1">{sub.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{sub.contentSnippet}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">{sub.authorName}</p>
                  <p className="text-xs text-slate-500">{sub.authorEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {sub.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {new Date(sub.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleApprove(sub.id)}
                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors" 
                      title="Approve & Publish"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedArticle(sub);
                        setShowRejectModal(true);
                      }}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md transition-colors" 
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Review & Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {submissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No pending articles in the queue. You're all caught up!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reject Article</h3>
                <p className="text-sm text-slate-500">Provide a reason to notify {selectedArticle.authorName}.</p>
              </div>
            </div>
            
            <div className="p-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Reason for rejection *</label>
              <textarea 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:border-indigo-500" 
                rows={4}
                placeholder="e.g. Plagiarized content, poor grammar, violates guidelines, etc."
              />
            </div>
            
            <div className="p-5 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason}
                className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-50 transition-colors"
               >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
