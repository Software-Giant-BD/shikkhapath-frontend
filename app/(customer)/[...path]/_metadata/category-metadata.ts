import type { Metadata } from "next";
import { CategoryPageResponse } from "@/lib/api/news";

export function getCategoryMetadata(
  data: CategoryPageResponse,
  path: string[]
): Metadata {
  const { category } = data;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";

  return {
    title: category.meta_title || `${category.title} | ${siteName}`,
    description:
      category.meta_description ||
      `${category.title} বিভাগের সকল খবর সবার আগে পেতে ভিজিট করুন ${siteName}।`,
    keywords: category.meta_keywords
      ? category.meta_keywords.split(",").map((k) => k.trim())
      : [category.title, siteName],
    openGraph: {
      title: category.meta_title || `${category.title} | ${siteName}`,
      description:
        category.meta_description || `${category.title} বিভাগের সর্বশেষ আপডেট।`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${path.join("/")}`,
      siteName: siteName,
      type: "website",
    },
  };
}
