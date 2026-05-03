import { AdBanner } from "@/components/customer/home/ad-banner";
import { PoliceServiceClient } from "@/components/customer/police-stations/police-client";
import { Metadata } from "next";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: "Police Station Directory | Shikkhapath",
  description:
    "Locate and contact any police station in Bangladesh instantly for security and assistance.",
};

export default async function PoliceServicePage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/police`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Police Station Directory Service",
    provider: getNewsMediaOrganizationSchema(),
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    description:
      "Locate and contact any police station in Bangladesh instantly for security and assistance.",
    name: "Shikkhapath Police Station Directory",
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
        name: "Police Service",
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
          placement="Police Ad"
        />
      </div>
      <PoliceServiceClient />
    </>
  );
}

