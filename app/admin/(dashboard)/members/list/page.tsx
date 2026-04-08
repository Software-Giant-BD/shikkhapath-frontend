import {
  Card,
  CardContent,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MembersListPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Members List"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Members" }]}
        action={
          <Link href="/admin/members/add">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Member
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-lg">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Mobile</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    id: 101,
                    name: "Md. Rahim Uddin",
                    email: "rahim.uddin@example.com",
                    mobile: "01710000001",
                    address: "Dhanmondi, Dhaka",
                  },
                  {
                    id: 102,
                    name: "Nusrat Jahan",
                    email: "nusrat.jahan@example.com",
                    mobile: "01710000002",
                    address: "Kotwali, Chattogram",
                  },
                  {
                    id: 103,
                    name: "Siam Ahmed",
                    email: "siam.ahmed@example.com",
                    mobile: "01710000003",
                    address: "Sadar, Rajshahi",
                  },
                  {
                    id: 104,
                    name: "Maliha Noor",
                    email: "maliha.noor@example.com",
                    mobile: "01710000004",
                    address: "Shibganj, Bogura",
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500">#{row.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.email}</td>
                    <td className="px-6 py-4 text-slate-600">{row.mobile}</td>
                    <td className="px-6 py-4 text-slate-600 ">{row.address}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm">
                        Delete
                      </Button>
                    </td>
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
