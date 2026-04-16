import { Metadata } from "next";
import { AdmissionClient } from "@/components/customer/admission/admission-client";

export const metadata: Metadata = {
  title: "Latest University Admission Info | Smart Eligibility Check",
  description: "Check the latest university admission timelines, examine entry requirements, and utilize our automated smart checker to determine which subjects you can apply for seamlessly.",
};

export default function AdmissionPage() {
  return <AdmissionClient />;
}
