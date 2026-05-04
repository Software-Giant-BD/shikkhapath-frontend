import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type NewsletterApiModel = {
  id: string;
  email: string;
  created_at: string;
};

export type GetNewslettersParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type NewslettersListResult = {
  items: NewsletterApiModel[];
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

function normalizeNewsletter(value: unknown): NewsletterApiModel {
  const item = asObject(value);

  return {
    id: asString(item.id),
    email: asString(item.email),
    created_at: asString(item.created_at),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);
  const resources = asObject(root.resources);
  const candidates = [
    root.data,
    root.newsletters,
    resources.newsletters,
    resources.data,
    resources.items,
    resources,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export async function getNewslettersList(
  params?: GetNewslettersParams,
): Promise<NewslettersListResult> {
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

    if (params?.search?.trim()) {
      query.set("search", params.search.trim());
    }

    const path = query.toString()
      ? `/admin/newsletters?${query.toString()}`
      : "/admin/newsletters";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load newsletters.");
    }

    return {
      items: extractList(payload).map(normalizeNewsletter),
      pagination: extractPagination(payload, fallbackPage, fallbackper_page),
    };
  } catch (error) {
    console.error("Failed to fetch newsletters:", error);
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
