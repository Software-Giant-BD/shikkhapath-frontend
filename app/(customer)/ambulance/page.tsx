import { Metadata } from "next";
import { AmbulancePageClient } from "@/components/customer/ambulance/ambulance-page-client";

export const metadata: Metadata = {
  title: "Ambulance Service | Shikkhapath",
  description: "Instant emergency ambulance services across Bangladesh. 24/7 support, verified providers, and quick click-to-call functionality.",
  keywords: ["ambulance", "emergency", "medical", "bangladesh", "dhaka", "patient transport"],
};

export default function AmbulancePage() {
  return <AmbulancePageClient />;
}
