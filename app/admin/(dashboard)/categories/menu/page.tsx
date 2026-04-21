import { WebsiteMenuCategoryManager } from "@/components/admin/categories/WebsiteMenuCategoryManager";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategoriesList } from "@/lib/api/categories";
import { getMenuCategoriesAction } from "@/lib/api/menu-category-actions";

export default async function WebsiteMenuCategoriesPage() {
  const [{ items: categories }, currentMenuCategories] = await Promise.all([
    getCategoriesList({ page: 1, per_page: 200 }),
    getMenuCategoriesAction(),
  ]);

  const topLevelCategories = categories
    .filter((category) => !category.parent_id)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Categories", href: "/admin/categories/list" },
          { label: "Website Menu Categories" },
        ]}
      />

      <WebsiteMenuCategoryManager
        allCategories={topLevelCategories.map((category) => ({
          id: category.id,
          title: category.title,
          slug: category.slug,
        }))}
        initialMenuCategories={currentMenuCategories}
      />
    </div>
  );
}
