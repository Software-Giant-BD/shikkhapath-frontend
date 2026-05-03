import { notFound } from "next/navigation";
import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { getNewsDetails, getCategoryPageData } from "@/lib/api/news";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getMenuCategories } from "@/lib/api/categories";
import { CategoryHeader } from "@/components/customer/category/category-header";
import { CategoryHero } from "@/components/customer/category/category-hero";
import { CategoryListGrid } from "@/components/customer/category/category-list-grid";
import { SelectedNewsSlider } from "@/components/customer/category/selected-news-slider";

import type { Metadata } from "next";

interface Props {
  params: {
    path: string[];
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  
  // Try news details first
  const news_details = await getNewsDetails(path);

  if (news_details) {
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

  // Try category page
  const data = await getCategoryPageData(path);
  if (data) {
    const { category } = data;
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";

    return {
      title: category.meta_title || `${category.title} | ${siteName}`,
      description:
        category.meta_description ||
        `${category.title} বিভাগের সকল খবর সবার আগে পেতে ভিজিট করুন ${siteName}।`,
      keywords: category.meta_keywords
        ? category.meta_keywords.split(",").map((k) => k.trim())
        : [category.title, siteName],
      openGraph: {
        title: category.meta_title || `${category.title} | ${siteName}`,
        description:
          category.meta_description || `${category.title} বিভাগের সর্বশেষ আপডেট।`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${path.join("/")}`,
        siteName: siteName,
        type: "website",
      },
    };
  }

  return {
    title: "পাতাটি পাওয়া যায়নি | শিক্ষাপথ",
  };
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const { path } = await params;
  const page = parseInt((await searchParams)?.page || "1");

  // Fetch both news details and category data (optimistically)
  // In a real scenario, you might want to call a unified resolve-path API that tells you the type
  const news_details = await getNewsDetails(path);

  if (news_details) {
    return <NewsDetailsView news_details={news_details} path={path} />;
  }

  const category_data = await getCategoryPageData(path, page);
  if (category_data) {
    return <CategoryView data={category_data} path={path} />;
  }

  return notFound();
}

async function NewsDetailsView({ news_details, path }: { news_details: any, path: string[] }) {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "শিক্ষাপথ";
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
      ...news_details.category_hierarchy.map((cat: any, index: number) => ({
        "@type": "ListItem",
        position: index + 2,
        name: cat.name,
        item: `${SITE_URL}/${cat.slug}`, // Hierarchical categories?
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

async function CategoryView({ data, path }: { data: any, path: string[] }) {
  const menuCategories = await getMenuCategories();
  const slug = path[path.length - 1];

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/${path.join("/")}`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.category.title,
    alternateName: data.category.meta_title,
    url: currentUrl,
    description:
      data.category.meta_description ||
      `${data.category.title} বিভাগের সর্বশেষ আপডেট।`,
    keywords: data.category.meta_keywords
      ? data.category.meta_keywords.split(",").map((k) => k.trim())
      : [data.category.title, siteName],
    publisher: getNewsMediaOrganizationSchema(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.paginated_news.map((news: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/${news.category_slug}/${news.unique_code}`,
        name: news.title,
      })),
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
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.category.title,
        item: currentUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbListSchema),
        }}
      />
      <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5 py-4">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          className="mb-6"
          heightClass="h-24 sm:h-28"
          category="category page"
          placement="Header Ad"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] w-full max-w-full overflow-hidden">
          <div className="flex flex-col min-w-0">
            <CategoryHeader
              title={data.category.title}
              subCategories={data.sub_categories}
            />

            <CategoryHero news={data.latest_news.slice(0, 5)} />

            <SelectedNewsSlider title="নির্বাচিত" news={data.selective_news} />

            <div className="my-8">
              <AdBanner
                label="[ বিজ্ঞাপন — ৯৭০×৬০ ]"
                className="my-0"
                heightClass="h-20 sm:h-24"
                category="category page"
                placement="In-Feed Ad"
              />
            </div>

            <CategoryListGrid
              title={`আরও ${data.category.title}`}
              news={data.paginated_news}
              pagination={data.meta}
              categorySlug={slug}
            />

            <div className="my-8">
              <AdBanner
                label="[ বিজ্ঞাপন — ৯৭০×৬০ ]"
                className="my-0"
                heightClass="h-20 sm:h-24"
                category="category page"
                placement="In-Feed second Ad"
              />
            </div>
          </div>

          <div className="flex flex-col pt-24 gap-6">
            <AdBanner
              label="[ বিজ্ঞাপন — ৩০০×২৫০ ]"
              className="w-[300px] mx-auto"
              heightClass="h-[250px]"
              fit="contain"
              category="category page"
              placement="Right Sidebar Ad"
            />
            <NewsSidebar
              title="সর্বশেষ"
              news={data.latest_news}
              adCategory="category page"
              adPlacement="Sidebar Bottom Ad"
            />
          </div>
        </div>
      </main>
    </>
  );
}
