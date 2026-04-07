import { notFound } from "next/navigation";
import Link from "next/link";
import { List } from "lucide-react";

import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategoryById } from "@/lib/api/categories";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Edit Category"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Categories", href: "/admin/categories/list" },
          { label: "Edit" },
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

      <CategoryForm mode="edit" categoryId={id} initialValues={category} />
    </div>
  );
}
