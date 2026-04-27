import { getPoliceStation } from "@/lib/api/police-stations";
import { PageHeader } from "@/components/admin/ui/page-header";
import { PoliceStationForm } from "../../police-station-form";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EditPoliceStationPage({ params }: { params: Params }) {
  const { id } = await params;
  const stationId = parseInt(id);

  if (isNaN(stationId)) {
    notFound();
  }

  try {
    const station = await getPoliceStation(stationId);

    return (
      <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
        <PageHeader
          title="Edit Police Station"
          breadcrumbs={[
            { label: "Home", href: "/admin" },
            { label: "Police Stations", href: "/admin/police-stations" },
            { label: station.name },
          ]}
        />

        <div className="">
          <PoliceStationForm initialData={station} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
