import { AdBanner } from "@/components/customer/home/ad-banner";
import { BloodDonationClient } from "@/components/customer/blood-donation/blood-donation-client";
import { Metadata } from "next";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: "Blood Donation Service | Shikkhapath",
  description:
    "Emergency blood donation network connecting donors with those in need.",
};

export default async function BloodDonationPage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/blood-donation`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Blood Donation Service",
    provider: getNewsMediaOrganizationSchema(),
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    description:
      "Emergency blood donation network connecting donors with those in need.",
    name: "Shikkhapath Blood Donation Service",
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
        name: "Blood Donation",
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
          placement="Blood Ad"
        />
      </div>
      <BloodDonationClient />
    </>
  );
}

