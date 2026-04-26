import { getAdminAmbulanceList } from "@/lib/api/admin/ambulance-actions";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { AmbulanceTable } from "./ambulance-table";

type SearchParams = Promise<{
  page?: string;
  status?: string;
  search?: string;
}>;

export default async function AdminAmbulancesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, status, search } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const { items, pagination } = await getAdminAmbulanceList({
    page: current_page,
    status: status,
    search: search,
  });

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Ambulance Services"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Ambulances" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-slate-100 p-4 md:p-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Registration Requests
            </h1>
            <p className="text-sm text-slate-500">
              Manage and verify ambulance service providers
            </p>
          </div>

          <AmbulanceTable items={items} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
