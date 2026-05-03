import { Metadata } from "next";
import { PrayerTimesClient } from "@/components/customer/tools/prayer-times-client";
import { getMenuCategories } from "@/lib/api/categories";
import {
  getNewsMediaOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/constants/seo";

export const metadata: Metadata = {
  title:
    "বাংলাদেশের সকল জেলার নামাজের সময়সূচী - প্রতিদিনের আপডেট | Shikkhapath",
  description:
    "ঢাকা ও চট্টগ্রামসহ বাংলাদেশের সকল জেলার আজকের নামাজের সঠিক সময়সূচী (ফজর, জোহর, আসর, মাগরিব ও এশা) জানুন। আমাদের অটো-আপডেটিং ক্যালেন্ডারে প্রতিদিনের সঠিক তথ্য পান।",
  keywords: [
    "namaz time",
    "prayer time",
    "bangladesh namaz",
    "salat time dhaka",
    "fajr time",
    "maghrib time",
    "islamic schedule bangladesh",
    "আজকের নামাজের সময়সূচী",
    "নামাজের সময়সূচী ঢাকা",
    "নামাজের সময়সূচী চট্টগ্রাম",
    "নামাজের সময়সূচী খুলনা",
    "নামাজের সময়সূচী সিলেট",
    "আজকের নামাজের সময়সূচী",
    "আজকের নামাজের শুরু ও শেষ সময়",
    "ফজর শুরু",
    "ফজর শেষ",
    "জোহর শুরু",
    "জোহর শেষ",
    "আসর শুরু",
    "আসর শেষ",
    "মাগরিব শুরু",
    "মাগরিব শেষ",
    "ইশা শুরু",
    "ইশা শেষ",
  ],
};

export default async function PrayerTimesPage() {
  const [menuCategories] = await Promise.all([getMenuCategories()]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const currentUrl = `${siteUrl}/namaz-time`;

  const webSiteSchema = {
    "@context": "https://schema.org",
    ...getWebSiteSchema(menuCategories),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "আজকের নামাজের সময়সূচী - Shikkhapath",
    operatingSystem: "Any",
    applicationCategory: "LifestyleApplication",
    description:
      "ঢাকা ও চট্টগ্রামসহ বাংলাদেশের সকল জেলার আজকের নামাজের সঠিক সময়সূচী (ফজর, জোহর, আসর, মাগরিব ও এশা) জানুন।",
    keywords: Array.isArray(metadata.keywords)
      ? metadata.keywords.join(", ")
      : metadata.keywords,
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
        name: "নামাজের সময়সূচী",
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
      <PrayerTimesClient />
    </>
  );
}
