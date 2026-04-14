import { NewsArticleContent } from "@/components/customer/news/news-article-content";
import { NewsSidebar } from "@/components/customer/news/news-sidebar";

interface Props {
  params: {
    slug: string;
  };
}

export default function NewsDetailsPage({ params }: Props) {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="flex flex-col">
          <NewsArticleContent />
        </div>

        {/* Sidebar Area */}
        <NewsSidebar />
      </div>

      {/* Bottom Full-Width Ad or Section */}
      <div className="mt-12 py-8 border-t border-slate-100">
         <div className="h-28 w-full rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
            <div className="text-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Horizontal Footer Ad</span>
               <div className="mt-2 h-10 w-64 bg-slate-200 rounded animate-pulse mx-auto"></div>
            </div>
         </div>
      </div>
    </main>
  );
}
