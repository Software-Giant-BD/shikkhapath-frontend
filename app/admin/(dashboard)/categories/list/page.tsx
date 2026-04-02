import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategories } from "@/lib/api/categories";

type CategoryRow = {
  id: string;
  title: string;
  slug: string;
  parent: string;
  status: "Published" | "Draft";
  sortOrder: number;
  metaTitle: string;
};

function statusClass(status: CategoryRow["status"]) {
  return status === "Published"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-amber-50 text-amber-700";
}

export default async function CategoriesListPage() {
  const categories = await getCategories();
  const rows: CategoryRow[] = categories.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    parent: item.parent_id || "-",
    status: item.status === "published" ? "Published" : "Draft",
    sortOrder: Number(item.sort_order) || 0,
    metaTitle: item.meta_title,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Categories"
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Categories" }]}
        action={(
          <Link href="/admin/categories/add">
            <Button>
              <Plus size={16} />
              Add Category
            </Button>
          </Link>
        )}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Parent</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Sort</th>
                  <th className="px-6 py-4 font-semibold">Meta Title</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{category.title}</td>
                    <td className="px-6 py-4 text-slate-600">/{category.slug}</td>
                    <td className="px-6 py-4 text-slate-600">{category.parent}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{category.sortOrder}</td>
                    <td className="px-6 py-4 text-slate-600">{category.metaTitle}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={7}>
                      No categories found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
