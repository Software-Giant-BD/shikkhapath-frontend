import Link from "next/link";
import { List } from "lucide-react";

import { NewsForm } from "@/components/admin/news/NewsForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function AddNewsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Add News"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "News", href: "/admin/news/list" },
          { label: "Add" },
        ]}
        action={(
          <Link href="/admin/news/list">
            <Button variant="secondary">
              <List size={16} />
              News List
            </Button>
          </Link>
        )}
      />

      <NewsForm />
    </div>
  );
}
