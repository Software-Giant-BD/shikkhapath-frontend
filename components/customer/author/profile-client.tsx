"use client";

import { 
  User, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  Star,
  MapPin,
  CalendarDays,
  PenTool
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_AUTHOR = {
  name: "Rafiqul Islam",
  bio: "Medical Student at Dhaka Medical College. Passionate about helping admission seekers achieve their dream goals through proper guidelines and realistic prep strategies.",
  joinedDate: "January 2025",
  location: "Dhaka, Bangladesh",
  badges: [
    { title: "Verified Author", color: "bg-blue-50 text-blue-600 border-blue-200", icon: CheckCircle2 },
    { title: "Top Contributor", color: "bg-amber-50 text-amber-600 border-amber-200", icon: Award },
    { title: "Trending", color: "bg-rose-50 text-rose-600 border-rose-200", icon: TrendingUp }
  ],
  stats: {
    totalArticles: 14,
    totalViews: "12.4K",
    likes: "850"
  },
  publishedArticles: [
    {
      id: 1,
      title: "How to prepare for Medical Admission English?",
      category: "Medical",
      date: "April 18, 2026",
      views: "1.2K"
    },
    {
      id: 2,
      title: "Common Mistakes in Botany MCQ",
      category: "Education",
      date: "March 22, 2026",
      views: "3.4K"
    },
    {
      id: 3,
      title: "Understanding the marks distribution of DMC",
      category: "Admission",
      date: "February 10, 2026",
      views: "7.8K"
    }
  ]
};

export function AuthorProfileClient() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Author Profile Card */}
        <div className="col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24">
            <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="absolute -top-12 left-6 w-24 h-24 bg-white p-1.5 rounded-full border border-slate-100 shadow-md">
                <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                  <User className="w-10 h-10" />
                </div>
              </div>
              
              <div className="pt-14">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {MOCK_AUTHOR.name}
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </h1>
                
                <div className="flex flex-wrap gap-2 mt-3 mb-5">
                  {MOCK_AUTHOR.badges.map((Badge, idx) => (
                    <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${Badge.color}`}>
                      <Badge.icon className="w-3.5 h-3.5" />
                      {Badge.title}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  {MOCK_AUTHOR.bio}
                </p>
                
                <div className="space-y-2 mb-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {MOCK_AUTHOR.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    Joined {MOCK_AUTHOR.joinedDate}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">{MOCK_AUTHOR.stats.totalArticles}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Articles</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-2xl font-black text-slate-800">{MOCK_AUTHOR.stats.totalViews}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Views</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-2xl font-black text-slate-800">{MOCK_AUTHOR.stats.likes}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Likes</p>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
               <Link href="/submit-article" className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm">
                  <PenTool className="w-4 h-4" /> Write Article
               </Link>
            </div>
          </div>
        </div>

        {/* Right: Published Articles Feed */}
        <div className="col-span-1 md:col-span-2">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <FileText className="w-5 h-5 text-indigo-500" /> Letest Articles by {MOCK_AUTHOR.name.split(' ')[0]}
             </h2>
           </div>

           <div className="space-y-4">
             {MOCK_AUTHOR.publishedArticles.map(article => (
                <div key={article.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                      {article.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" /> {article.views} views
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" /> Published on {article.date}
                  </p>
                </div>
             ))}
           </div>
        </div>
        
      </div>
    </div>
  );
}
