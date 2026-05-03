import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getMenuCategories } from "@/lib/api/categories";
import { CategoryHeader } from "@/components/customer/category/category-header";
import { CategoryHero } from "@/components/customer/category/category-hero";
import { CategoryListGrid } from "@/components/customer/category/category-list-grid";
import { SelectedNewsSlider } from "@/components/customer/category/selected-news-slider";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

interface CategoryViewProps {
  data: any;
  path: string[];
}

export async function CategoryView({ data, path }: CategoryViewProps) {
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
      ...data.category_hierarchy.map((cat: any, index: number) => {
        const fullSlug = data.category_hierarchy
          .slice(0, index + 1)
          .map((c: any) => c.slug)
          .join("/");
        return {
          "@type": "ListItem",
          position: index + 2,
          name: cat.name,
          item: `${siteUrl}/${fullSlug}`,
        };
      }),
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
              currentPath={path.join("/")}
              subCategories={data.sub_categories}
              categoryHierarchy={data.category_hierarchy}
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
