import type { Metadata } from "next";
import { SITE_KEYWORDS } from "@/lib/constants/seo";

import { HeroSection } from "@/components/customer/home/hero-section";
import { AdBanner } from "@/components/customer/home/ad-banner";
import { NewsSectionBlock } from "@/components/customer/home/news-section-block";
import { TabSectionBlock } from "@/components/customer/home/tab-section-block";
import { NewsletterSection } from "@/components/customer/home/newsletter-section";
import { VideoSectionBlock } from "@/components/customer/home/video-section-block";
import { LocalNewsSection } from "@/components/customer/home/local-news-section";
import { getAllCategories, getMenuCategories } from "@/lib/api/categories";
import {
  getHomePageCategoryNews,
  type HomePageCategoryNewsSection,
} from "@/lib/api/home-page-category-news";
import {
  getHeroNews,
  getPopularNews,
  getLatestNews,
  getTabNews,
  getVideoNews,
} from "@/lib/api/news";

import { getDivisionsAction } from "@/lib/api/location-actions";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "শিক্ষাপথ";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shikkhapath.com";

export const metadata: Metadata = {
  title: `${SITE_NAME} | শিক্ষা, ক্যাম্পাস ও জাতীয় সংবাদ`,
  description: `${SITE_NAME} — শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ পড়ুন।`,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: "বিশ্বস্ত শিক্ষা ও ক্যাম্পাস সংবাদ পোর্টাল।",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
};

export default async function Home() {
  const [
    categories,
    menuCategories,
    categoryNewsSections,
    heroNews,
    popularNews,
    latestNews,
    tabNews,
    videoNews,
    divisionsRes,
  ] = await Promise.all([
    getAllCategories(),
    getMenuCategories(),
    getHomePageCategoryNews(),
    getHeroNews(),
    getPopularNews(),
    getLatestNews(),
    getTabNews(),
    getVideoNews(),
    getDivisionsAction(),
  ]);

  const divisions = divisionsRes.ok ? divisionsRes.items : [];

  const categoryNewsBySlug = new Map(
    categoryNewsSections
      .filter((section) => section.news.length > 0)
      .map((section) => [section.category.slug, section] as const),
  );

  const configuredSections = categories
    .filter((category) => category.show_on_home)
    .sort(
      (a, b) =>
        Number(a.home_sort_order || "0") - Number(b.home_sort_order || "0"),
    )
    .map((category) => categoryNewsBySlug.get(category.slug))
    .filter((section): section is HomePageCategoryNewsSection =>
      Boolean(section),
    );

  const homeSections =
    configuredSections.length > 0
      ? configuredSections
      : categoryNewsSections.filter((section) => section.news.length > 0);

  const primarySections = homeSections.slice(0, 3);
  const remainingSections = homeSections.slice(3);
  const topCompactSections = remainingSections.slice(0, 2);
  const highlightSection = remainingSections[2] ?? null;
  const bottomCompactSections = remainingSections.slice(3, 5);

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    interactivityType: "mixed",
    name: SITE_NAME,
    headline: `${SITE_NAME} |শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ`,
    keywords: SITE_KEYWORDS.join(", "),
    url: SITE_URL,
    copyrightHolder: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL,
    },
    hasPart: menuCategories.map((category) => ({
      "@type": "WebPage",
      name: category.title,
      url: `${SITE_URL}/category/${category.slug}`,
    })),
  };

  const newsMediaOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NewsMediaOrganization"],
    name: SITE_NAME,
    alternateName: "Shikkhapath",
    foundingDate: "2026-05-01",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    image: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/shikkhapath", // Update with actual links
      "https://x.com/shikkhapath",
      "https://www.youtube.com/@shikkhapath",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801704-052374",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["bn", "en"],
        email: "support@shikkhapath.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "editor@shikkhapath.com",
      }
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Empire Talukder Dream,22–23 Station Road",
      addressLocality: "Tejgaon",
      addressRegion: "Dhaka",
      postalCode: "1215",
      addressCountry: "Bangladesh",
    },
    employee: {
      "@type": "Person",
      name: "Nafis Chonchol",
      jobTitle: "Developer",
      sameAs: ["https://www.facebook.com/nafis.chonchol"],
    },
    publishingPrinciples: [
      `${SITE_URL}/about`,
      `${SITE_URL}/editorial-policy`,
      `${SITE_URL}/privacy`,
    ],
  };

  const BreadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsMediaOrganizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(BreadcrumbListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5">
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">
          {SITE_NAME} | শিক্ষা, ক্যাম্পাস ও জাতীয় সংবাদ
        </h1>

        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          className="my-4"
          heightClass="h-24 sm:h-28"
          category="Home page"
          placement="Top Banner Ad"
        />

        <HeroSection
          data={heroNews}
          popularNews={popularNews}
          latestNews={latestNews}
          videoNews={videoNews}
        />

        {primarySections.map((section) => (
          <NewsSectionBlock key={section.category.id} sectionData={section} />
        ))}

        <VideoSectionBlock data={videoNews} />
        {topCompactSections.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {topCompactSections.map((section) => (
              <NewsSectionBlock
                key={section.category.id}
                sectionData={section}
                compact
              />
            ))}
          </div>
        ) : null}

        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          category="Home page"
          placement="In-Feed / Mid-Page Ad"
          heightClass="h-24 sm:h-32"
        />

        <TabSectionBlock data={tabNews} />

        {highlightSection ? (
          <NewsSectionBlock sectionData={highlightSection} />
        ) : null}

        {bottomCompactSections.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {bottomCompactSections.map((section) => (
              <NewsSectionBlock
                key={section.category.id}
                sectionData={section}
                compact
              />
            ))}
          </div>
        ) : null}

        <LocalNewsSection initialDivisions={divisions} />

        <NewsletterSection />
      </main>
    </>
  );
}
