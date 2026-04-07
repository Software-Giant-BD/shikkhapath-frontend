import Link from "next/link";
import { List } from "lucide-react";

import { RoleForm } from "@/components/admin/roles/RoleForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function AddRolePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Add Role"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Roles", href: "/admin/roles/list" },
          { label: "Add" },
        ]}
        action={(
          <Link href="/admin/roles/list">
            <Button variant="secondary">
              <List size={16} />
              Role List
            </Button>
          </Link>
        )}
      />

      <RoleForm mode="add" />
    </div>
  );
}
