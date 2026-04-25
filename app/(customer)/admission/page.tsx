import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { AdmissionClient } from "@/components/customer/admission/admission-client";

export const metadata: Metadata = {
  title: "Latest University Admission Info | Smart Eligibility Check",
  description: "Check the latest university admission timelines, examine entry requirements, and utilize our automated smart checker to determine which subjects you can apply for seamlessly.",
};

export default function AdmissionPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="Admission Ad"
        />
      </div>
      <AdmissionClient />
    </>
  );
}
