import { redirect } from "next/navigation";

import { PageHeader } from "@/components/admin/ui/page-header";
import { getProfile } from "@/lib/api/profile";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Admin Profile | Shikkhapath",
  description: "Manage your admin account profile and security settings.",
};

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div className="w-full space-y-8 px-4 py-6 md:px-6 lg:px-8">
      <PageHeader
        title="Account Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Profile" }
        ]}
      />

      <div className="mx-auto max-w-6xl">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
