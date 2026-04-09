"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Smile, Frown, Share2, Send, ChevronDown, User } from "lucide-react";

export function NewsComments() {
  const [comment, setComment] = useState("");

  return (
    <div className="mt-10 flex flex-col gap-8 rounded-3xl border border-red-50 bg-[#fffafa] p-6 md:p-10 shadow-sm">
      {/* Reactions Bar */}
      <div className="flex flex-col items-center gap-6">
        <div className="h-0.5 w-full bg-red-100/50" />
        <div className="flex items-center gap-8 md:gap-12">
          <button className="flex flex-col items-center gap-2 group transition-transform hover:scale-110 active:scale-95">
             <Heart className="h-10 w-10 text-red-600 transition-colors group-hover:fill-red-600" strokeWidth={1.5} />
          </button>
          <button className="flex flex-col items-center gap-2 group transition-transform hover:scale-110 active:scale-95">
             <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">👏</div>
          </button>
          <button className="flex flex-col items-center gap-2 group transition-transform hover:scale-110 active:scale-95">
             <Smile className="h-10 w-10 text-red-600 transition-colors group-hover:fill-red-600" strokeWidth={1.5} />
          </button>
          <button className="flex flex-col items-center gap-2 group transition-transform hover:scale-110 active:scale-95">
             <Frown className="h-10 w-10 text-red-600 transition-colors group-hover:fill-red-600" strokeWidth={1.5} />
          </button>
        </div>
        <div className="h-0.5 w-full bg-red-100/50" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-100/50 pb-4">
        <div className="flex items-center gap-4">
           <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:bg-red-50">
             নতুন <ChevronDown className="h-4 w-4 opacity-50" />
           </button>
        </div>
        
        <div className="flex items-center gap-6">
           <button className="text-sm font-black text-red-600 hover:underline">সাইন-ইন</button>
           <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors">
              <Share2 className="h-4 w-4" /> শেয়ার
           </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400">
           <User className="h-6 w-6" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
           <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="আপনার ভাবনা শেয়ার করুন..."
                className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white p-4 pr-12 text-[15px] font-medium leading-relaxed outline-none ring-[#c79a1d]/10 transition-all focus:border-[#c79a1d] focus:ring-4"
              />
              <button className="absolute right-4 top-4 text-slate-400 hover:text-amber-500 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
           </div>
           
           <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#8cb2e1] px-10 py-3 text-sm font-black text-white shadow-lg shadow-[#8cb2e1]/20 transition-all hover:bg-[#74a1d6] active:scale-95">
                 পোস্ট <Send className="h-4 w-4 ml-1" />
              </button>
           </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="text-center">
         <p className="text-[11px] leading-relaxed text-slate-400">
           এই সাইটটি সুরক্ষা দেয় reCAPTCHA ও Google। <Link href="#" className="font-bold text-blue-600 hover:underline">গোপনীয়তা নীতি</Link> এবং <Link href="#" className="font-bold text-blue-600 hover:underline">নীতিমালা</Link> প্রযোজ্য।
         </p>
      </div>
    </div>
  );
}
