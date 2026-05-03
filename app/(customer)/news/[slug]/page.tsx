import { notFound } from "next/navigation";
import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { getNewsDetails } from "@/lib/api/news";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getMenuCategories } from "@/lib/api/categories";

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

  const [menuCategories] = await Promise.all([getMenuCategories()]);

  if (!news_details) {
    return notFound();
  }

  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "শিক্ষাপথ";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shikkhapath.com";
  const currentUrl = `${SITE_URL}/news/${slug}`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const newsArticleSchema = {
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    headline: news_details.main_news.title,
    name: news_details.main_news.title,
    alternativeHeadline: "",
    keywords: news_details.main_news.meta_keywords
      ? news_details.main_news.meta_keywords.split(",").map((k) => k.trim())
      : news_details.main_news.tags,
    about: news_details.main_news.tags,
    description:
      news_details.main_news.meta_description || news_details.main_news.excerpt,
    articleBody: news_details.main_news.content
      ?.replace(/<[^>]*>?/gm, "")
      ?.trim(),
    articleSection:
      news_details.category_hierarchy?.[
        news_details.category_hierarchy.length - 1
      ]?.name || "",
    url: currentUrl,
    datePublished: news_details.main_news.publish_at,
    dateModified: news_details.main_news.publish_at,
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
    image: {
      "@type": "ImageObject",
      url: news_details.main_news.feature_image_url,
      width: 1200,
      height: 630,
    },
    thumbnailUrl: news_details.main_news.feature_image_url || "",
    author: [
      {
        "@type": "Person",
        name: news_details.main_news.author_name || "শিক্ষাপথ ডেস্ক",
      },
    ],
    publisher: getNewsMediaOrganizationSchema(),
    isPartOf: {
      "@type": "WebPage",
      url: currentUrl,
      ...(news_details.main_news.feature_image_url && {
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: news_details.main_news.feature_image_url,
        },
      }),
    },
  };

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...news_details.category_hierarchy.map((cat: any, index: number) => ({
        "@type": "ListItem",
        position: index + 2,
        name: cat.name,
        item: `${SITE_URL}/category/${cat.slug}`,
      })),
      {
        "@type": "ListItem",
        position: news_details.category_hierarchy.length + 2,
        name: news_details.main_news.title,
        item: currentUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbListSchema),
        }}
      />
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
    </>
  );
}
