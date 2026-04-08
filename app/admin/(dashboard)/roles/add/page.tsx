import Link from "next/link";
import { List } from "lucide-react";

import { RoleForm } from "@/components/admin/roles/RoleForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function AddRolePage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
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
