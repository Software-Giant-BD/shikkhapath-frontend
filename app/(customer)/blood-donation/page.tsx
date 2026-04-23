import { AdBanner } from "@/components/customer/home/ad-banner";
import { BloodDonationClient } from "@/components/customer/blood-donation/blood-donation-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Donation Service | Shikkhapath",
  description: "Emergency blood donation network connecting donors with those in need.",
};

export default function BloodDonationPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৯০ ]" className="h-[90px]" category="services pages" placement="Blood Ad" />
      </div>
      <BloodDonationClient />
    </>
  );
}
