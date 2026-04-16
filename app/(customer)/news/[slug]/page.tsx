import { notFound } from "next/navigation";
import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { getNewsDetails } from "@/lib/api/news";

interface Props {
  params: {
    slug: string;
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
        <NewsSidebar title="জনপ্রিয় খবর" news={news_details.popular_news} />
      </div>

      {/* Bottom Full-Width Ad or Section */}
      <div className="mt-12 py-8 border-t border-slate-100">
        <div className="h-28 w-full rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Horizontal Footer Ad
            </span>
            <div className="mt-2 h-10 w-64 bg-slate-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
