import Image from "next/image";
import Link from "next/link";
import { formatBengaliRelativeTime } from "@/lib/formatters";
import { type HeroNewsItem } from "@/lib/api/news";

interface Props {
  popular_news?: HeroNewsItem[];
}

export function NewsSidebar({ popular_news = [] }: Props) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Sidebar Ad 1 */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md">
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src="https://picsum.photos/seed/ad1/400/600"
            alt="Advertisement"
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute top-0 right-0 p-1.5 bg-black/40 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
            Ad
          </div>
        </div>
      </div>

      {/* Standard Sidebar List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            আরও পড়ুন
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {popular_news.map((news, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Link
                href={`/news/${news.url_slug}`}
                className="flex gap-3 p-2.5"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <Image
                    src={news.feature_image_url}
                    alt="{news.title}"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <h4 className="line-clamp-2 text-[13px] font-bold leading-tight text-slate-800 group-hover:text-[#b38716] transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400">
                    {formatBengaliRelativeTime(news.publish_at)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Sidebar Ad 2 */}
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:bg-slate-100/50">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Sponsored Content
          </span>
          <div className="h-40 w-full bg-slate-200 rounded-xl animate-pulse" />
          <p className="text-xs font-bold text-slate-500">
            বিজ্ঞাপনের জন্য যোগাযোগ করুন
          </p>
        </div>
      </div>
    </aside>
  );
}
