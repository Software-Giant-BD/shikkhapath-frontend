import { MediaCenterClient } from "@/components/admin/media/MediaCenterClient";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function MediaCenterPage() {
  return (
    <div className="w-full space-y-4 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Media Center" }]}
      />

      <MediaCenterClient />
    </div>
  );
}
