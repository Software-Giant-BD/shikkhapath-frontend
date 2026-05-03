import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { CgpaCalculatorClient } from "@/components/customer/tools/cgpa-calculator-client";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: "CGPA Calculator | Shikkhapath Tools",
  description:
    "Calculate your university or college CGPA instantly. Add unlimited subjects, input your credits and grades, and get a highly accurate real-time result.",
  keywords: [
    "cgpa calculator",
    "gpa calculator",
    "university gpa",
    "grading system",
    "bangladesh cgpa calculator",
    "student tools",
  ],
};

export default async function CgpaCalculatorPage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/cgpa-calculator`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shikkhapath CGPA Calculator",
    operatingSystem: "Any",
    applicationCategory: "EducationalApplication",
    description:
      "Calculate your university or college CGPA instantly. Add unlimited subjects, input your credits and grades, and get a highly accurate real-time result.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    publisher: getNewsMediaOrganizationSchema(),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "CGPA Calculator",
        item: currentUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="CGPA Calculator Ad"
        />
      </div>
      <CgpaCalculatorClient />
    </>
  );
}

