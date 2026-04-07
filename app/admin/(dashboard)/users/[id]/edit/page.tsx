import { notFound } from "next/navigation";
import Link from "next/link";
import { List } from "lucide-react";

import { UserForm } from "@/components/admin/users/UserForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getRoles } from "@/lib/api/roles";
import { getUserById } from "@/lib/api/users";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, roles] = await Promise.all([getUserById(id), getRoles()]);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Users", href: "/admin/users/list" },
          { label: "Edit" },
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
        mode="edit"
        userId={id}
        roleOptions={roles.map((role) => ({ id: role.id, name: role.name }))}
        initialValues={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          role_id: user.role_id,
          is_active: user.is_active ? "1" : "0",
          can_manage_news: user.can_manage_news ? "1" : "0",
          password: "",
        }}
      />
    </div>
  );
}
