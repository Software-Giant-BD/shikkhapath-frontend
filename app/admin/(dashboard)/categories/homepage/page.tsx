import { HomepageCategoryManager } from "@/components/admin/categories/HomepageCategoryManager";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategoriesList } from "@/lib/api/categories";
import { getHomeCategoriesAction } from "@/lib/api/home-category-actions";

export default async function HomePageCategoriesPage() {
  const [{ items: categories }, currentHomeCategories] = await Promise.all([
    getCategoriesList({ page: 1, per_page: 200 }),
    getHomeCategoriesAction(),
  ]);

  const topLevelCategories = categories
    .filter((category) => !category.parent_id)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Home Page Categories"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Categories", href: "/admin/categories/list" },
          { label: "Home Page Categories" },
        ]}
      />

      <HomepageCategoryManager
        allCategories={topLevelCategories.map((category) => ({
          id: category.id,
          title: category.title,
          slug: category.slug,
        }))}
        initialHomeCategories={currentHomeCategories}
      />
    </div>
  );
}
