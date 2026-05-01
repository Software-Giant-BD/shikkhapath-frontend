"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { HeroNewsItem } from "@/lib/api/news";
import { formatBengaliRelativeTime } from "@/lib/formatters";

interface Props {
  title: string;
  news: HeroNewsItem[];
}

export function SelectedNewsSlider({ title, news }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!news || news.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-12 mb-8 relative w-full overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-[#0091ea] pb-1.5 pt-1">
        <h2 className="text-xl font-black tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      <div className="group relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {news.map((item) => (
            <article
              key={item.id}
              className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px] snap-start flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-[#e3f2fd]/30 p-4 transition-all hover:shadow-lg"
            >
              <Link
                href={`/news/${item.url_slug}`}
                className="flex flex-col h-full gap-4"
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-lg shadow-sm">
                  <Image
                    fill
                    src={item.feature_image_url || "https://picsum.photos/seed/cs4/400/300"}
                    alt={item.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-[17px] font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-[#c00000] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-3 mb-2">
                    {item.excerpt}
                  </p>
                  <p className="mt-auto text-[11px] font-bold text-slate-400 uppercase">
                    {formatBengaliRelativeTime(item.publish_at)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 text-slate-600 hover:text-[#c00000] focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 text-slate-600 hover:text-[#c00000] focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
