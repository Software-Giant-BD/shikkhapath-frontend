import { Metadata } from "next";
import { CampusClient } from "@/components/customer/campus/campus-client";

export const metadata: Metadata = {
  title: "Campus Connect | Education & Institution News | Shikkhapath",
  description: "Get the latest news and updates from Schools, Colleges, and Universities across Bangladesh. Exclusive admission circulars, results, and campus achievements.",
  alternates: {
    canonical: "/campus",
  },
};

export default function CampusPage() {
  return <CampusClient />;
}
