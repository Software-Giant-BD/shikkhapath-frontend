import Link from "next/link";
import { List } from "lucide-react";

import { AdvertisementForm } from "@/components/admin/advertisements/AdvertisementForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function AddAdvertisementPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Advertisements", href: "/admin/advertisements/list" },
          { label: "Add" },
        ]}
      />

      <AdvertisementForm
        headerTitle="Add Advertisement"
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
