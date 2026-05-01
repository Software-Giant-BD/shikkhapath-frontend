import Image from "next/image";
import Link from "next/link";
import { formatBengaliRelativeTime } from "@/lib/formatters";
import { type HeroNewsItem } from "@/lib/api/news";

import { AdBanner } from "@/components/customer/home/ad-banner";

interface Props {
  title?: string;
  news?: HeroNewsItem[];
  adCategory?: string;
  adPlacement?: string;
}

export function NewsSidebar({ title = "আরও পড়ুন", news = [], adCategory, adPlacement }: Props) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Standard Sidebar List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {news.map((item, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Link
                href={`/news/${item.url_slug}`}
                className="flex gap-3 p-2.5"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <Image
                    src={item.feature_image_url || "/No_Image_Available.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <h3 className="line-clamp-2 text-[13px] font-bold leading-tight text-slate-800 group-hover:text-[#b38716] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400">
                    {formatBengaliRelativeTime(item.publish_at)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Sidebar Ad 2 */}
      {adCategory && adPlacement ? (
        <AdBanner
          label="[ বিজ্ঞাপন — ৩০০×২৫০ ]"
          category={adCategory}
          placement={adPlacement}
          heightClass="h-[250px]"
          fit="contain"
          className="my-0"
        />
      ) : (
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
      )}
    </aside>
  );
}
