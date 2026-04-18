"use client";

import { useState } from "react";
import { 
  UploadCloud, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Type, 
  Link as LinkIcon, 
  Image as ImageIcon,
  PenTool,
  Bold,
  Italic,
  List,
  Heading
} from "lucide-react";
import Link from "next/link";

export function SubmitArticleClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    title: "",
    shortDesc: "",
    content: "",
    source: "",
    termsAccepted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) return;
    
    setIsSubmitting(true);
    // Simulate API Call to save as "pending"
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleEditorAction = (action: string) => {
     // A simple mock interaction for the editor toolbar
     const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
     if (!textarea) return;
     
     const start = textarea.selectionStart;
     const end = textarea.selectionEnd;
     const text = formData.content;
     let formatted = "";

     if (action === "bold") formatted = `**${text.substring(start, end) || "bold text"}**`;
     if (action === "italic") formatted = `*${text.substring(start, end) || "italic text"}*`;
     if (action === "h2") formatted = `\n## ${text.substring(start, end) || "Heading 2"}\n`;
     if (action === "list") formatted = `\n- ${text.substring(start, end) || "List item"}\n`;

     setFormData(prev => ({
       ...prev,
       content: text.substring(0, start) + formatted + text.substring(end)
     }));
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Article Submitted successfully!</h2>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl mb-6 inline-flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-bold text-sm">Status: Pending Moderation</p>
          </div>
          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for your contribution, <strong>{formData.name}</strong>! Your article is now in the review queue. Our moderation team will review it shortly. You will be notified via email once it is published.
          </p>
          <div className="flex gap-4 justify-center">
             <Link href="/" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
               Back to Home
             </Link>
             <button 
               onClick={() => {
                 setIsSuccess(false);
                 setFormData({ name: "", email: "", category: "", title: "", shortDesc: "", content: "", source: "", termsAccepted: false });
               }} 
               className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
             >
               Submit Another
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100">
          <PenTool className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Write & <span className="text-indigo-600">Submit Article</span>
        </h1>
        <p className="text-slate-500 md:text-lg font-medium leading-relaxed">
          Share your knowledge and insights with our enormous community. Write about education, medical updates, university news, and more.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Section 1: Author Details */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
               <User className="w-5 h-5 text-indigo-500" />
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Author Details</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Your actual name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required 
                      type="email" 
                      placeholder="For notifications"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Section 2: Article Meta */}
          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
               <Type className="w-5 h-5 text-indigo-500" />
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Article Information</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    required 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Category...</option>
                    <option value="Education">Education & Study</option>
                    <option value="Admission">Admission Tips</option>
                    <option value="Medical">Medical Science</option>
                    <option value="Technology">Technology & IT</option>
                    <option value="Career">Career & Jobs</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Article Title</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter an engaging, click-worthy title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Short Description / Excerpt</label>
                <textarea 
                  required 
                  rows={2}
                  placeholder="Summarize your article in 1-2 sentences..."
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400" 
                />
             </div>
          </div>

          {/* Section 3: Article Content & Media */}
          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
               <ImageIcon className="w-5 h-5 text-indigo-500" />
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Content & Media</h3>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Feature Image</label>
               <div className="flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3">
                      <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      <label htmlFor="feature-image" className="relative cursor-pointer rounded-md font-bold text-indigo-600 focus-within:outline-none hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="feature-image" name="feature-image" type="file" className="sr-only" accept="image/*" />
                      </label>
                      <p className="pl-1 inline">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
               </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Full Article Content (Markdown Supported)</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all bg-slate-50">
                   {/* Editor Toolbar Mock */}
                   <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex gap-1 items-center">
                      <button type="button" onClick={() => handleEditorAction('bold')} className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                      <button type="button" onClick={() => handleEditorAction('italic')} className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button type="button" onClick={() => handleEditorAction('h2')} className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors" title="Heading"><Heading className="w-4 h-4" /></button>
                      <button type="button" onClick={() => handleEditorAction('list')} className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button type="button" className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-bold" title="Insert Link">
                         <LinkIcon className="w-3.5 h-3.5" /> Link
                      </button>
                   </div>
                   <textarea 
                     id="content-editor"
                     required 
                     rows={15}
                     placeholder="Write your brilliant ideas here... Treat this as a rich text area!"
                     value={formData.content}
                     onChange={(e) => setFormData({...formData, content: e.target.value})}
                     className="w-full bg-transparent px-4 py-4 text-sm font-medium text-slate-800 outline-none resize-y placeholder:text-slate-400" 
                   />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Source or Reference Link (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="url" 
                    placeholder="https://example.com"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400" 
                  />
                </div>
             </div>
          </div>

          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-3">
             <input 
               type="checkbox" 
               id="terms"
               required
               checked={formData.termsAccepted}
               onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
               className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
             />
             <label htmlFor="terms" className="text-sm font-medium text-slate-700 leading-relaxed cursor-pointer">
               I confirm that this article is my original work (or properly cited), does not violate any copyright laws, and meets Shikkhapath's community guidelines. I understand it will be reviewed before publishing.
             </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
             <button type="button" className="px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
               Save Draft
             </button>
             <button 
               type="submit" 
               disabled={isSubmitting || !formData.termsAccepted}
               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
             >
               {isSubmitting ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <Send className="w-5 h-5" />
               )}
               {isSubmitting ? "Submitting..." : "Submit for Review"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
