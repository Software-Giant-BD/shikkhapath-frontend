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
    per_page: number;
    total: number;
  };
  categorySlug: string;
}

export function CategoryListGrid({
  title,
  news,
  pagination,
  categorySlug,
}: Props) {
  if (!news || news.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-12 mb-8">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
        <h3 className="text-xl font-black tracking-tight text-slate-900">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-8">
        {news.map((story) => (
          <article
            key={story.id}
            className="group flex flex-col md:flex-row gap-6 border-b border-slate-100 pb-8 transition-all hover:opacity-90 last:border-0"
          >
            <div className="flex flex-1 flex-col justify-center gap-3">
              <Link href={`/news/${story.url_slug}`}>
                <h4 className="text-[20px] font-black leading-tight text-slate-900 group-hover:text-[#c00000] transition-colors line-clamp-2">
                  {story.title}
                </h4>
              </Link>
              <p className="text-[14.5px] leading-relaxed text-slate-500 line-clamp-2">
                {story.excerpt}
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {formatBengaliRelativeTime(story.publish_at)}
              </p>
            </div>
            <Link
              href={`/news/${story.url_slug}`}
              className="relative aspect-16/10 w-full md:w-64 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm"
            >
              <Image
                fill
                src={
                  story.feature_image_url ||
                  "https://picsum.photos/seed/cs4/400/300"
                }
                alt={story.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
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
