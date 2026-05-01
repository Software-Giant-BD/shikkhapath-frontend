import { PageHeader } from "@/components/admin/ui/page-header";
import { PoliceStationForm } from "../police-station-form";

export default function AddPoliceStationPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Add Police Station"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Police Stations", href: "/admin/police-stations" },
          { label: "Add" },
        ]}
      />

      <div className="">
        <PoliceStationForm />
      </div>
    </div>
  );
}
