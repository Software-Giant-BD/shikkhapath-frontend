import Link from "next/link";
import { List } from "lucide-react";
import { notFound } from "next/navigation";

import { NewsForm } from "@/components/admin/news/NewsForm";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getCategories } from "@/lib/api/categories";
import { getNewsById } from "@/lib/api/news";

type EditNewsPageParams = Promise<{ id: string }>;

export default async function EditNewsPage({
  params,
}: {
  params: EditNewsPageParams;
}) {
  const { id } = await params;

  const [categories, news] = await Promise.all([
    getCategories(),
    getNewsById(id),
  ]);

  if (!news) {
    notFound();
  }

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "News", href: "/admin/news/list" },
          { label: "Edit" },
        ]}
      />

      <NewsForm
        mode="edit"
        newsId={news.id}
        categoryOptions={categories.map((category) => ({
          id: category.id,
          title: category.title,
          parent_id: category.parent_id || null,
        }))}
        initialValues={{
          title: news.title,
          slug: news.slug,
          excerpt: news.excerpt,
          content: news.content,
          category_id: news.category_id,
          sub_category_id: news.sub_category_id,
          author_name: news.author_name,
          source_name: news.source_name,
          source_url: news.source_url,
          feature_image_id: news.feature_image_id,
          feature_image_url: news.feature_image_url,
          status: news.status,
          publish_at: news.publish_at,
          tags: news.tags,
          language: news.language || "bn",
          read_time_minutes: String(news.read_time_minutes || ""),
          is_featured: news.is_featured ? "1" : "0",
          is_breaking: news.is_breaking ? "1" : "0",
          allow_comments: news.allow_comments ? "1" : "0",
          meta_title: news.meta_title,
          meta_description: news.meta_description,
          meta_keywords: news.meta_keywords,
        }}
        headerTitle="Edit News"
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
