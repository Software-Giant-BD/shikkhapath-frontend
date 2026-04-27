import Link from "next/link";
import { Plus } from "lucide-react";
import { getPoliceStations } from "@/lib/api/police-stations";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { PoliceStationTable } from "./police-station-table";

type SearchParams = Promise<{
  page?: string;
  search?: string;
}>;

export default async function PoliceStationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const { items, pagination } = await getPoliceStations({
    page: current_page,
    search: search,
    isAdmin: true,
  });

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Police Stations"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Police Stations" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                All Police Stations
              </h1>
              <p className="text-sm text-slate-500">
                Manage police station directory information
              </p>
            </div>
            <Link href="/admin/police-stations/add">
              <Button>
                <Plus size={16} className="mr-2" />
                Add New Station
              </Button>
            </Link>
          </div>

          <PoliceStationTable items={items} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
