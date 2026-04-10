import type { Metadata } from "next"

import { SiteFooter } from "@/components/customer/common/footer-sections"
import { SiteHeader } from "@/components/customer/common/site-header"
import { BreakingTicker } from "@/components/customer/home/breaking-ticker"
import { HeroSection } from "@/components/customer/home/hero-section"
import { AdBanner } from "@/components/customer/home/ad-banner"
import { type NewsSectionKey } from "@/components/customer/home/home-content.data"
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
  const primarySections: NewsSectionKey[] = ["education", "admission", "national"]
  const compactSectionRows: [NewsSectionKey, NewsSectionKey][] = [
    ["sports", "economy"],
    ["science", "international"],
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "শিক্ষাপথ",
    url: "https://shikkhapath.news",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          className="my-4"
          heightClass="h-24 sm:h-28"
        />
        <BreakingTicker />

        <HeroSection />

        {primarySections.map((section) => (
          <NewsSectionBlock key={section} section={section} />
        ))}

        <VideoSectionBlock />
        {compactSectionRows.slice(0, 1).map((row, index) => (
          <div key={`compact-top-${index}`} className="mt-5 grid gap-4 md:grid-cols-2">
            {row.map((section) => (
              <NewsSectionBlock key={section} section={section} compact />
            ))}
          </div>
        ))}

        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৬০ ]" />

        <TabSectionBlock />

        <NewsSectionBlock section="career" />

        {compactSectionRows.slice(1).map((row, index) => (
          <div key={`compact-bottom-${index}`} className="mt-5 grid gap-4 md:grid-cols-2">
            {row.map((section) => (
              <NewsSectionBlock key={section} section={section} compact />
            ))}
          </div>
        ))}

        <NewsletterSection />
      </main>
    </>
  )
}
