import { FolderOpen } from "lucide-react";

import { MediaCenterClient } from "@/components/admin/media/MediaCenterClient";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function MediaCenterPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Media Center"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Media Center" }]}
        action={(
          <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
            <FolderOpen size={16} />
            Manage image and video files
          </div>
        )}
      />

      <MediaCenterClient />
    </div>
  );
}
