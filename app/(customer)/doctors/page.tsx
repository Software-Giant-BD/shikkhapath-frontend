import { AdBanner } from "@/components/customer/home/ad-banner";
import { DoctorClient } from "@/components/customer/doctors/doctor-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Appointment Service | Shikkhapath",
  description: "Access the best medical professionals in Bangladesh. Book appointments instantly and consult with verified specialists.",
};

export default function DoctorPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <AdBanner label="[ বিজ্ঞাপন — ৯৭০×৯০ ]" className="h-[90px]" category="services pages" placement="Doctor Ad" />
      </div>
      <DoctorClient />
    </>
  );
}
