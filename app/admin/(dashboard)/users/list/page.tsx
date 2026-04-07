import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getUsers } from "@/lib/api/users";

function formatBoolean(value: boolean, trueLabel: string, falseLabel: string) {
  return value ? trueLabel : falseLabel;
}

export default async function UsersListPage() {
  const users = await getUsers();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Users"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Users" }]}
        action={(
          <Link href="/admin/users/add">
            <Button>
              <Plus size={16} />
              Add User
            </Button>
          </Link>
        )}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-270 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Manage News</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-slate-600">#{user.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{user.role_name || user.role_id || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{formatBoolean(user.is_active, "Active", "Inactive")}</td>
                    <td className="px-6 py-4 text-slate-600">{formatBoolean(user.can_manage_news, "Yes", "No")}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={8}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
