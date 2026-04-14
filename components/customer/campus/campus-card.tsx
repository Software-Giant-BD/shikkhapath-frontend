"use client";

import Image from "next/image";
import Link from "next/link";
import { type CampusNews } from "@/lib/api/campus";
import { MapPin, Calendar, ArrowRight, GraduationCap, School, Building2 } from "lucide-react";

interface CampusCardProps {
  news: CampusNews;
}

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "University": return <GraduationCap className="h-4 w-4" />;
    case "College": return <Building2 className="h-4 w-4" />;
    case "School": return <School className="h-4 w-4" />;
    default: return null;
  }
};

const TypeColor = (type: string) => {
  switch (type) {
    case "University": return "bg-blue-50 text-blue-600 ring-blue-100";
    case "College": return "bg-emerald-50 text-emerald-600 ring-emerald-100";
    case "School": return "bg-purple-50 text-purple-600 ring-purple-100";
    default: return "bg-slate-50 text-slate-600 ring-slate-100";
  }
};

export function CampusCard({ news }: CampusCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Category Badge over Image */}
        <div className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 backdrop-blur-md ${TypeColor(news.institution_type)}`}>
          <TypeIcon type={news.institution_type} />
          {news.institution_type}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {news.publish_date}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {news.location}
          </div>
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-black leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
          {news.title}
        </h3>

        <div className="mb-6 flex items-center gap-2">
           <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-slate-400" />
           </div>
           <span className="text-xs font-bold text-slate-500 truncate">{news.institution_name}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50">
          <Link 
            href={`/campus/${news.slug}`}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 transition-all hover:gap-3"
          >
            Read More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
