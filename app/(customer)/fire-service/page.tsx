import { FireServiceClient } from "@/components/customer/fire-service/fire-service-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fire Service Directory | Shikkhapath",
  description: "Locate and contact your nearest fire station instantly across Bangladesh. Emergency response directory.",
};

export default function FireServicePage() {
  return <FireServiceClient />;
}
