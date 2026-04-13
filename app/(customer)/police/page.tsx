import { PoliceServiceClient } from "@/components/customer/police-stations/police-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Police Station Directory | Shikkhapath",
  description: "Locate and contact any police station in Bangladesh instantly for security and assistance.",
};

export default function PoliceServicePage() {
  return <PoliceServiceClient />;
}
