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
    <html lang="en">
      <body className={`${sora.variable} ${sourceSerif.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
