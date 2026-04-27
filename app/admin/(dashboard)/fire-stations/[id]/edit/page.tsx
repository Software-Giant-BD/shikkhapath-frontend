import { PageHeader } from "@/components/admin/ui/page-header";
import { getFireStation } from "@/lib/api/fire-stations";
import { FireStationForm } from "../../fire-station-form";
import { notFound } from "next/navigation";

export default async function EditFireStationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fireStation = await getFireStation(Number(id));

  if (!fireStation) {
    notFound();
  }

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Edit Fire Station"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Fire Stations", href: "/admin/fire-stations" },
          { label: "Edit Station" },
        ]}
      />

      <FireStationForm initialData={fireStation} />
    </div>
  );
}
