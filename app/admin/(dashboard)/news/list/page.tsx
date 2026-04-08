import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function NewsListPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="News List"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "News" }]}
        action={(
          <Link href="/admin/news/add">
            <Button>
              <Plus size={16} />
              Add News
            </Button>
          </Link>
        )}
      />

      <Card>
        <CardContent>
          <p className="text-sm text-slate-600">
            News listing is ready for API integration. Use <Link href="/admin/news/add" className="font-medium text-indigo-600">Add News</Link> to create new entries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
