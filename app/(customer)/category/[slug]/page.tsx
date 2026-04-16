import { CategoryHeader } from "@/components/customer/category/category-header";
import { CategoryHero } from "@/components/customer/category/category-hero";
import { CategoryListGrid } from "@/components/customer/category/category-list-grid";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getCategoryPageData } from "@/lib/api/news";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = parseInt((await searchParams)?.page || "1");

  const data = await getCategoryPageData(slug, page);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5 py-4">
      {/* Top Banner Ad Site-wide already in layout? No, local to page usually */}
      <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৯০ ]" className="mb-6 h-[90px]" />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="flex flex-col">
          <CategoryHeader title={data.category.title} subCategories={data.sub_categories} />

          <CategoryHero news={data.selective_news} />

          <CategoryListGrid
            title="আরও খবর"
            news={data.paginated_news.data}
            pagination={data.paginated_news}
            categorySlug={slug}
          />

          {/* Bottom Ad in main area */}
          <div className="my-8">
            <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৬০ ]" className="h-[60px]" />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="flex flex-col pt-24">
          <NewsSidebar popular_news={data.popular_news} />
        </div>
      </div>
    </main>
  );
}
