import { DoctorClient } from "@/components/customer/doctors/doctor-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Appointment Service | Shikkhapath",
  description: "Access the best medical professionals in Bangladesh. Book appointments instantly and consult with verified specialists.",
};

export default function DoctorPage() {
  return <DoctorClient />;
}
