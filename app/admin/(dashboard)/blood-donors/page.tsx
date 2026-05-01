import { getAdminBloodDonorsAction } from "@/lib/api/admin/blood-donor-actions";
import { getDistrictsAction } from "@/lib/api/location-actions";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent } from "@/components/admin/ui/card";
import { BloodDonorTable } from "./blood-donor-table";
import { BloodDonorFilters } from "./filters";

type SearchParams = Promise<{
  page?: string;
  status?: string;
  blood_group?: string;
  district_id?: string;
  search?: string;
}>;

export default async function AdminBloodDonorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, status, blood_group, district_id, search } = await searchParams;
  const current_page = Math.max(1, Number(page) || 1);

  const [donorsRes, districtsRes] = await Promise.all([
    getAdminBloodDonorsAction({
      page: current_page,
      status: status,
      blood_group: blood_group,
      district_id: district_id,
      search: search,
    }),
    getDistrictsAction(),
  ]);

  const { items, pagination } = donorsRes;
  const districts = districtsRes.ok ? districtsRes.items : [];

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Blood Donors"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Blood Donors" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Blood Donor Management
              </h1>
              <p className="text-sm text-slate-500">
                Manage and verify blood donors
              </p>
            </div>
            <BloodDonorFilters districts={districts} />
          </div>

          <BloodDonorTable items={items} pagination={pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
