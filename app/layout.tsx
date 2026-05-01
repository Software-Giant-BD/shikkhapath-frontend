import type { Metadata } from "next";
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "@/app/globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "Shikkhapath",
  description:
    "Shikkhapath-Modern News Portal is a cutting-edge news platform built with Next.js, designed to deliver the latest news and updates in a sleek and user-friendly interface. With its modern design and seamless navigation, Shikkhapath offers an engaging experience for users seeking up-to-date information on various topics. Stay informed with Shikkhapath's comprehensive coverage and intuitive features.z",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} ${notoSerifBengali.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
