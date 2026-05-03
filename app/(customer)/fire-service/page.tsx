import { AdBanner } from "@/components/customer/home/ad-banner";
import { FireServiceClient } from "@/components/customer/fire-service/fire-client";
import { Metadata } from "next";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: "Fire Station Directory | Shikkhapath",
  description:
    "Locate and contact any fire station in Bangladesh instantly for emergency fire service and assistance.",
};

export default async function FireServicePage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/fire-service`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Fire Station Directory Service",
    provider: getNewsMediaOrganizationSchema(),
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    description:
      "Locate and contact any fire station in Bangladesh instantly for emergency fire service and assistance.",
    name: "Shikkhapath Fire Station Directory",
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
        name: "Fire Service",
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
          placement="Fire Ad"
        />
      </div>
      <FireServiceClient />
    </>
  );
}

