import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { JobsPageClient } from "@/components/customer/jobs/jobs-page-client";

export const metadata: Metadata = {
  title: "Jobs | Shikkhapath",
  description: "Browse the latest government, private, NGO, and freelance jobs in Bangladesh.",
};

export default function JobsPage() {
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
