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
  url_slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  sub_category_id: string;
  author_name: string;
  source_name: string;
  source_url: string;
  feature_image_id: string;
  feature_image_url: string;
  status: NewsStatus;
  publish_at: string;
  tags: string[];
  language: string;
  read_time_minutes: number;
  is_featured: boolean;
  show_in_home_left: boolean;
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

export type HeroNewsItem = {
  id: string;
  title: string;
  slug: string;
  url_slug: string;
  excerpt: string;
  feature_image_url: string;
  publish_at: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
};

export type HeroNewsResponse = {
  feature_news: HeroNewsItem[];
  home_left: HeroNewsItem[];
};

export type PopularNewsResponse = HeroNewsItem[];

export type LatestNewsResponse = HeroNewsItem[];

export type TabNewsResponse = HeroNewsItem[];

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
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

function normalizeRelationCategory(
  value: unknown,
): NewsRelationCategory | undefined {
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
    url_slug: asString(item.url_slug ?? null),
    excerpt: asString(item.excerpt),
    content: asString(item.content),
    category_id: asString(item.category_id ?? null),
    sub_category_id: asString(item.sub_category_id ?? null),
    author_name: asString(item.author_name ?? null),
    source_name: asString(item.source_name ?? null),
    source_url: asString(item.source_url ?? null),
    feature_image_id: asString(item.feature_image_id ?? null),
    feature_image_url: asString(item.feature_image_url ?? null),
    status: normalizeStatus(item.status),
    publish_at: asString(item.publish_at ?? null),
    tags: Array.isArray(item.tags)
      ? item.tags.map(String)
      : asString(item.tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    language: asString(item.language, "bn"),
    read_time_minutes: Math.max(0, asNumber(item.read_time_minutes ?? 0, 0)),
    is_featured: asBoolean(item.is_featured ?? false, false),
    show_in_home_left: asBoolean(item.show_in_home_left ?? false, false),
    is_breaking: asBoolean(item.is_breaking ?? false, false),
    allow_comments: asBoolean(item.allow_comments ?? true, true),
    meta_title: asString(item.meta_title ?? null),
    meta_description: asString(item.meta_description ?? null),
    meta_keywords: asString(item.meta_keywords ?? null),
    category: normalizeRelationCategory(item.category),
    sub_category: normalizeRelationCategory(item.sub_category ?? null),
    created_at: asString(item.created_at ?? null),
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
  const candidates = [
    resources.news,
    resources.items,
    resources.data,
    root.news,
    root.data,
  ];

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
    resources.main_news,
    resources.news,
    resources.item,
    resources.data,
    root.main_news,
    root.news,
    root.data,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  return null;
}

export async function getNewsList(
  params?: GetNewsParams,
): Promise<NewsListResult> {
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

    const path = query.toString()
      ? `/admin/news?${query.toString()}`
      : "/admin/news";
    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        ((payload as Record<string, unknown>)?.message as string) ||
          "Failed to load news list.",
      );
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

export async function getNewsById(
  newsId: string,
): Promise<NewsApiModel | null> {
  try {
    const response = await fetchApi(`/admin/news/${newsId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        ((payload as Record<string, unknown>)?.message as string) ||
          "Failed to load news item.",
      );
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

export async function getHeroNews(): Promise<HeroNewsResponse> {
  try {
    const response = await fetchApi("/hero-news", undefined, {
      includeAuth: false,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return { feature_news: [], home_left: [] };
    }

    console.log(payload);
    const data = payload?.resources || payload;

    const normalizeHeroItem = (item: any): HeroNewsItem => ({
      id: asString(item.id),
      title: asString(item.title),
      slug: asString(item.slug),
      url_slug: asString(item.url_slug ?? item.urlSlug ?? item.slug ?? item.id),
      excerpt: asString(item.excerpt),
      feature_image_url: asString(
        item.feature_image_url ?? item.featureImageUrl,
      ),
      publish_at: asString(item.publish_at ?? item.publishAt),
      category: normalizeRelationCategory(item.category),
    });

    return {
      feature_news: Array.isArray(data?.feature_news)
        ? data.feature_news.map(normalizeHeroItem)
        : [],
      home_left: Array.isArray(data?.home_left)
        ? data.home_left.map(normalizeHeroItem)
        : [],
    };
  } catch (error) {
    console.error("Failed to fetch hero news:", error);
    return { feature_news: [], home_left: [] };
  }
}

export async function getPopularNews(): Promise<PopularNewsResponse> {
  try {
    const response = await fetchApi("/popular-news", undefined, {
      includeAuth: false,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return [];
    }

    const resources = payload?.resources || payload;
    const items = Array.isArray(resources) ? resources : resources.data || [];

    const normalizeHeroItem = (item: any): HeroNewsItem => ({
      id: asString(item.id),
      title: asString(item.title),
      slug: asString(item.slug),
      url_slug: asString(item.url_slug ?? item.urlSlug ?? item.slug ?? item.id),
      excerpt: asString(item.excerpt),
      feature_image_url: asString(
        item.feature_image_url ?? item.featureImageUrl,
      ),
      publish_at: asString(item.publish_at ?? item.publishAt),
      category: normalizeRelationCategory(item.category),
    });

    return Array.isArray(items) ? items.map(normalizeHeroItem) : [];
  } catch (error) {
    console.error("Failed to fetch popular news:", error);
    return [];
  }
}

export async function getLatestNews(): Promise<LatestNewsResponse> {
  try {
    const response = await fetchApi("/latest-news", undefined, {
      includeAuth: false,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return [];
    }

    const resources = payload?.resources || payload;

    const normalizeHeroItem = (item: any): HeroNewsItem => ({
      id: asString(item.id),
      title: asString(item.title),
      slug: asString(item.slug),
      url_slug: asString(item.url_slug ?? item.urlSlug ?? item.slug ?? item.id),
      excerpt: asString(item.excerpt),
      feature_image_url: asString(
        item.feature_image_url ?? item.featureImageUrl,
      ),
      publish_at: asString(item.publish_at ?? item.publishAt),
      category: normalizeRelationCategory(item.category),
    });

    return Array.isArray(resources) ? resources.map(normalizeHeroItem) : [];
  } catch (error) {
    console.error("Failed to fetch latest news:", error);
    return [];
  }
}

export async function getTabNews(): Promise<TabNewsResponse> {
  try {
    const response = await fetchApi("/tap-news", undefined, {
      includeAuth: false,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return [];
    }

    const resources = payload?.resources || payload;

    const normalizeHeroItem = (item: any): HeroNewsItem => ({
      id: asString(item.id),
      title: asString(item.title),
      slug: asString(item.slug),
      url_slug: asString(item.url_slug ?? item.urlSlug ?? item.slug ?? item.id),
      excerpt: asString(item.excerpt),
      feature_image_url: asString(
        item.feature_image_url ?? item.featureImageUrl,
      ),
      publish_at: asString(item.publish_at ?? item.publishAt),
      category: normalizeRelationCategory(item.category),
    });

    return Array.isArray(resources) ? resources.map(normalizeHeroItem) : [];
  } catch (error) {
    console.error("Failed to fetch tab news:", error);
    return [];
  }
}

export async function getNewsDetails(urlSlug: string) {
  try {
    console.log(urlSlug);
    const response = await fetchApi(`/news/${urlSlug}`, undefined, {
      includeAuth: false,
    });
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }
    const resources = payload?.resources;
    const main_news = resources?.main_news;
    const item = extractOne(main_news);
    if (!item) {
      return null;
    }

    const category_news = resources?.category_news;
    const category_hierarchy = resources?.category_hierarchy;
    const popular_news = resources?.popular_news;

    return {
      main_news: normalizeNews(item),
      category_news: category_news,
      category_hierarchy: category_hierarchy,
      popular_news: popular_news,
    };
  } catch (error) {
    console.error(`Failed to fetch news details ${urlSlug}:`, error);
    return null;
  }
}
