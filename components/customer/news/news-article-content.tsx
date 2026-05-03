import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, User, MessageCircle } from "lucide-react";
import { SocialShare } from "./social-share";

import { formatBengaliRelativeTime } from "@/lib/formatters";
import type { NewsApiModel } from "@/lib/api/news";
import { AdBanner } from "@/components/customer/home/ad-banner";

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
      <AdBanner
        label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
        heightClass="h-24 sm:h-28"
        category="news details page"
        placement="Header Ad"
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          হোম
        </Link>
        <ChevronRight className="h-3 w-3" />
        {category_hierarchy?.map((category, index) => (
          <Fragment key={category.id}>
            <Link
              href={`/${category.slug}`}
              className="text-[#b38716] hover:text-[#b38716]/80 transition-colors"
            >
              {category.name}
            </Link>
            {index < category_hierarchy.length - 1 && (
              <ChevronRight className="h-3 w-3" />
            )}
          </Fragment>
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

      {/* Content Top Ad */}
      <AdBanner
        label="[ বিজ্ঞাপন — ৯৭০×৬০ ]"
        heightClass="h-20 sm:h-24"
        category="news details page"
        placement="Content Top Ad"
      />

      {/* Article Content */}
      <div className="prose prose-slate max-w-none font-sans text-[18px] md:text-[19px] leading-[1.9] text-[#222222] prose-p:mb-6 prose-p:text-[18px] md:prose-p:text-[19px] prose-p:leading-[1.9] prose-p:text-[#222222] prose-strong:text-black whitespace-pre-wrap space-y-6">
        {/* We can split the content to inject an ad in the middle if it's long enough */}
        {(() => {
          const content = news.content || "";
          const paragraphs = content.split("</p>");
          if (paragraphs.length > 4) {
            const firstHalf = paragraphs.slice(0, 3).join("</p>") + "</p>";
            const secondHalf = paragraphs.slice(3).join("</p>");
            return (
              <>
                <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
                <div className="my-8 flex justify-center">
                  <div className="w-full max-w-[500px]">
                    <AdBanner
                      label="[ বিজ্ঞাপন — ৫০০×৪০০ ]"
                      heightClass="h-[400px]"
                      fit="contain"
                      category="news details page"
                      placement="In-Content Square Ad"
                    />
                  </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            );
          }
          return <div dangerouslySetInnerHTML={{ __html: content }} />;
        })()}
      </div>

      {/* Related Section */}
      <div className="mt-8 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
        <h2 className="mb-4 text-xl font-black text-slate-900 underline decoration-[#c79a1d] decoration-4 underline-offset-8">
          {news.category?.title || "জাতীয়"} এর আরও খবর
        </h2>
        <ul className="grid gap-3">
          {/* TODO: Implement related news fetching */}
          {category_news.map((item) => (
            <li key={item.id} className="group flex items-center gap-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-[#b38716] group-hover:translate-x-1 transition-transform" />
              <h3 className="text-[15px] font-bold text-slate-700 group-hover:text-[#b38716] transition-colors line-clamp-1">
                <Link
                  href={`/${item.category_slug || "news"}/${item.unique_code}`}
                  className="block"
                >
                  {item.title}
                </Link>
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
