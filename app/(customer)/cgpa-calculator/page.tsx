import { Metadata } from "next";
import { CgpaCalculatorClient } from "@/components/customer/tools/cgpa-calculator-client";

export const metadata: Metadata = {
  title: "CGPA Calculator | Shikkhapath Tools",
  description: "Calculate your university or college CGPA instantly. Add unlimited subjects, input your credits and grades, and get a highly accurate real-time result.",
  keywords: ["cgpa calculator", "gpa calculator", "university gpa", "grading system", "bangladesh cgpa calculator", "student tools"],
};

export default function CgpaCalculatorPage() {
  return <CgpaCalculatorClient />;
}
