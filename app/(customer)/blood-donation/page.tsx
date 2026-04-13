import { BloodDonationClient } from "@/components/customer/blood-donation/blood-donation-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Donation Service | Shikkhapath",
  description: "Emergency blood donation network connecting donors with those in need.",
};

export default function BloodDonationPage() {
  return <BloodDonationClient />;
}
