import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, User, Building2, MapPin, GraduationCap, School } from "lucide-react";
import { getCampusNewsBySlug } from "@/lib/api/campus";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { SocialShare } from "@/components/customer/news/social-share";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getCampusNewsBySlug(slug);
  if (!news) return { title: "News Not Found" };

  return {
    title: `${news.title} | Shikkhapath Campus`,
    description: news.description.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "University": return <GraduationCap className="h-4 w-4" />;
    case "College": return <Building2 className="h-4 w-4" />;
    case "School": return <School className="h-4 w-4" />;
    default: return null;
  }
};

export default async function CampusDetailsPage({ params }: Props) {
  const { slug } = await params;
  const news = await getCampusNewsBySlug(slug);
  const popular_news =  [];

  if (!news) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">হোম</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/campus" className="hover:text-slate-900 transition-colors">ক্যাম্পাস কানেক্ট</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 truncate max-w-[200px]">{news.institution_name}</span>
          </nav>

          {/* Headline */}
          <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl lg:text-5xl lg:leading-[1.1]">
            {news.title}
          </h1>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-full text-blue-600 ring-1 ring-blue-100 italic">
                <TypeIcon type={news.institution_type} />
                <span>{news.institution_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                <span>By {news.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{news.publish_date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{news.location}</span>
              </div>
            </div>
            <SocialShare />
          </div>

          {/* Featured Image */}
          <figure className="group flex flex-col gap-4">
            <div className="overflow-hidden rounded-[40px] border border-slate-100 shadow-2xl">
              <Image
                src={news.image}
                alt={news.title}
                width={1200}
                height={800}
                className="aspect-video w-full object-cover"
              />
            </div>
          </figure>

          {/* Article Content */}
          <div 
            className="prose prose-slate max-w-none prose-p:text-[18px] prose-p:leading-relaxed prose-p:text-slate-700 prose-strong:text-slate-900 prose-headings:font-black prose-headings:italic"
            dangerouslySetInnerHTML={{ __html: news.description }}
          />

          {/* Info Box */}
          <div className="mt-12 rounded-[32px] bg-slate-900 p-8 text-white relative overflow-hidden">
             <div className="absolute right-0 top-0 h-40 w-40 bg-blue-600/20 blur-3xl" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                   <h4 className="text-xl font-black uppercase italic">Official Statement</h4>
                   <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Source: {news.institution_name} PR cell</p>
                </div>
                <button className="rounded-2xl bg-blue-600 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20">
                   Visit Website
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <NewsSidebar popular_news={popular_news} />
      </div>

      {/* Recommended Section */}
      <div className="mt-16 py-12 border-t border-slate-100">
         <div className="mb-10 flex items-end justify-between">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-slate-800 uppercase italic">Institutional <span className="text-blue-600">Spotlight</span></h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">More updates from {news.institution_type}s</p>
            </div>
         </div>
         <div className="h-28 w-full rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
            <div className="text-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 underline decoration-blue-500 decoration-2 underline-offset-4">Horizontal Footer Banner</span>
               <div className="mt-2 h-10 w-64 bg-slate-200 rounded animate-pulse mx-auto"></div>
            </div>
         </div>
      </div>
    </main>
  );
}
