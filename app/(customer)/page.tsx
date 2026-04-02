import type { Metadata } from "next"

import { SiteFooter } from "@/components/customer/common/footer-sections"
import { SiteHeader } from "@/components/customer/common/site-header"
import { BreakingTicker } from "@/components/customer/home/breaking-ticker"
import { HeroSection } from "@/components/customer/home/hero-section"
import { NewsSectionBlock } from "@/components/customer/home/news-section-block"
import { TabSectionBlock } from "@/components/customer/home/tab-section-block"
import { NewsletterSection } from "@/components/customer/home/newsletter-section"
import { VideoSectionBlock } from "@/components/customer/home/video-section-block"

export const metadata: Metadata = {
  title: "শিক্ষাপথ | শিক্ষা, ক্যাম্পাস ও জাতীয় সংবাদ",
  description:
    "শিক্ষাপথ — শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ পড়ুন।",
  alternates: { canonical: "/" },
  openGraph: {
    title: "শিক্ষাপথ",
    description: "বিশ্বস্ত শিক্ষা ও ক্যাম্পাস সংবাদ পোর্টাল।",
    type: "website",
    url: "/",
    siteName: "শিক্ষাপথ",
  },
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "শিক্ষাপথ",
    url: "https://shikkhapath.news",
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <BreakingTicker />

      <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5">
        {/* Banner ad slot */}
        <div className="my-3 flex h-20 items-center justify-center overflow-hidden rounded bg-[#e8e8e8]">
          <span className="text-sm text-slate-400">[ বিজ্ঞাপন — ৯৭০×৯০ ]</span>
        </div>

        <HeroSection />

        {/* শিক্ষাঙ্গন section */}
        <NewsSectionBlock section="education" />

        {/* ভর্তি পরীক্ষা section */}
        <NewsSectionBlock section="admission" />

        {/* ভিডিও section */}
        <VideoSectionBlock />

        {/* জাতীয় section */}
        <NewsSectionBlock section="national" />

        {/* খেলাধুলা + অর্থনীতি side-by-side */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <NewsSectionBlock section="sports" compact />
          <NewsSectionBlock section="economy" compact />
        </div>

        {/* Ad banner */}
        <div className="my-4 flex h-16 items-center justify-center overflow-hidden rounded bg-[#e8e8e8]">
          <span className="text-sm text-slate-400">[ বিজ্ঞাপন — ৯৭০×৬০ ]</span>
        </div>

        {/* Tab section: শিক্ষার খবর / ট্যাবলয়েড / মুক্তমত */}
        <TabSectionBlock />

        {/* কর্মজীবন section */}
        <NewsSectionBlock section="career" />

        {/* মাধ্যম ও বিজ্ঞান + আন্তর্জাতিক side-by-side */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <NewsSectionBlock section="science" compact />
          <NewsSectionBlock section="international" compact />
        </div>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
