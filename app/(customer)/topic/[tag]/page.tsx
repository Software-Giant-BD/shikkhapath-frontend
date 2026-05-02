import { NewsSidebar } from "@/components/customer/news/news-sidebar";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { getTopicNews, getPopularNews } from "@/lib/api/news";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatBengaliRelativeTime } from "@/lib/formatters";
import { ChevronRight, Play } from "lucide-react";

interface Props {
  params: {
    tag: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).replace(/-/g, " ");
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";

  return {
    title: `'${decodedTag}' টপিকের খবর | ${siteName}`,
    description: `'${decodedTag}' টপিকের সর্বশেষ খবর এবং আপডেট পেতে ভিজিট করুন ${siteName}।`,
    openGraph: {
      title: `'${decodedTag}' টপিকের খবর | ${siteName}`,
      description: `'${decodedTag}' টপিকের সর্বশেষ আপডেট।`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/topic/${tag}`,
      siteName: siteName,
      type: "website",
    },
    alternates: {
      canonical: `/topic/${tag}`,
    },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { tag } = await params;
  const page = parseInt((await searchParams)?.page || "1");

  const [topicData, popularNews] = await Promise.all([
    getTopicNews(tag, page),
    getPopularNews(),
  ]);

  const { items: news, topic, meta: pagination } = topicData;

  if (!news || news.length === 0) {
    if (page === 1) {
      // Could show empty state instead of 404, but 404 is standard
      notFound();
    }
  }

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5 py-4">
      <AdBanner
        label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
        className="mb-6"
        heightClass="h-24 sm:h-28"
        category="topic page"
        placement="Header Ad"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] w-full max-w-full overflow-hidden">
        {/* Main Content Area */}
        <div className="flex flex-col min-w-0">
          <div className="mb-6 border-b-2 border-[#036735] pb-2">
            <h1 className="text-3xl font-black text-[#036735]">
              '{topic}'
            </h1>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-8">
              {news.map((story) => (
                <article
                  key={story.id}
                  className="group flex flex-col md:flex-row gap-6 border-b border-slate-100 pb-8 transition-all hover:opacity-90 last:border-0"
                >
                  <div className="flex flex-1 flex-col justify-center gap-3">
                    <Link href={`/news/${story.url_slug}`}>
                      <h3 className="text-[20px] font-black leading-tight text-slate-900 group-hover:text-[#c00000] transition-colors line-clamp-2">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-[14.5px] leading-relaxed text-slate-500 line-clamp-2">
                      {story.excerpt}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-slate-400">
                      {formatBengaliRelativeTime(story.publish_at)}
                    </p>
                  </div>
                  <Link
                    href={`/news/${story.url_slug}`}
                    className="relative aspect-16/10 w-full md:w-64 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm"
                  >
                    <Image
                      fill
                      src={
                        story.youtube_thumbnail_url ||
                        story.feature_image_url ||
                        "https://picsum.photos/seed/cs4/400/300"
                      }
                      alt={story.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {story.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-5 w-5 fill-red-600 text-red-600 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>

            {pagination.current_page < pagination.last_page && (
              <div className="mt-6 flex justify-center">
                <Link
                  href={`/topic/${encodeURIComponent(tag)}?page=${pagination.current_page + 1}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-sm font-black text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-[#c00000] hover:text-[#c00000]"
                >
                  আরও খবর <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="my-8">
            <AdBanner
              label="[ বিজ্ঞাপন — ৯৭০×৬০ ]"
              className="my-0"
              heightClass="h-20 sm:h-24"
              category="topic page"
              placement="In-Feed Ad"
            />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="flex flex-col pt-4 gap-6">
          <AdBanner
            label="[ বিজ্ঞাপন — ৩০০×২৫০ ]"
            className="w-[300px] mx-auto"
            heightClass="h-[250px]"
            fit="contain"
            category="topic page"
            placement="Right Sidebar Ad"
          />
          <NewsSidebar 
            title="সর্বাধিক পঠিত" 
            news={popularNews.slice(0, 5)} 
            adCategory="topic page" 
            adPlacement="Sidebar Bottom Ad" 
          />
        </div>
      </div>
    </main>
  );
}
