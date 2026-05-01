import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchAdmissionsAction } from "@/lib/api/admission-actions";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { AdmissionTable } from "./admission-table";

export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const { items, pagination } = await fetchAdmissionsAction({
    page: current_page,
  });

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Admissions"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Admissions" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                All Admissions
              </h1>
              <p className="text-sm text-slate-500">
                Manage university admission directories
              </p>
            </div>
            <Link href="/admin/admissions/add">
              <Button>
                <Plus size={16} className="mr-2" />
                Add New Admission
              </Button>
            </Link>
          </div>

          <AdmissionTable items={items} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
