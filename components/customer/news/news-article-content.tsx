import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, User, MessageCircle } from "lucide-react";
import { SocialShare } from "./social-share";

import { formatBengaliRelativeTime } from "@/lib/formatters";
import type { NewsApiModel } from "@/lib/api/news";

interface NewsArticleContentProps {
  news: NewsApiModel;
  category_news: NewsApiModel[];
  category_hierarchy: { id: number; name: string; slug: string }[];
}

export function NewsArticleContent({
  news,
  category_news,
  category_hierarchy,
}: NewsArticleContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Ad */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <div className="relative h-24 w-full bg-slate-50 flex items-center justify-center p-2">
          <Image
            src="https://picsum.photos/seed/topad/1200/200"
            alt="Top Ad"
            fill
            className="object-cover opacity-80"
          />
          <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
            Sponsored Banner
          </span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          হোম
        </Link>
        <ChevronRight className="h-3 w-3" />
        {category_hierarchy?.map((category, index) => (
          <>
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-[#b38716] hover:text-[#b38716]/80 transition-colors"
            >
              {category.name}
            </Link>
            {index < category_hierarchy.length - 1 && (
              <ChevronRight className="h-3 w-3" />
            )}
          </>
        ))}
      </nav>

      {/* Main Headline */}
      <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-3xl lg:text-4xl">
        {news.title}
      </h1>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
        <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full ring-1 ring-slate-100">
            <User className="h-4 w-4 text-[#b38716]" />
            <span>{news.author_name || "শিক্ষাপথ ডেস্ক"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>{formatBengaliRelativeTime(news.publish_at)}</span>
          </div>
        </div>
        <SocialShare />
      </div>

      {/* Featured Image or Video */}
      <figure className="group flex flex-col gap-3">
        {news.type === "video" && news.youtube_video_url ? (
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-lg bg-black">
             <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${
                news.youtube_video_url.match(
                  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:[\?&].*)?$/
                )?.[1]
              }`}
              title={news.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
            <Image
              src={news.feature_image_url || "/No_Image_Available.jpg"}
              alt={news.title}
              width={1200}
              height={800}
              className="aspect-video w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <figcaption className="flex items-center gap-2 px-1 text-sm font-medium text-slate-500 leading-relaxed border-l-4 border-[#c79a1d] pl-4">
          <MessageCircle className="h-4 w-4 shrink-0" />
          {news.title}
        </figcaption>
      </figure>

      {/* Article Content */}
      <div
        className="prose prose-slate max-w-none prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-slate-700 prose-strong:text-slate-900"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* Related Section */}
      <div className="mt-8 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
        <h3 className="mb-4 text-xl font-black text-slate-900 underline decoration-[#c79a1d] decoration-4 underline-offset-8">
          {news.category?.title || "জাতীয়"} এর আরও খবর
        </h3>
        <ul className="grid gap-3">
          {/* TODO: Implement related news fetching */}
          {category_news.map((item, i) => (
            <li key={i} className="group flex items-center gap-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-[#b38716] group-hover:translate-x-1 transition-transform" />
              <Link
                href={`/news/${item.url_slug}`}
                className="text-[15px] font-bold text-slate-700 group-hover:text-[#b38716] transition-colors line-clamp-1"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
