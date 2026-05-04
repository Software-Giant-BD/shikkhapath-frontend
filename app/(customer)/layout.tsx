import type { Metadata } from "next";
import { SITE_KEYWORDS } from "@/lib/constants/seo";
import "@/app/globals.css";
import { SiteHeader } from "@/components/customer/common/site-header";
import { SiteFooter } from "@/components/customer/common/footer-sections";
import { getMenuCategories } from "@/lib/api/categories";
import { CanonicalUrl } from "@/components/seo/canonical-url";
import { getPublicSettings } from "@/lib/api/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  return {
    title: settings.site_title || "Shikkhapath",
    description: settings.site_description || "আধুনিক শিক্ষা ও ক্যারিয়ারের ঠিকানা",
    keywords: settings.site_keywords || SITE_KEYWORDS,
    icons: {
      icon: settings.favicon_url || "/favicon.png",
      apple: settings.favicon_url || "/favicon.png",
    },
  };
}

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, settings] = await Promise.all([
    getMenuCategories(),
    getPublicSettings(),
  ]);

  const menuCategoryLinks = categories
    .sort((a, b) => Number(a.sort_order || "0") - Number(b.sort_order || "0"))
    .map((category) => ({
      label: category.title,
      href: `/${category.slug}`,
      hasDropdown: (category.children_count ?? 0) > 0,
    }));

  const navLinks = menuCategoryLinks;

  return (
    <>
      <CanonicalUrl />
      <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
        <SiteHeader 
          navLinks={navLinks} 
          siteLogo={settings.logo_url}
          siteName={settings.site_name}
        />
        {children}
        <SiteFooter 
          settings={settings}
        />
      </div>
    </>
  );
}
