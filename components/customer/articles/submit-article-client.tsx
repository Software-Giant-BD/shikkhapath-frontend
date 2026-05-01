"use client";

import { useEffect, useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Type, 
  Image as ImageIcon,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { submitArticleAction } from "@/lib/api/article-actions";
import { getAllCategoriesAction } from "@/lib/api/category-actions";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";

export function SubmitArticleClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category_id: "",
    title: "",
    content: "",
    termsAccepted: false
  });
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setIsCategoriesLoading(true);
      const result = await getAllCategoriesAction();
      if (result.ok) {
        setCategories(result.items);
      }
      setIsCategoriesLoading(false);
    }
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeatureImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) return;
    
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category_id", formData.category_id);
    data.append("content", formData.content);
    data.append("author_name", formData.name);
    if (featureImage) {
      data.append("feature_image", featureImage);
    }

    const result = await submitArticleAction(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">আর্টিকেলটি সফলভাবে জমা দেওয়া হয়েছে!</h2>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl mb-6 inline-flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-bold text-sm">স্ট্যাটাস: পর্যালোচনার জন্য অপেক্ষমান</p>
          </div>
          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            ধন্যবাদ <strong>{formData.name}</strong>! আপনার আর্টিকেলটি আমাদের রিভিউ টিমের কাছে পৌঁছেছে। পর্যালোচনার পর এটি দ্রুত প্রকাশ করা হবে।
          </p>
          <div className="flex gap-4 justify-center">
             <Link href="/" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
               হোমে ফিরে যান
             </Link>
             <button 
               onClick={() => {
                 setIsSuccess(false);
                 setFormData({ name: "", email: "", category_id: "", title: "", content: "", termsAccepted: false });
                 setFeatureImage(null);
                 setImagePreview(null);
               }} 
               className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
             >
               আরও আর্টিকেল লিখুন
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
          আর্টিকেল <span className="text-indigo-600">লিখুন ও পাঠান</span>
        </h1>
        <p className="text-slate-500 md:text-lg font-medium leading-relaxed">
          আপনার জ্ঞান এবং চিন্তাভাবনা আমাদের বিশাল কমিউনিটির সাথে শেয়ার করুন। শিক্ষা, ক্যারিয়ার, টিপস এবং ট্রিকস নিয়ে লিখতে পারেন।
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Section 1: Author Details */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
               <User className="w-5 h-5 text-indigo-500" />
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">লেখকের তথ্য</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">পূর্ণ নাম</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="আপনার নাম"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ইমেইল ঠিকানা</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required 
                      type="email" 
                      placeholder="যোগাযোগের জন্য"
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
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">আর্টিকেলের তথ্য</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ক্যাটাগরি</label>
                  <SearchableSelect 
                    placeholder={isCategoriesLoading ? "লোড হচ্ছে..." : "ক্যাটাগরি সিলেক্ট করুন"}
                    searchPlaceholder="সার্চ করুন..."
                    options={categories.map(cat => ({
                      id: cat.id,
                      name: cat.title
                    }))}
                    value={formData.category_id}
                    onChange={(val) => setFormData({...formData, category_id: val})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">আর্টিকেলের শিরোনাম</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="একটি আকর্ষণীয় শিরোনাম দিন"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
             </div>
          </div>

          {/* Section 3: Article Content & Media */}
          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
               <ImageIcon className="w-5 h-5 text-indigo-500" />
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">মূল বিষয়বস্তু ও ছবি</h3>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ফিচার ইমেজ</label>
               <div 
                 onClick={() => document.getElementById('feature-image')?.click()}
                 className={cn(
                   "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group relative overflow-hidden",
                   imagePreview && "border-indigo-300 bg-indigo-50/20"
                 )}
               >
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold text-sm">ছবি পরিবর্তন করুন</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3">
                        <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        <span className="font-bold text-indigo-600">ছবি আপলোড করুন</span>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (সর্বোচ্চ ২ মেগাবাইট)</p>
                      </div>
                    </div>
                  )}
                  <input 
                    id="feature-image" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
               </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">মূল আর্টিকেল</label>
                <RichTextEditor 
                  value={formData.content}
                  placeholder="আপনার আর্টিকেলটি এখানে বিস্তারিত লিখুন..."
                  onChange={(val) => setFormData({...formData, content: val})}
                  className="min-h-[300px]"
                />
             </div>
          </div>

          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-3">
             <input 
               type="checkbox" 
               id="terms"
               required
               checked={formData.termsAccepted}
               onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
               className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
             />
             <label htmlFor="terms" className="text-sm font-medium text-slate-700 leading-relaxed cursor-pointer select-none">
               আমি নিশ্চিত করছি যে এটি আমার মৌলিক কাজ এবং এটি শিক্ষাপথের নীতিমালা মেনে তৈরি করা হয়েছে। আমি বুঝতে পারছি যে এটি পর্যালোচনার পর প্রকাশিত হবে।
             </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
             <button 
               type="submit" 
               disabled={isSubmitting || !formData.termsAccepted}
               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
             >
               {isSubmitting ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <Send className="w-5 h-5" />
               )}
               {isSubmitting ? "পাঠানো হচ্ছে..." : "আর্টিকেল জমা দিন"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
