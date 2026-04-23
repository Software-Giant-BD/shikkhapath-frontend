import { AdBanner } from "@/components/customer/home/ad-banner";
import { FireServiceClient } from "@/components/customer/fire-service/fire-service-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fire Service Directory | Shikkhapath",
  description: "Locate and contact your nearest fire station instantly across Bangladesh. Emergency response directory.",
};

export default function FireServicePage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৯০ ]" className="h-[90px]" category="services pages" placement="Fire Ad" />
      </div>
      <FireServiceClient />
    </>
  );
}
