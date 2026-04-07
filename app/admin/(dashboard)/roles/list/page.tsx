import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";

const roles = [
  { id: 1, name: "Super Admin", usersCount: 1, status: "Active" },
  { id: 2, name: "Content Manager", usersCount: 4, status: "Active" },
  { id: 3, name: "Editor", usersCount: 7, status: "Active" },
  { id: 4, name: "Viewer", usersCount: 3, status: "Inactive" },
];

export default function RolesListPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Roles"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Roles" }]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Role Name</th>
                  <th className="px-6 py-4 font-semibold">Assigned Users</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-slate-600">#{role.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{role.name}</td>
                    <td className="px-6 py-4 text-slate-600">{role.usersCount}</td>
                    <td className="px-6 py-4 text-slate-600">{role.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
