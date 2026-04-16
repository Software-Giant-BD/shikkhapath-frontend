import { Metadata } from "next";
import { JobsPageClient } from "@/components/customer/jobs/jobs-page-client";

export const metadata: Metadata = {
  title: "Jobs | Shikkhapath",
  description: "Browse the latest government, private, NGO, and freelance jobs in Bangladesh.",
};

export default function JobsPage() {
  return <JobsPageClient />;
}
