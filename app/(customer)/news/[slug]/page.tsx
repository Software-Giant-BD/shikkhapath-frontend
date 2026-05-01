import { notFound } from "next/navigation";
import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { getNewsDetails } from "@/lib/api/news";
import { AdBanner } from "@/components/customer/home/ad-banner";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news_details = await getNewsDetails(slug);

  if (!news_details) {
    return {
      title: "সংবাদ পাওয়া যায়নি | শিক্ষাপথ",
    };
  }

  const news = news_details.main_news;

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

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const news_details = await getNewsDetails(slug);

  if (!news_details) {
    return notFound();
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="flex flex-col">
          <NewsArticleContent
            news={news_details.main_news}
            category_news={news_details.category_news}
            category_hierarchy={news_details.category_hierarchy}
          />
        </div>

        {/* Sidebar Area */}
        <NewsSidebar
          title="জনপ্রিয় খবর"
          news={news_details.popular_news}
          adCategory="news details page"
          adPlacement="Sidebar Bottom Ad"
        />
      </div>

      {/* Bottom Full-Width Ad */}
      <div className="mt-12">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-28"
          category="news details page"
          placement="Footer Ad"
        />
      </div>
    </main>
  );
}
