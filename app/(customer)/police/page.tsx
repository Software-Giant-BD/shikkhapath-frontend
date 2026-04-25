import { AdBanner } from "@/components/customer/home/ad-banner";
import { PoliceServiceClient } from "@/components/customer/police-stations/police-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Police Station Directory | Shikkhapath",
  description: "Locate and contact any police station in Bangladesh instantly for security and assistance.",
};

export default function PoliceServicePage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="Police Ad"
        />
      </div>
      <PoliceServiceClient />
    </>
  );
}
