import Link from "next/link";
import { List } from "lucide-react";

import { AdvertisementForm } from "@/components/admin/advertisements/AdvertisementForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getAdvertisement } from "@/lib/api/advertisements";

export default async function EditAdvertisementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const advertisement = await getAdvertisement(id);

  if (!advertisement) {
    return <div>Advertisement not found</div>;
  }

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Advertisements", href: "/admin/advertisements/list" },
          { label: "Edit" },
        ]}
      />

      <AdvertisementForm
        initialData={advertisement}
        headerTitle="Edit Advertisement"
        headerAction={
          <Link href="/admin/advertisements/list">
            <Button variant="secondary">
              <List size={16} />
              Advertisement List
            </Button>
          </Link>
        }
      />
    </div>
  );
}
