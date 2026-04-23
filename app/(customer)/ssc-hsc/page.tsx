import { AdBanner } from "@/components/customer/home/ad-banner";
import { Metadata } from "next";
import { SscHscClient } from "@/components/customer/ssc-hsc/ssc-hsc-client";

export const metadata: Metadata = {
  title: "SSC & HSC (Routine & Result) | Shikkhapath",
  description: "Check the latest Bangladesh board SSC and HSC examination routines, class schedules, and search for your official grades and GPA results instantly.",
};

export default function SscHscPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৯০ ]" className="h-[90px]" category="services pages" placement="SSC/HSC (রুটিন | রেজাল্ট) Ad" />
      </div>
      <SscHscClient />
    </>
  );
}
