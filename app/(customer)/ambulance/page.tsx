import { Metadata } from "next";
import { AmbulancePageClient } from "@/components/customer/ambulance/ambulance-page-client";
import { AdBanner } from "@/components/customer/home/ad-banner";

export const metadata: Metadata = {
  title: "Ambulance Service | Shikkhapath",
  description: "Instant emergency ambulance services across Bangladesh. 24/7 support, verified providers, and quick click-to-call functionality.",
  keywords: ["ambulance", "emergency", "medical", "bangladesh", "dhaka", "patient transport"],
};

export default function AmbulancePage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="Ambulance Ad"
        />
      </div>
      <AmbulancePageClient />
    </>
  );
}
