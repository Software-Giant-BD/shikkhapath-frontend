import { AuthorProfileClient } from "@/components/customer/author/profile-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Profile | Shikkhapath",
};

export default function AuthorProfilePage() {
  return <AuthorProfileClient />;
}
