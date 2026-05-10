export const dynamic = "force-dynamic";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AdminShell } from "@/components/admin/layout/AdminShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getProfile } from "@/lib/api/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <AdminShell profile={profile}>{children}</AdminShell>
    </div>
  );
}
