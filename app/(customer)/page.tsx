import type { Metadata } from "next"

import { HeroSection } from "@/components/customer/home/hero-section"
import { AdBanner } from "@/components/customer/home/ad-banner"
import { SECTION_DATA, type NewsSectionKey } from "@/components/customer/home/home-content.data"
import { NewsSectionBlock } from "@/components/customer/home/news-section-block"
import { TabSectionBlock } from "@/components/customer/home/tab-section-block"
import { NewsletterSection } from "@/components/customer/home/newsletter-section"
import { VideoSectionBlock } from "@/components/customer/home/video-section-block"
import { getCategories } from "@/lib/api/categories"

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

const FALLBACK_HOME_SECTIONS: NewsSectionKey[] = [
  "education",
  "admission",
  "national",
  "sports",
  "economy",
  "career",
  "science",
  "international",
]

export default async function Home() {
  const categories = await getCategories()

  const configuredSections = categories
    .filter((category) => category.show_on_home)
    .sort((a, b) => Number(a.home_sort_order || "0") - Number(b.home_sort_order || "0"))
    .map((category) => category.slug)
    .filter((slug): slug is NewsSectionKey => slug in SECTION_DATA)

  const homeSections = configuredSections.length > 0 ? configuredSections : FALLBACK_HOME_SECTIONS
  const primarySections = homeSections.slice(0, 3)
  const remainingSections = homeSections.slice(3)
  const topCompactSections = remainingSections.slice(0, 2)
  const highlightSection = remainingSections[2] ?? "career"
  const bottomCompactSections = remainingSections.slice(3, 5)

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

        <HeroSection />

        {primarySections.map((section) => (
          <NewsSectionBlock key={section} section={section} />
        ))}

        <VideoSectionBlock />
        {topCompactSections.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {topCompactSections.map((section) => (
              <NewsSectionBlock key={section} section={section} compact />
            ))}
          </div>
        ) : null}

        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৬০ ]" />

        <TabSectionBlock />

        <NewsSectionBlock section={highlightSection} />

        {bottomCompactSections.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {bottomCompactSections.map((section) => (
              <NewsSectionBlock key={section} section={section} compact />
            ))}
          </div>
        ) : null}

        <NewsletterSection />
      </main>
    </>
  )
}
