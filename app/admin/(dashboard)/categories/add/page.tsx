import { List } from "lucide-react";
import Link from "next/link";

import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

export default function AddCategoryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Add Category"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Categories", href: "/admin/categories/list" },
          { label: "Add" },
        ]}
        action={(
          <Link href="/admin/categories/list">
            <Button variant="secondary">
              <List size={16} />
              Category List
            </Button>
          </Link>
        )}
      />

      <CategoryForm mode="add" />
    </div>
  );
}
