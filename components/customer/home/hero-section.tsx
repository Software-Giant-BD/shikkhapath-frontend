import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ChevronRight } from "lucide-react";
import type {
  HeroNewsResponse,
  PopularNewsResponse,
  LatestNewsResponse,
} from "@/lib/api/news";
import { formatBengaliRelativeTime } from "@/lib/formatters";

const HOME_LAYOUT_CONFIG = {
  leftNewsCount: 6,
  heroCardCount: 2,
  centerGridCount: 8,
} as const;

// Service Utility Hub Data
const utilitySections = [
  {
    name: "🚨 Emergency",
    color: "bg-red-50 text-red-600 border-red-100",
    links: [
      { label: "Ambulance 🚑", href: "/ambulance" },
      { label: "Police 👮", href: "/police" },
      { label: "Fire 🚒", href: "/fire-service" },
      { label: "Blood 🩸", href: "/blood-donation" },
      { label: "Doctor 🏥", href: "/doctors" },
    ],
  },
  {
    name: "💳 Services",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    links: [{ label: "Train 🚆", href: "/trains" }],
  },
  {
    name: "🎓 Education",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    links: [
      { label: "Campus", href: "/campus" },
      { label: "Jobs", href: "/jobs" },
      { label: "SSC/HSC (রুটিন | রেজাল্ট)", href: "#" },
      { label: "Admission", href: "#" },
    ],
  },
  {
    name: "🏫 Uni & Medical",
    color: "bg-green-50 text-green-600 border-green-100",
    links: [
      { label: "University Events", href: "#" },
      { label: "Medical News", href: "#" },
    ],
  },
  {
    name: "🛠 Tools",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    links: [
      { label: "CGPA Calculator", href: "#" },
      { label: "নামাজের সময়", href: "#" },
    ],
  },
  {
    name: "📰 জাতীয় খবর",
    color: "bg-slate-50 text-slate-600 border-slate-100",
    links: [
      { label: "Breaking News", href: "#" },
      { label: "সর্বশেষ খবর", href: "#" },
      { label: "দেশের পরিস্থিতি", href: "#" },
      { label: " রাজনীতি", href: "#" },
    ],
  },
];

interface HeroSectionProps {
  data?: HeroNewsResponse;
  popularNews?: PopularNewsResponse;
  latestNews?: LatestNewsResponse;
}

