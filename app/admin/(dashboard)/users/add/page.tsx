import Link from "next/link";
import { List } from "lucide-react";

import { UserForm } from "@/components/admin/users/UserForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getRoles } from "@/lib/api/roles";

export default async function AddUserPage() {
  const roles = await getRoles();

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Add User"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Users", href: "/admin/users/list" },
          { label: "Add" },
        ]}
        action={(
          <Link href="/admin/users/list">
            <Button variant="secondary">
              <List size={16} />
              User List
            </Button>
          </Link>
        )}
      />

      <UserForm
        mode="add"
        roleOptions={roles.map((role) => ({ id: role.id, name: role.name }))}
      />
    </div>
  );
}
