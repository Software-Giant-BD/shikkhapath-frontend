"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, User, ChevronDown } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { getAllCategoriesAction } from "@/lib/api/category-actions";

export default function SearchPage() {
  const [categories, setCategories] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeField, setActiveField] = useState("");

  useEffect(() => {
    getAllCategoriesAction().then((res) => {
      if (res.ok) setCategories(res.items);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <style jsx global>{`
        .date-input-custom::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">অনুসন্ধান</h1>
        </div>

        {/* Search Input Container */}
        <div className="relative mb-8 group">
          <input
            type="text"
            placeholder="যা খুঁজতে চান"
            autoFocus
            className="w-full h-16 md:h-[80px] rounded-xl border-2 border-slate-100 bg-white pl-6 md:pl-10 pr-20 text-xl md:text-3xl font-bold text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-2 top-2 bottom-2 w-14 md:w-20 bg-[#007bff] rounded-xl flex items-center justify-center text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20">
            <Search className="h-6 w-6 md:h-8 md:w-8" />
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-12 bg-slate-100 rounded-lg border border-slate-100 shadow-sm">
          {/* Date Filter */}
          <div 
            className={`relative flex flex-col justify-center h-20 px-5 transition-all cursor-pointer ${
              activeField === 'date' || selectedDate ? 'bg-[#eef7ff] border-b-2 border-blue-600' : 'bg-[#f5f5f5] border-b border-slate-200'
            }`}
            onClick={(e) => {
              const input = e.currentTarget.querySelector('input');
              if (input && 'showPicker' in input) {
                input.showPicker();
              } else if (input) {
                input.focus();
              }
              setActiveField('date');
            }}
          >
            <span className={`text-[13px] font-bold mb-1 transition-colors ${activeField === 'date' ? 'text-blue-600' : 'text-slate-500'}`}>তারিখ</span>
            <input
              type="date"
              className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none date-input-custom h-7"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onFocus={() => setActiveField('date')}
              onBlur={() => setActiveField('')}
            />
            <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${activeField === 'date' ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>

          {/* Author Filter */}
          <div className={`relative flex flex-col justify-center h-20 px-5 transition-all ${
            activeField === 'author' ? 'bg-[#eef7ff] border-b-2 border-blue-600' : 'bg-[#f5f5f5] border-b border-slate-200'
          }`}>
            <span className={`text-[13px] font-bold mb-1 transition-colors ${activeField === 'author' ? 'text-blue-600' : 'text-slate-500'}`}>লেখক</span>
            <div className="relative h-7">
                <input
                  type="text"
                  className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  onFocus={() => setActiveField('author')}
                  onBlur={() => setActiveField('')}
                />
                <User className={`absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 ${activeField === 'author' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
          </div>

          {/* Section Filter (Searchable Select) */}
          <div 
            className={`relative flex flex-col justify-center h-20 transition-all cursor-pointer ${
              activeField === 'section' ? 'bg-[#eef7ff] border-b-2 border-blue-600' : 'bg-[#f5f5f5] border-b border-slate-200'
            }`}
            onClick={() => setActiveField('section')}
          >
            <div className="px-5">
                <span className={`text-[13px] font-bold mb-1 transition-colors ${activeField === 'section' ? 'text-blue-600' : 'text-slate-500'}`}>সেকশন</span>
            </div>
            <SearchableSelect
              options={categories.map(c => ({ id: c.id, name: c.title, bn_name: c.title }))}
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val);
                setActiveField('');
              }}
              placeholder="সেকশন"
              triggerClassName="h-10 border-none bg-transparent px-5 text-lg font-bold text-slate-900 shadow-none hover:bg-transparent"
            />
          </div>

          {/* Type Filter */}
          <div 
            className={`relative flex flex-col justify-center h-20 transition-all cursor-pointer ${
              activeField === 'type' ? 'bg-[#eef7ff] border-b-2 border-blue-600' : 'bg-[#f5f5f5] border-b border-slate-200'
            }`}
            onClick={() => setActiveField('type')}
          >
            <div className="px-5">
                <span className={`text-[13px] font-bold mb-1 transition-colors ${activeField === 'type' ? 'text-blue-600' : 'text-slate-500'}`}>ধরন</span>
            </div>
            <SearchableSelect
              options={[
                { id: 'news', name: 'সংবাদ', bn_name: 'সংবাদ' },
                { id: 'video', name: 'ভিডিও', bn_name: 'ভিডিও' }
              ]}
              value={selectedType}
              onChange={(val) => {
                setSelectedType(val);
                setActiveField('');
              }}
              placeholder="ধরন"
              triggerClassName="h-10 border-none bg-transparent px-5 text-lg font-bold text-slate-900 shadow-none hover:bg-transparent"
            />
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
           <p className="text-xl font-bold text-slate-900">
             প্রাপ্ত ফলাফল: <span className="text-slate-600">১৪০৭১০০</span>
           </p>
           <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-slate-500">সাজানো</span>
              <div className="relative min-w-[140px]">
                <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 outline-none appearance-none focus:border-blue-500 transition-all cursor-pointer">
                    <option value="relevant">প্রাসঙ্গিক</option>
                    <option value="latest">সর্বশেষ</option>
                    <option value="oldest">পুরানো</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* Search Results List Placeholder */}
        <div className="mt-16 flex flex-col items-center justify-center py-20 text-slate-200">
           <Search className="h-24 w-24 mb-6 opacity-10" />
           <p className="text-2xl font-bold opacity-30">আপনার কাঙ্ক্ষিত সংবাদটি খুঁজুন</p>
        </div>
      </div>
    </main>
  );
}
