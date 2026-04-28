import { PageHeader } from "@/components/admin/ui/page-header";
import { AdmissionForm } from "../admission-form";

export default function AddAdmissionPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Add Admission"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Admissions", href: "/admin/admissions" },
          { label: "Add Admission" },
        ]}
      />

      <AdmissionForm />
    </div>
  );
}
