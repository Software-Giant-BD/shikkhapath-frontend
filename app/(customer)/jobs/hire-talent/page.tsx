import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { JobsPageClient } from "@/components/customer/jobs/jobs-page-client";

export const metadata: Metadata = {
  title: "Hire Talent | Shikkhapath",
  description: "Browse through profiles of talented professionals actively looking for their next big opportunity.",
};

export default function HireTalentPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="Jobs Ad"
        />
      </div>
      <JobsPageClient />
    </>
  );
}
