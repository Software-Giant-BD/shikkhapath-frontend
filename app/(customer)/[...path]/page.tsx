import { notFound } from "next/navigation";
import { resolveAnyPath } from "@/lib/api/news";
import { NewsDetailsView } from "./_views/news-details-view";
import { CategoryView } from "./_views/category-view";
import { getNewsDetailsMetadata } from "./_metadata/news-details-metadata";
import { getCategoryMetadata } from "./_metadata/category-metadata";

import type { Metadata } from "next";

interface Props {
  params: {
    path: string[];
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;

  if (path[0] === "sitemap" || path[0] === "sitemap.xml") {
    return { title: "Sitemap" };
  }

  const result = await resolveAnyPath(path);

  if (result?.contentType === "news_details") {
    return getNewsDetailsMetadata(result.data.main_news);
  }

  if (result?.contentType === "category_page") {
    return getCategoryMetadata(result.data, path);
  }

  return {
    title: "পাতাটি পাওয়া যায়নি | শিক্ষাপথ",
  };
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const { path } = await params;

  if (path[0] === "sitemap" || path[0] === "sitemap.xml") {
    return notFound();
  }

  const page = parseInt((await searchParams)?.page || "1");

  const result = await resolveAnyPath(path, page);

  if (result?.contentType === "news_details") {
    return <NewsDetailsView news_details={result.data} path={path} />;
  }

  if (result?.contentType === "category_page") {
    return <CategoryView data={result.data} path={path} />;
  }

  return notFound();
}
