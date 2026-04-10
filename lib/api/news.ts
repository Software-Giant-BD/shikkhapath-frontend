import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type NewsStatus = "draft" | "published" | "scheduled";

export type NewsRelationCategory = {
  id: string;
  title: string;
  slug: string;
};

export type NewsApiModel = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  sub_category_id: string;
  author_name: string;
  source_name: string;
  source_url: string;
  feature_image_url: string;
  status: NewsStatus;
  publish_at: string;
  tags: string;
  language: string;
  read_time_minutes: number;
  is_featured: boolean;
  is_breaking: boolean;
  allow_comments: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  category?: NewsRelationCategory;
  sub_category?: NewsRelationCategory;
  created_at: string;
};

export type GetNewsParams = {
  page?: number;
  per_page?: number;
};

export type NewsListResult = {
  items: NewsApiModel[];
  pagination: BasePagination;
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes"].includes(normalized)) return true;
    if (["0", "false", "no"].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeStatus(value: unknown): NewsStatus {
  const normalized = asString(value, "draft").toLowerCase();
  if (normalized === "published" || normalized === "scheduled") {
    return normalized;
  }
  return "draft";
}

function normalizeRelationCategory(value: unknown): NewsRelationCategory | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const item = asObject(value);
  return {
    id: asString(item.id),
    title: asString(item.title),
    slug: asString(item.slug),
  };
}

function normalizeNews(value: unknown): NewsApiModel {
  const item = asObject(value);

  return {
    id: asString(item.id),
    title: asString(item.title),
    slug: asString(item.slug),
    excerpt: asString(item.excerpt),
    content: asString(item.content),
    category_id: asString(item.category_id ?? item.categoryId),
    sub_category_id: asString(item.sub_category_id ?? item.subCategoryId),
    author_name: asString(item.author_name ?? item.authorName),
    source_name: asString(item.source_name ?? item.sourceName),
    source_url: asString(item.source_url ?? item.sourceUrl),
    feature_image_url: asString(item.feature_image_url ?? item.featureImageUrl),
    status: normalizeStatus(item.status),
    publish_at: asString(item.publish_at ?? item.publishAt),
    tags: asString(item.tags),
    language: asString(item.language, "bn"),
    read_time_minutes: Math.max(0, asNumber(item.read_time_minutes ?? item.readTimeMinutes, 0)),
    is_featured: asBoolean(item.is_featured ?? item.isFeatured, false),
    is_breaking: asBoolean(item.is_breaking ?? item.isBreaking, false),
    allow_comments: asBoolean(item.allow_comments ?? item.allowComments, true),
    meta_title: asString(item.meta_title ?? item.metaTitle),
    meta_description: asString(item.meta_description ?? item.metaDescription),
    meta_keywords: asString(item.meta_keywords ?? item.metaKeywords),
    category: normalizeRelationCategory(item.category),
    sub_category: normalizeRelationCategory(item.sub_category ?? item.subCategory),
    created_at: asString(item.created_at ?? item.createdAt),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = asObject(payload);
  if (Array.isArray(root.resources)) {
    return root.resources;
  }

  const resources = asObject(root.resources);
  const candidates = [resources.news, resources.items, resources.data, root.news, root.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function extractOne(payload: unknown): unknown | null {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const root = payload as Record<string, unknown>;
    if (root.id !== undefined) {
      return root;
    }
  }

  const root = asObject(payload);
  const resources = asObject(root.resources);

  const candidates = [
    root.resources,
    resources.news,
    resources.item,
    resources.data,
    root.news,
    root.data,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function getNewsList(params?: GetNewsParams): Promise<NewsListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackPerPage = params?.per_page ?? 20;

  try {
    const query = new URLSearchParams();

    if (params?.page !== undefined) {
      query.set("page", String(params.page));
    }

    if (params?.per_page !== undefined) {
      query.set("per_page", String(params.per_page));
    }

    const path = query.toString() ? `/admin/news?${query.toString()}` : "/admin/news";
    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as Record<string, unknown>)?.message as string || "Failed to load news list.");
    }

    return {
      items: extractList(payload).map(normalizeNews),
      pagination: extractPagination(payload, fallbackPage, fallbackPerPage),
    };
  } catch (error) {
    console.error("Failed to fetch news list:", error);

    return {
      items: [],
      pagination: {
        currentPage: fallbackPage,
        lastPage: fallbackPage,
        perPage: fallbackPerPage,
        total: 0,
      },
    };
  }
}

export async function getNewsById(newsId: string): Promise<NewsApiModel | null> {
  try {
    const response = await fetchApi(`/admin/news/${newsId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error((payload as Record<string, unknown>)?.message as string || "Failed to load news item.");
    }

    const item = extractOne(payload);
    if (!item) {
      return null;
    }

    return normalizeNews(item);
  } catch (error) {
    console.error(`Failed to fetch news ${newsId}:`, error);
    return null;
  }
}
