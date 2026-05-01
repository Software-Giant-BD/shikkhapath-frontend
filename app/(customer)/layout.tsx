import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Shikkhapath | আধুনিক শিক্ষা ও ক্যারিয়ারের ঠিকানা",
  description:
    "শিক্ষা ও ভর্তি পরীক্ষার সর্বশেষ আপডেট, ক্যারিয়ার গঠন এবং দেশ-বিদেশের সব খবর পেতে ভিজিট করুন শিক্ষাপথ। সঠিক বিশ্লেষণ ও নির্ভুল তথ্যই আমাদের মূল লক্ষ্য।",
  keywords: [
    "শিক্ষা",
    "ভর্তি পরীক্ষা",
    "ক্যারিয়ার",
    "দেশ-বিদেশের খবর",
    "শিক্ষা সংবাদ",
    "ক্যারিয়ার গাইডলাইন",
    "ভর্তি সার্কুলার",
    "সরকারি চাকরি",
    "বাংলা নিউজ পোর্টাল",
    "Shikkhapath",
    "Shikkhapath news",
    "Shikkhapath admission",
    "Shikkhapath career",
    "Shikkhapath education",
    "Shikkhapath news today",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { SiteHeader } from "@/components/customer/common/site-header";
import { SiteFooter } from "@/components/customer/common/footer-sections";
import { getMenuCategories } from "@/lib/api/categories";
import { CanonicalUrl } from "@/components/seo/canonical-url";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getMenuCategories();

  const menuCategoryLinks = categories
    .sort((a, b) => Number(a.sort_order || "0") - Number(b.sort_order || "0"))
    .map((category) => ({
      label: category.title,
      href: `/category/${category.slug}`,
      hasDropdown: (category.children_count ?? 0) > 0,
    }));

  const navLinks = menuCategoryLinks;

  return (
    <>
      <CanonicalUrl />
      <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
        <SiteHeader navLinks={navLinks} />
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
