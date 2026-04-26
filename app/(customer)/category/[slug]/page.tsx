import { CategoryHeader } from "@/components/customer/category/category-header";
import { CategoryHero } from "@/components/customer/category/category-hero";
import { CategoryListGrid } from "@/components/customer/category/category-list-grid";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { SelectedNewsSlider } from "@/components/customer/category/selected-news-slider";
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
  );
}
