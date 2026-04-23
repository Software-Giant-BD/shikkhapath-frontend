import type { Metadata } from "next";
import { Sora, Source_Serif_4 } from "next/font/google";
import "@/app/globals.css";

const sora = Sora({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shikkhapath | Modern News Portal",
  description: "A modern, component-based company website for Shikkhapath.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { SiteHeader } from "@/components/customer/common/site-header";
import { SiteFooter } from "@/components/customer/common/footer-sections";
import { getMenuCategories } from "@/lib/api/categories";
import { AdBanner } from "@/components/customer/home/ad-banner";

export default async function RootLayout({
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
    <html lang="en">
      <body className={`${sora.variable} ${sourceSerif.variable} antialiased`}>
        <div className="min-h-screen bg-[#f5f5f5] text-slate-900 pb-16">
          <SiteHeader navLinks={navLinks} />
          {children}
          <SiteFooter />
          
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] backdrop-blur flex justify-center items-center">
            <AdBanner category="category page" placement="Anchor / Sticky Footer Ad" className="w-full max-w-screen-2xl h-[60px]" label="" heightClass="h-[60px]" />
          </div>
        </div>
      </body>
    </html>
  );
}
