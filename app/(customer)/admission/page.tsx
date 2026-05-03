import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { AdmissionClient } from "@/components/customer/admission/admission-client";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: "Latest University Admission Info | Smart Eligibility Check",
  description:
    "Check the latest university admission timelines, examine entry requirements, and utilize our automated smart checker to determine which subjects you can apply for seamlessly.",
};

export default async function AdmissionPage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/admission`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "University Admission Information Service",
    provider: getNewsMediaOrganizationSchema(),
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    description:
      "Check the latest university admission timelines, examine entry requirements, and utilize our automated smart checker to determine which subjects you can apply for seamlessly.",
    name: "Shikkhapath University Admission Service",
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
        name: "Admission",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
          placement="Admission Ad"
        />
      </div>
      <AdmissionClient isAdmin={false} />
    </>
  );
}

