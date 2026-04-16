import { Metadata } from "next";
import { SscHscClient } from "@/components/customer/ssc-hsc/ssc-hsc-client";

export const metadata: Metadata = {
  title: "SSC & HSC (Routine & Result) | Shikkhapath",
  description: "Check the latest Bangladesh board SSC and HSC examination routines, class schedules, and search for your official grades and GPA results instantly.",
};

export default function SscHscPage() {
  return <SscHscClient />;
}
