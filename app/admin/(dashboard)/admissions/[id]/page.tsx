import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdmissionForm } from "../admission-form";
import { getAdmissionAction } from "@/lib/api/admission-actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAdmissionPage({ params }: PageProps) {
  const { id } = await params;
  const admission = await getAdmissionAction(id);

  if (!admission) {
    notFound();
  }

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Edit Admission"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Admissions", href: "/admin/admissions" },
          { label: "Edit Admission" },
        ]}
      />

      <AdmissionForm initialData={admission} />
    </div>
  );
}
