import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

interface NewsDetailsViewProps {
  news_details: any;
  path: string[];
}

export async function NewsDetailsView({
  news_details,
  path,
}: NewsDetailsViewProps) {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shikkhapath.com";
  const currentUrl = `${SITE_URL}/${path.join("/")}`;

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
      ...news_details.category_hierarchy.map((cat: any, index: number) => {
        const fullSlug = news_details.category_hierarchy
          .slice(0, index + 1)
          .map((c: any) => c.slug)
          .join("/");
        return {
          "@type": "ListItem",
          position: index + 2,
          name: cat.name,
          item: `${SITE_URL}/${fullSlug}`,
        };
      }),
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
          <div className="flex flex-col">
            <NewsArticleContent
              news={news_details.main_news}
              category_news={news_details.category_news}
              category_hierarchy={news_details.category_hierarchy}
            />
          </div>

          <NewsSidebar
            title="জনপ্রিয় খবর"
            news={news_details.popular_news}
            adCategory="news details page"
            adPlacement="Sidebar Bottom Ad"
          />
        </div>

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
