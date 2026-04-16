import Link from "next/link";
import { Plus } from "lucide-react";
import { getRoutines } from "@/lib/api/ssc-hsc";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function RoutinesListPage() {
  const result = await getRoutines();
  
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Exam Routines"
          breadcrumbs={[
             { label: "Home", href: "/admin" },
             { label: "SSC & HSC" },
             { label: "Routines" }
          ]}
        />
        <Link href="/admin/ssc-hsc/routines/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Routine
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b">
              <tr>
                <th className="p-4 font-bold">Exam</th>
                <th className="p-4 font-bold">Subject</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Time</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.items.map((rt) => (
                <tr key={rt.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                      {rt.exam_type} {rt.year}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{rt.subject_name}</td>
                  <td className="p-4">{rt.exam_date}</td>
                  <td className="p-4">{rt.start_time} - {rt.end_time}</td>
                  <td className="p-4 text-right">
                     {/* Edit link placeholder */}
                     <Link href={`#`} className="text-blue-600 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {result.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No routines scheduled.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
