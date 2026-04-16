import { Metadata } from "next";
import { PrayerTimesClient } from "@/components/customer/tools/prayer-times-client";

export const metadata: Metadata = {
  title: "Namaz Time in Bangladesh | Prayer Schedule",
  description: "Get accurate, location-based Namaz timings (Fajr, Dhuhr, Asr, Maghrib, Isha) for all major districts in Bangladesh with an automatic daily updating prayer schedule.",
  keywords: ["namaz time", "prayer time", "bangladesh namaz", "salat time dhaka", "fajr time", "maghrib time", "islamic schedule bangladesh"],
};

export default function PrayerTimesPage() {
  return <PrayerTimesClient />;
}
