import { MediaCenterClient } from "@/components/admin/media/MediaCenterClient";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function MediaCenterPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Media Center" }]}
      />

      <MediaCenterClient />
    </div>
  );
}
