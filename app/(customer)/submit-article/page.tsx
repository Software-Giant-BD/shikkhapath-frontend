import { SubmitArticleClient } from "@/components/customer/articles/submit-article-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write & Submit Article | Shikkhapath",
  description: "Share your knowledge and write an article for Shikkhapath. Join our community of educators and writers.",
};

export default function SubmitArticlePage() {
  return <SubmitArticleClient />;
}
