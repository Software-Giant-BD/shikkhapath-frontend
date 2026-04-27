import { PageHeader } from "@/components/admin/ui/page-header";
import { FireStationForm } from "../fire-station-form";

export default function AddFireStationPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Add Fire Station"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Fire Stations", href: "/admin/fire-stations" },
          { label: "Add New" },
        ]}
      />

      <FireStationForm />
    </div>
  );
}
