import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { type HeroNewsItem } from "@/lib/api/news";
import { formatBengaliRelativeTime } from "@/lib/formatters";

interface Props {
  news: HeroNewsItem[];
}

export function CategoryHero({ news }: Props) {
  if (!news || news.length === 0) return null;

  const main = news[0];
  const secondary = news[1];
  const remaining = news.slice(2, 5);
  const sideRemaining = news.slice(2, 5); // Just to follow the existing structure if possible

  // The existing structure had:
  // main (left top)
  // smallGridStories.slice(0, 2) (left bottom grid)
  // secondary (right top)
  // smallGridStories.slice(2) (right bottom list)
  
  // Let's adapt:
  // main: news[0]
  // left grid: news[3], news[4]
  // secondary: news[1]
  // right list: news[2]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Left Highlight */}
      <div className="flex flex-col gap-6">
        <article className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg">
          <Link href={`/news/${main.url_slug}`} className="flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={main.youtube_thumbnail_url || main.feature_image_url || "/No_Image_Available.jpg"}
                alt={main.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {main.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 fill-red-600 text-red-600 ml-1.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h2 className="text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl group-hover:text-amber-400 transition-colors">
                  {main.title}
                </h2>
                <p className="mt-2 text-xs font-bold text-white/70 uppercase tracking-widest">{formatBengaliRelativeTime(main.publish_at)}</p>
              </div>
            </div>
          </Link>
        </article>

        <div className="grid gap-6 sm:grid-cols-2">
           {news.slice(3, 5).map((item) => (
             <article key={item.id} className="group flex flex-col gap-3">
               <Link href={`/news/${item.url_slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-100">
                  <Image fill src={item.youtube_thumbnail_url || item.feature_image_url || "/No_Image_Available.jpg"} alt={item.title} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                        <Play className="h-4 w-4 fill-red-600 text-red-600 ml-0.5" />
                      </div>
                    </div>
                  )}
               </Link>
               <div>
                  <h3 className="text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-[#c00000] transition-colors">{item.title}</h3>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">{formatBengaliRelativeTime(item.publish_at)}</p>
               </div>
             </article>
           ))}
        </div>
      </div>

      {/* Right List Area */}
      <div className="flex flex-col gap-6">
        {secondary && (
          <article className="group flex flex-col gap-4 border-b border-slate-100 pb-6">
            <Link href={`/news/${secondary.url_slug}`} className="relative aspect-video overflow-hidden rounded-xl">
               <Image fill src={secondary.youtube_thumbnail_url || secondary.feature_image_url || "/No_Image_Available.jpg"} alt={secondary.title} className="object-cover transition-transform duration-500 group-hover:scale-105" />
               {secondary.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-red-600 text-red-600 ml-0.5" />
                  </div>
                </div>
              )}
            </Link>
            <div className="space-y-2">
              <h3 className="text-lg font-bold leading-tight group-hover:text-[#c00000] transition-colors">{secondary.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2">{secondary.excerpt}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatBengaliRelativeTime(secondary.publish_at)}</p>
            </div>
          </article>
        )}
        
        <div className="flex flex-col gap-4">
           {news.slice(2, 3).map((item) => (
             <article key={item.id} className="group flex gap-3 items-center">
               <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image fill src={item.youtube_thumbnail_url || item.feature_image_url || "/No_Image_Available.jpg"} alt={item.title} className="object-cover" />
               </div>
               <div>
                  <h4 className="text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-[#c00000]">{item.title}</h4>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">{formatBengaliRelativeTime(item.publish_at)}</p>
               </div>
             </article>
           ))}
        </div>
      </div>
    </div>
  );
}
