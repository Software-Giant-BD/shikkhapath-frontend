import { AdBanner } from "@/components/customer/home/ad-banner";
import { FireServiceClient } from "@/components/customer/fire-service/fire-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fire Station Directory | Shikkhapath",
  description: "Locate and contact any fire station in Bangladesh instantly for emergency fire service and assistance.",
};

export default function FireServicePage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="Fire Ad"
        />
      </div>
      <FireServiceClient />
    </>
  );
}
