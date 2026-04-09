import { List } from "lucide-react";
import Link from "next/link";

import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategories } from "@/lib/api/categories";

export default async function AddCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Categories", href: "/admin/categories/list" },
          { label: "Add" },
        ]}
      />

      <CategoryForm
        mode="add"
        showDetailsHeader={false}
        headerTitle="Add Category"
        headerAction={(
          <Link href="/admin/categories/list">
            <Button variant="secondary">
              <List size={16} />
              Category List
            </Button>
          </Link>
        )}
        parentOptions={categories.map((category) => ({ id: category.id, title: category.title }))}
      />
    </div>
  );
}
