import Link from "next/link";
import { Plus } from "lucide-react";
import { getFireStations } from "@/lib/api/fire-stations";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { FireStationTable } from "./fire-station-table";
import { FireStationListFilters } from "./fire-station-list-filters";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  division_id?: string;
  district_id?: string;
  upazila_id?: string;
}>;

export default async function FireStationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search, division_id, district_id, upazila_id } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const { items, pagination } = await getFireStations({
    page: current_page,
    search: search,
    division_id: division_id ? Number(division_id) : undefined,
    district_id: district_id ? Number(district_id) : undefined,
    upazila_id: upazila_id ? Number(upazila_id) : undefined,
    isAdmin: true,
  });

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Fire Stations"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Fire Stations" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight italic uppercase">
                Fire Station <span className="text-orange-600">Archive</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage fire service directory and emergency contact points
              </p>
            </div>
            <Link href="/admin/fire-stations/add">
              <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-100">
                <Plus size={16} className="mr-2" />
                Add New Station
              </Button>
            </Link>
          </div>

          <FireStationListFilters />
          <FireStationTable items={items} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
