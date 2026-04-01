import type { Metadata } from "next"
import Link from "next/link"

import { SiteFooter } from "@/components/customer/common/footer-sections"
import { SiteHeader } from "@/components/customer/common/site-header"

const featuredStory = {
  title: "Education Budget 2026 Prioritizes Public University Research and Student Aid",
  excerpt:
    "The latest budget framework introduces a larger grant pool for public universities, expanded digital classrooms, and performance-based scholarships for rural learners.",
  category: "Top Story",
  publishedAt: "April 1, 2026",
  readTime: "6 min read",
}

const topHeadlines = [
  {
    title: "National curriculum board confirms competency-based exams from next session",
    category: "Education",
    readTime: "4 min",
  },
  {
    title: "Dhaka campus innovation fair draws record participation from 42 universities",
    category: "Campus",
    readTime: "3 min",
  },
  {
    title: "Career readiness programs now mandatory in final-year undergraduate courses",
    category: "Career",
    readTime: "5 min",
  },
]

const latestNews = [
  "Public libraries begin free evening coding sessions for college students",
  "Higher Education Council launches national internship placement tracker",
  "Teachers' federation requests fast-track recruitment for science faculties",
  "New data shows 18% rise in women enrollment in engineering departments",
  "Regional campus transport support expanded for low-income students",
]

const categoryBlocks = [
  {
    name: "National",
    story: "University autonomy bill reaches final review in parliament",
    summary: "Policy analysts expect stronger governance and transparent research funding.",
  },
  {
    name: "Campus",
    story: "Student journalists network launches verification desk for local reports",
    summary: "The initiative aims to improve fact-checking skills and responsible reporting.",
  },
  {
    name: "International",
    story: "South Asian education summit outlines cross-border scholarship roadmap",
    summary: "Delegates highlight mobility, shared credits, and digital credential standards.",
  },
]

export const metadata: Metadata = {
  title: "Shikkhapath News | Education, Campus & National Headlines",
  description:
    "Modern Bangla-first news portal homepage with breaking updates, featured stories, category coverage, and student-focused reporting.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shikkhapath News",
    description:
      "Follow trusted coverage on education, campus, career, and national developments.",
    type: "website",
    url: "/",
    siteName: "Shikkhapath News",
  },
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Shikkhapath News",
    url: "https://shikkhapath.news",
    publishingPrinciples: "https://shikkhapath.news/editorial-policy",
  }

  return (
    <div className="ase-page">
      <SiteHeader />
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-4 lg:px-5 lg:py-8">
        <script
          type="application/ld+json"
          // JSON-LD helps search engines understand the site as a news publisher.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-3 shadow-sm backdrop-blur sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="inline-flex w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase">
              Breaking
            </span>
            <p className="text-sm text-slate-700 sm:text-base">
              Admission guidance portal opens for HSC graduates; application deadline extended to April 15.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/65">
            <div className="h-64 bg-[linear-gradient(125deg,#15445d_0%,#2d7389_58%,#e2af44_100%)] sm:h-80" />
            <div className="space-y-4 p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-white">{featuredStory.category}</span>
                <span>{featuredStory.publishedAt}</span>
                <span>{featuredStory.readTime}</span>
              </div>
              <h1 className="text-3xl leading-tight font-bold text-slate-900 sm:text-4xl">
                <Link href="/news/education-budget-2026" className="hover:text-[#b38716]">
                  {featuredStory.title}
                </Link>
              </h1>
              <p className="max-w-3xl text-slate-700 sm:text-lg">{featuredStory.excerpt}</p>
            </div>
          </article>

          <aside className="space-y-4">
            {topHeadlines.map((headline) => (
              <article
                key={headline.title}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 transition-colors hover:border-[#d4a727]"
              >
                <p className="text-xs font-semibold tracking-wide text-[#b38716] uppercase">{headline.category}</p>
                <h2 className="mt-2 text-lg leading-tight font-semibold text-slate-900">
                  <Link href="/news" className="hover:text-[#b38716]">
                    {headline.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-slate-500">{headline.readTime} read</p>
              </article>
            ))}
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Latest News</h2>
              <Link href="/news" className="text-sm font-semibold text-[#b38716] hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-200/90">
              {latestNews.map((item, index) => (
                <li key={item} className="py-3">
                  <Link href="/news" className="group flex items-start gap-3">
                    <span className="mt-1 text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm leading-relaxed text-slate-800 transition-colors group-hover:text-[#b38716] sm:text-base">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <article className="rounded-3xl border border-slate-200 bg-[linear-gradient(165deg,#1f1f1f,#363636_65%,#b38716)] p-5 text-white shadow-xl shadow-slate-300/50 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.15em] text-amber-200 uppercase">Editor&apos;s Note</p>
            <h2 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">
              Building an informed student generation needs credible education journalism.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-100 sm:text-base">
              Shikkhapath focuses on verified campus reporting, policy analysis, and practical opportunities so learners can
              make better academic and career decisions.
            </p>
            <Link
              href="/about"
                className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#7f5f0e] transition-colors hover:bg-slate-100"
            >
              Read Editorial Policy
            </Link>
          </article>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {categoryBlocks.map((block) => (
            <article key={block.name} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#b38716] uppercase">{block.name}</p>
              <h3 className="mt-2 text-xl leading-tight font-bold text-slate-900">
                <Link href="/news" className="hover:text-[#b38716]">
                  {block.story}
                </Link>
              </h3>
              <p className="mt-3 text-sm text-slate-700">{block.summary}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-[#d6ab30] bg-[linear-gradient(180deg,#fff8e7_0%,#fffdf7_100%)] p-6 sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-[#b38716] uppercase">Daily Brief</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Get morning headlines in your inbox</h2>
              <p className="mt-2 text-slate-700">A concise digest of top education, campus, and career stories every day at 8:00 AM.</p>
            </div>
            <form className="flex w-full max-w-sm flex-col gap-3 sm:flex-row" action="#" method="post">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="name@email.com"
                className="h-11 flex-1 rounded-full border border-slate-300 bg-white px-4 text-sm outline-none ring-0 transition focus:border-[#c79a1d]"
              />
              <button
                type="submit"
                className="h-11 rounded-full bg-[#c79a1d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b38716]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