export function HeroSection({
  data,
  popularNews,
  latestNews,
}: HeroSectionProps) {
  console.log(data?.home_left);

  const leftStories =
    data?.home_left && data.home_left.length > 0
      ? data.home_left.map((item) => ({
          image: item.feature_image_url,
          title: item.title,
          time: formatBengaliRelativeTime(item.publish_at),
          slug: item.slug,
          url_slug: item.url_slug,
        }))
      : []
          .slice(0, HOME_LAYOUT_CONFIG.leftNewsCount)
          .map((s) => ({ ...s, slug: "sample-slug", url_slug: "sample-slug" }));

  const featuredStories =
    data?.feature_news && data.feature_news.length > 0
      ? data.feature_news.map((item) => ({
          image: item.feature_image_url,
          category: item.category?.title || "জাতীয়",
          title: item.title,
          excerpt: item.excerpt,
          time: formatBengaliRelativeTime(item.publish_at),
          slug: item.slug,
          url_slug: item.url_slug,
        }))
      : []
          .slice(0, HOME_LAYOUT_CONFIG.heroCardCount)
          .map((s) => ({ ...s, slug: "sample-slug", url_slug: "sample-slug" }));

  const centerGridStories =
    popularNews && popularNews.length > 0
      ? popularNews
          .slice(0, HOME_LAYOUT_CONFIG.centerGridCount)
          .map((item) => ({
            image: item.feature_image_url,
            title: item.title,
            slug: item.slug,
            url_slug: item.url_slug,
          }))
      : []
          .slice(0, HOME_LAYOUT_CONFIG.centerGridCount)
          .map((s) => ({ ...s, slug: "sample-slug", url_slug: "sample-slug" }));

  const topicData =
    latestNews && latestNews.length > 0
      ? {
          title: latestNews[0].title,
          main: {
            image: latestNews[0].feature_image_url,
            title: latestNews[0].title,
            time: formatBengaliRelativeTime(latestNews[0].publish_at),
            slug: latestNews[0].slug,
            url_slug: latestNews[0].url_slug,
          },
          left: latestNews.slice(1, 3).map((item) => ({
            image: item.feature_image_url,
            title: item.title,
            time: formatBengaliRelativeTime(item.publish_at),
            slug: item.slug,
            url_slug: item.url_slug,
          })),
          right: latestNews.slice(3, 5).map((item) => ({
            image: item.feature_image_url,
            title: item.title,
            time: formatBengaliRelativeTime(item.publish_at),
            slug: item.slug,
            url_slug: item.url_slug,
          })),
        }
      : null;

  return (
    <section className="mt-4 grid gap-5 lg:grid-cols-[240px_1fr_280px]">
      {/* Left Column: Card-styled trend list */}
      <aside className="hidden flex-col gap-3 lg:flex">
        {leftStories.map((story, i) => (
          <article
            key={i}
            className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Link
              href={`/news/${story.url_slug}`}
              className="flex flex-col gap-2 p-2"
            >
              <div className="overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                <Image
                  src={story.image}
                  alt=""
                  width={240}
                  height={160}
                  className="aspect-3/2 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 py-1">
                <h3 className="line-clamp-3 text-[14px] font-bold leading-snug text-slate-900 group-hover:text-[#b38716] transition-colors">
                  {story.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </aside>

      {/* Center Column */}
      <div className="flex flex-col gap-5">
        {/* Dual Highlight Area */}
        <div className="grid gap-5 sm:grid-cols-2">
          {featuredStories.map((story, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl"
            >
              <Link
                href={`/news/${story.url_slug}`}
                className="flex flex-col h-full"
              >
                <div className="relative overflow-hidden shrink-0">
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={500}
                    height={300}
                    priority
                    className="aspect-video w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
                    <span className="rounded-full bg-white/95 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50">
                      {story.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center text-center gap-3 p-5 lg:p-6 pb-4">
                  <h2 className="text-lg font-black leading-tight tracking-tight text-slate-900 group-hover:text-[#b38716] transition-colors md:text-xl lg:text-[22px] line-clamp-2 px-1">
                    {story.title}
                  </h2>

                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-[1.5px] w-5 rounded-full bg-slate-100" />
                    <div className="h-1 w-1 rounded-full bg-[#c79a1d]" />
                    <div className="h-[1.5px] w-5 rounded-full bg-slate-100" />
                  </div>

                  <p className="line-clamp-2 text-[13px] md:text-[14px] leading-relaxed text-slate-600 font-medium">
                    {story.excerpt}
                  </p>

                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-1.5 justify-center bg-slate-50 px-3 py-1 rounded-full ring-1 ring-slate-100">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {story.time}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Themed Topic Highlight Block (Iran-Israel Theme) */}
        {topicData && (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-50">
          {/* Block Header */}
          <div className="flex h-11 items-center justify-between bg-slate-950 px-4 text-white">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[14px] font-black tracking-tight line-clamp-1">
                {topicData.title}
              </span>
            </div>
            <Link
              href="/news"
              className="rounded bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-700 active:scale-95"
            >
              সব খবর
            </Link>
          </div>

          {/* Block Grid */}
          <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_2fr_1.2fr]">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {topicData.left.map((item, i) => (
                <article key={i} className="group flex flex-col gap-2">
                  <Link
                    href={`/news/${item.url_slug}`}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      fill
                      src={item.image}
                      alt=""
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <h4 className="text-[12.5px] font-bold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors uppercase">
                    {item.title}
                  </h4>
                </article>
              ))}
            </div>

            {/* Middle (Main Focus) */}
            <article className="group flex flex-col text-center">
              <Link
                href={`/news/${topicData.main.url_slug}`}
                className="flex flex-col h-full gap-4"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-100">
                  <Image
                    fill
                    src={topicData.main.image}
                    alt=""
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1.5 px-2">
                  <h3 className="text-[17px] font-black leading-tight text-slate-950 group-hover:text-red-600 transition-colors">
                    {topicData.main.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <div className="h-1 w-1 rounded-full bg-red-600" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {topicData.main.time}
                    </p>
                  </div>
                </div>
              </Link>
            </article>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {topicData.right.map((item, i) => (
                <article key={i} className="group flex flex-col gap-2">
                  <Link
                    href={`/news/${item.url_slug}`}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      fill
                      src={item.image}
                      alt=""
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <h4 className="text-[12.5px] font-bold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors uppercase">
                    {item.title}
                  </h4>
                </article>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* 2-Column Grid of mini-stories (Remaining) */}
        <div className="grid gap-4 sm:grid-cols-2">
          {centerGridStories.map((story, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Link
                href={`/news/${story.url_slug}`}
                className="flex gap-3 p-2.5"
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner sm:h-20 sm:w-28">
                  <Image
                    src={story.image}
                    alt=""
                    width={150}
                    height={100}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="line-clamp-3 text-[13px] font-bold leading-tight text-slate-900 group-hover:text-[#b38716] transition-colors">
                  {story.title}
                </h4>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Right Column: Service Utility Hub */}
      <aside className="flex flex-col gap-4">
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-50">
          {/* Hub Header */}
          <div className="bg-slate-900 px-5 py-4 text-center">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">
              Hub & Services
            </h4>
            <p className="text-[13px] font-bold text-white mt-0.5">
              প্রয়োজনীয় লিংক ও সেবা
            </p>
          </div>

          <div className="flex flex-col p-2 gap-2">
            {utilitySections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${section.color} transition-all`}
                >
                  <span className="text-[13px] font-black tracking-tight">
                    {section.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 px-1 mb-2">
                  {section.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      href={link.href}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg text-[12.5px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                    >
                      <span className="line-clamp-1">{link.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Hub Footer */}
          <div className="border-t border-slate-50 bg-slate-50/50 p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400">
              আপডেট পেতে সাথে থাকুন
            </p>
          </div>
        </div>

        {/* Small Ad Slot at the bottom of Hub */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-inner flex flex-col items-center justify-center min-h-[100px] group transition-all hover:bg-white hover:shadow-md">
          <span className="absolute top-2 right-3 text-[8px] font-black uppercase tracking-widest text-slate-300">
            Space available
          </span>
          <p className="text-[10px] font-bold text-slate-400">
            বিজ্ঞাপন দিতে যোগাযোগ করুন
          </p>
        </div>
      </aside>
    </section>
  );
}
