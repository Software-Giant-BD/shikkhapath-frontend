import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type CategoryStatus = "published" | "draft";

export type CategoryParentApiModel = {
  id: string;
  title: string;
  slug: string;
};

export type CategoryApiModel = {
  id: string;
  title: string;
  slug: string;
  parent_id: string;
  parent?: CategoryParentApiModel;
  status: CategoryStatus;
  sort_order: string;
  home_sort_order: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  show_in_menu: boolean;
  show_on_home: boolean;
  featured: boolean;
  og_image_url?: string;
  children_count?: number;
};

export type GetCategoriesParams = {
  page?: number;
  per_page?: number;
};

export type CategoriesListResult = {
  items: CategoryApiModel[];
  pagination: BasePagination;
};

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

function normalizeStatus(value: unknown): CategoryStatus {
  return asString(value, "draft").toLowerCase() === "published"
    ? "published"
    : "draft";
}

function normalizeParentCategory(
  value: unknown,
): CategoryParentApiModel | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const parent = asObject(value);

  return {
    id: asString(parent.id),
    title: asString(parent.title),
    slug: asString(parent.slug),
  };
}

function normalizeCategory(value: unknown): CategoryApiModel {
  const item = asObject(value);

  return {
    id: asString(item.id),
    title: asString(item.title),
    slug: asString(item.slug),
    parent_id: asString(item.parent_id ?? item.parentId),
    parent: normalizeParentCategory(item.parent),
    status: normalizeStatus(item.status),
    sort_order: asString(item.sort_order ?? item.sortOrder ?? "0"),
    home_sort_order: asString(
      item.home_sort_order ??
        item.homeSortOrder ??
        item.sort_order ??
        item.sortOrder ??
        "0",
    ),
    description: asString(item.description),
    meta_title: asString(item.meta_title ?? item.metaTitle),
    meta_description: asString(item.meta_description ?? item.metaDescription),
    meta_keywords: asString(item.meta_keywords ?? item.metaKeywords),
    show_in_menu: asBoolean(item.show_in_menu ?? item.showInMenu, true),
    show_on_home: asBoolean(
      item.show_on_home ?? item.showOnHome ?? item.featured,
      false,
    ),
    featured: asBoolean(item.featured, false),
    og_image_url: asString(item.og_image_url ?? item.ogImageUrl) || undefined,
    children_count: Number(item.children_count ?? 0),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const data = asObject(payload);
  if (Array.isArray(data.resources)) {
    return data.resources;
  }

  const resources = asObject(data.resources);

  const candidates = [
    resources.categories,
    resources.items,
    resources.data,
    resources,
    data.categories,
    data.data,
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

  const data = asObject(payload);

  if (Array.isArray(data.resources) && data.resources.length > 0) {
    const first = data.resources[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return first;
    }
  }

  const resources = asObject(data.resources);

  const candidates = [
    resources.category,
    resources.item,
    data.category,
    data.data,
    resources.data,
    resources,
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

export async function getCategoriesList(
  params?: GetCategoriesParams,
): Promise<CategoriesListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackper_page = params?.per_page ?? 20;

  try {
    const query = new URLSearchParams();

    if (params?.page !== undefined) {
      query.set("page", String(params.page));
    }

    if (params?.per_page !== undefined) {
      query.set("per_page", String(params.per_page));
    }

    const path = query.toString()
      ? `/admin/categories?${query.toString()}`
      : "/admin/categories";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load categories.",
      );
    }

    return {
      items: extractList(payload).map(normalizeCategory),
      pagination: extractPagination(payload, fallbackPage, fallbackper_page),
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return {
      items: [],
      pagination: {
        current_page: fallbackPage,
        last_page: fallbackPage,
        per_page: fallbackper_page,
        total: 0,
      },
    };
  }
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<CategoryApiModel[]> {
  const { items } = await getCategoriesList(params);
  return items;
}

export async function getCategoryById(
  catId: string,
): Promise<CategoryApiModel | null> {
  try {
    const response = await fetchApi(`/admin/categories/${catId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load category.");
    }

    const item = extractOne(payload);
    if (!item) {
      return null;
    }

    return normalizeCategory(item);
  } catch (error) {
    console.error(`Failed to fetch category ${catId}:`, error);
    return null;
  }
}

export async function getMenuCategories(): Promise<CategoryApiModel[]> {
  try {
    const response = await fetchApi(
      "/menu-categories",
      { cache: "no-store" },
      { includeAuth: false },
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load menu categories.",
      );
    }

    const items = extractList(payload);
    return items.map(normalizeCategory);
  } catch (error) {
    console.error("Failed to fetch menu categories:", error);
    return [];
  }
}

export async function getAllCategories(): Promise<CategoryApiModel[]> {
  try {
    const response = await fetchApi(
      "/categories",
      { cache: "no-store" },
      { includeAuth: false },
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load categories.",
      );
    }

    const items = extractList(payload);
    return items.map(normalizeCategory);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
