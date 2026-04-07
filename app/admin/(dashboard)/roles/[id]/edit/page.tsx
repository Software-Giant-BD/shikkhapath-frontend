import { notFound } from "next/navigation";
import Link from "next/link";
import { List } from "lucide-react";

import { RoleForm } from "@/components/admin/roles/RoleForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getRoleById } from "@/lib/api/roles";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getRoleById(id);

  if (!role) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Edit Role"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Roles", href: "/admin/roles/list" },
          { label: "Edit" },
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

      <RoleForm
        mode="edit"
        roleId={id}
        initialValues={{
          name: role.name,
          permission_ids_csv: role.permission_ids.join(", "),
        }}
      />
    </div>
  );
}
