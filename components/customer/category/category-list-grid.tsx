import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type HeroNewsItem } from "@/lib/api/news";
import { formatBengaliRelativeTime } from "@/lib/formatters";

interface Props {
  title: string;
  news: HeroNewsItem[];
  pagination: {
    current_page: number;
    last_page: number;
  };
  categorySlug: string;
}

export function CategoryListGrid({ title, news, pagination, categorySlug }: Props) {
  if (!news || news.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-12 mb-8">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
          <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {news.map((story) => (
          <article key={story.id} className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-[#e3f2fd] p-4 transition-all hover:shadow-lg">
             <Link href={`/news/${story.url_slug}`} className="flex flex-col h-full gap-4">
               <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm">
                  <Image fill src={story.feature_image_url || "https://picsum.photos/seed/cs4/400/300"} alt={story.title} className="object-cover transition-transform duration-500 group-hover:scale-105" />
               </div>
               <div className="flex flex-1 flex-col gap-2">
                 <h4 className="text-[15px] font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-[#c00000] transition-colors">{story.title}</h4>
                 <p className="text-[12px] leading-relaxed text-slate-600 line-clamp-3 mb-2">{story.excerpt}</p>
                 <p className="mt-auto text-[10px] font-bold text-slate-400 uppercase">{formatBengaliRelativeTime(story.publish_at)}</p>
               </div>
             </Link>
          </article>
        ))}
      </div>

      {pagination.current_page < pagination.last_page && (
        <div className="mt-6 flex justify-center">
           <Link 
             href={`/category/${categorySlug}?page=${pagination.current_page + 1}`}
             className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-black text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-[#c00000] hover:text-[#c00000]"
           >
              আরও খবর <ChevronRight className="h-4 w-4" />
           </Link>
        </div>
      )}
    </div>
  );
}
