import { ModerationClient } from "@/components/admin/articles/moderation-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article Moderation | Shikkhapath Admin",
};

export default function ModerationPage() {
  return <ModerationClient />;
}
