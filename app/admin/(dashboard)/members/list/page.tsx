import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsListPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
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
                    name: "Wireless Mouse",
                    email: "wireless@gmail.com",
                    mobile: "0161377742",
                    address: "Dharat, Gharinda, Tangail",
                  },
                  {
                    id: 102,
                    name: "Mechanical Keyboard",
                    email: "wireless@gmail.com",

                    mobile: "0161377742",
                    address: "Dharat, Gharinda, Tangail",
                  },
                  {
                    id: 103,
                    name: "Running Sneakers",
                    email: "wireless@gmail.com",

                    mobile: "0161377742",
                    address: "Dharat, Gharinda, Tangail",
                  },
                  {
                    id: 104,
                    name: "Desk Lamp",
                    email: "wireless@gmail.com",

                    mobile: "0161377742",
                    address: "Dharat, Gharinda, Tangail",
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
