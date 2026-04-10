import Link from "next/link";
import { List } from "lucide-react";

import { NewsForm } from "@/components/admin/news/NewsForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategories } from "@/lib/api/categories";

export default async function AddNewsPage() {
  const categories = await getCategories();

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "News", href: "/admin/news/list" },
          { label: "Add" },
        ]}
      />

      <NewsForm
        categoryOptions={categories.map((category) => ({
          id: category.id,
          title: category.title,
          parent_id: category.parent_id || null,
        }))}
        headerTitle="Add News"
        headerAction={(
          <Link href="/admin/news/list">
            <Button variant="secondary">
              <List size={16} />
              News List
            </Button>
          </Link>
        )}
      />
    </div>
  );
}
