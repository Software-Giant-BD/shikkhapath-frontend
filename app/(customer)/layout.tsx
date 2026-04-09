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
  description:
    "A modern, component-based company website for Shikkhapath.",
};

import { SiteHeader } from "@/components/customer/common/site-header";
import { SiteFooter } from "@/components/customer/common/footer-sections";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${sourceSerif.variable} antialiased`}>
        <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
