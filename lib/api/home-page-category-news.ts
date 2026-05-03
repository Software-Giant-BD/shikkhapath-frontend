import "server-only";

import { fetchApi } from "./common";

export type HomePageCategory = {
  id: string;
  title: string;
  slug: string;
};

export type HomePageCategoryNewsItem = {
  id: string;
  title: string;
  unique_code: string;
  excerpt: string;
  feature_image_url: string;
  publish_at: string;
};

export type HomePageCategoryNewsSection = {
  category: HomePageCategory;
  news: HomePageCategoryNewsItem[];
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function normalizeCategory(value: unknown): HomePageCategory {
  const item = asObject(value);

  return {
    id: asString(item.id),
    title: asString(item.title),
    slug: asString(item.slug),
  };
}

function normalizeNewsItem(value: unknown): HomePageCategoryNewsItem | null {
  const item = asObject(value);
  const title = asString(item.title).trim();
  const uniqueCode = asString(item.unique_code ?? item.unique_code ?? item.urlSlug ?? item.slug).trim();

  if (!title || !uniqueCode) {
    return null;
  }

  return {
    id: asString(item.id, `${uniqueCode}-${title}`),
    title,
    unique_code: uniqueCode,
    excerpt: asString(item.excerpt),
    feature_image_url: asString(item.feature_image_url ?? item.featureImageUrl),
    publish_at: asString(item.publish_at ?? item.publishAt),
  };
}

function extractSections(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);

  if (Array.isArray(root.resources)) return root.resources;

  const resources = asObject(root.resources);
  const candidates = [
    resources.home_page_category_news,
    resources.homePageCategoryNews,
    resources.categories,
    resources.items,
    resources.data,
    root.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeSection(value: unknown): HomePageCategoryNewsSection | null {
  const item = asObject(value);
  const category = normalizeCategory(item.category);

  if (!category.id || !category.slug || !category.title) {
    return null;
  }

  const news = Array.isArray(item.news)
    ? item.news
        .map(normalizeNewsItem)
        .filter((entry): entry is HomePageCategoryNewsItem => entry !== null)
    : [];

  return {
    category,
    news,
  };
}

export async function getHomePageCategoryNews(): Promise<HomePageCategoryNewsSection[]> {
  try {
    const response = await fetchApi("/home-page-category-news", undefined, {
      includeAuth: false,
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json().catch(() => null);

    return extractSections(payload)
      .map(normalizeSection)
      .filter((section): section is HomePageCategoryNewsSection => section !== null);
  } catch {
    return [];
  }
}
