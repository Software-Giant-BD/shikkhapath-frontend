import { Metadata } from "next";
import { PrayerTimesClient } from "@/components/customer/tools/prayer-times-client";

export const metadata: Metadata = {
  title:
    "বাংলাদেশের সকল জেলার নামাজের সময়সূচী - প্রতিদিনের আপডেট | Shikkhapath",
  description:
    "ঢাকা ও চট্টগ্রামসহ বাংলাদেশের সকল জেলার আজকের নামাজের সঠিক সময়সূচী (ফজর, জোহর, আসর, মাগরিব ও এশা) জানুন। আমাদের অটো-আপডেটিং ক্যালেন্ডারে প্রতিদিনের সঠিক তথ্য পান।",
  keywords: [
    "namaz time",
    "prayer time",
    "bangladesh namaz",
    "salat time dhaka",
    "fajr time",
    "maghrib time",
    "islamic schedule bangladesh",
    "আজকের নামাজের সময়সূচী",
    "নামাজের সময়সূচী ঢাকা",
    "নামাজের সময়সূচী চট্টগ্রাম",
    "নামাজের সময়সূচী খুলনা",
    "নামাজের সময়সূচী সিলেট",
    "আজকের নামাজের সময়সূচী",
    "আজকের নামাজের শুরু ও শেষ সময়",
    "ফজর শুরু",
    "ফজর শেষ",
    "জোহর শুরু",
    "জোহর শেষ",
    "আসর শুরু",
    "আসর শেষ",
    "মাগরিব শুরু",
    "মাগরিব শেষ",
    "ইশা শুরু",
    "ইশা শেষ",
  ],
};

export default function PrayerTimesPage() {
  return <PrayerTimesClient />;
}
