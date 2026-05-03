import type { Metadata } from "next";
import { NewsApiModel } from "@/lib/api/news";

export function getNewsDetailsMetadata(news: NewsApiModel): Metadata {
  return {
    title: news.meta_title || news.title,
    description: news.meta_description || news.excerpt,
    keywords: news.meta_keywords
      ? news.meta_keywords.split(",").map((k) => k.trim())
      : news.tags,
    openGraph: {
      title: news.meta_title || news.title,
      description: news.meta_description || news.excerpt,
      images: news.feature_image_url ? [news.feature_image_url] : [],
      type: "article",
      publishedTime: news.publish_at,
      authors: [news.author_name || "শিক্ষাপথ ডেস্ক"],
    },
    twitter: {
      card: "summary_large_image",
      title: news.meta_title || news.title,
      description: news.meta_description || news.excerpt,
      images: news.feature_image_url ? [news.feature_image_url] : [],
    },
  };
}
