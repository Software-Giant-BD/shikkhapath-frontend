import Link from "next/link";
import { List } from "lucide-react";
import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/jobs/JobForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getJobById } from "@/lib/api/jobs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id, true);

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Jobs", href: "/admin/jobs/list" },
          { label: "Edit" },
        ]}
      />

      <JobForm
        initialData={job}
        headerTitle="Edit Job Circular"
        headerAction={(
          <Link href="/admin/jobs/list">
            <Button variant="secondary" className="gap-2">
              <List size={16} />
              Jobs List
            </Button>
          </Link>
        )}
      />
    </div>
  );
}
