import { Metadata } from "next";
import { EventsClient } from "@/components/customer/university-events/events-client";

export const metadata: Metadata = {
  title: "University Events & Admission Seminars Calendar",
  description: "Browse the latest University events including Admission tests, Tech Olympiads, Seminars, and workshops via organized List and Calendar views.",
};

export default function UniversityEventsPage() {
  return <EventsClient />;
}
