import { Metadata } from "next";
import { TrainScheduleClient } from "@/components/customer/trains/train-schedule-client";

export const metadata: Metadata = {
  title: "Train Schedule & Routes | Shikkhapath",
  description: "Check Bangladesh Railway train schedules, timing, and routes. Verified intercity and mail train information for your next journey.",
  keywords: ["train schedule", "bangladesh railway", "train timing", "dhaka to chattogram train", "railway routes", "intercity trains"],
};

export default function TrainSchedulePage() {
  return <TrainScheduleClient />;
}
