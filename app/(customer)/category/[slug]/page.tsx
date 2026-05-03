import { CategoryHeader } from "@/components/customer/category/category-header";
import { CategoryHero } from "@/components/customer/category/category-hero";
import { CategoryListGrid } from "@/components/customer/category/category-list-grid";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { SelectedNewsSlider } from "@/components/customer/category/selected-news-slider";
import { getCategoryPageData } from "@/lib/api/news";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data) {
    return {
      title: "Category Not Found | শিক্ষাপথ",
    };
  }

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
      url: `${process.env.NEXT_PUBLIC_APP_URL}/category/${slug}`,
      siteName: siteName,
      type: "website",
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = parseInt((await searchParams)?.page || "1");

  const [data, menuCategories] = await Promise.all([
    getCategoryPageData(slug, page),
    getMenuCategories(),
  ]);

  if (!data) {
    notFound();
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/category/${slug}`;

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
    publisher: getNewsMediaOrganizationSchema(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.paginated_news.map((news, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/news/${news.slug}`,
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
        {/* Top Banner Ad Site-wide already in layout? No, local to page usually */}
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          className="mb-6"
          heightClass="h-24 sm:h-28"
          category="category page"
          placement="Header Ad"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] w-full max-w-full overflow-hidden">
          {/* Main Content Area */}
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

            {/* Bottom Ad in main area */}
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

          {/* Sidebar Area */}
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
