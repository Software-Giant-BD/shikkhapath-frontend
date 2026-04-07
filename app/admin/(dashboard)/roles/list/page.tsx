import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getRoles } from "@/lib/api/roles";

function formatStatus(isActive: boolean) {
  return isActive ? "Active" : "Inactive";
}

export default async function RolesListPage() {
  const roles = await getRoles({ page: 1, per_page: 20 });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Roles"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Roles" }]}
        action={(
          <Link href="/admin/roles/add">
            <Button>
              <Plus size={16} />
              Add Role
            </Button>
          </Link>
        )}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Role Name</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Assigned Users</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-slate-600">#{role.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{role.name}</td>
                    <td className="px-6 py-4 text-slate-600">{role.description || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{role.assigned_user_count}</td>
                    <td className="px-6 py-4 text-slate-600">{formatStatus(role.is_active)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/roles/${role.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {roles.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={6}>
                      No roles found.
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
