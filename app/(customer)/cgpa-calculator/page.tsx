import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { CgpaCalculatorClient } from "@/components/customer/tools/cgpa-calculator-client";

export const metadata: Metadata = {
  title: "CGPA Calculator | Shikkhapath Tools",
  description: "Calculate your university or college CGPA instantly. Add unlimited subjects, input your credits and grades, and get a highly accurate real-time result.",
  keywords: ["cgpa calculator", "gpa calculator", "university gpa", "grading system", "bangladesh cgpa calculator", "student tools"],
};

export default function CgpaCalculatorPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner
          label="[ বিজ্ঞাপন — ৯৭০×৯০ ]"
          heightClass="h-[90px]"
          variant="leaderboard"
          category="services pages"
          placement="CGPA Calculator Ad"
        />
      </div>
      <CgpaCalculatorClient />
    </>
  );
}
