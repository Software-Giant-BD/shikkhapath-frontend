import "server-only";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export type FieldErrors = Record<string, string[]>;

export type BasePagination = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export async function getAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value;
}

export async function fetchApi(
  path: string,
  init?: RequestInit,
  options?: { includeAuth?: boolean },
) {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn("WARNING: NEXT_PUBLIC_API_BASE_URL is not defined in .env file. Falling back to localhost.");
  }

  const includeAuth = options?.includeAuth ?? true;
  const token = includeAuth ? await getAdminToken() : undefined;

  return fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function normalizeImageUrl(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.path === "string") return obj.path;
    if (typeof obj.image === "string") return obj.image;
  }

  return null;
}

export function extractFieldErrors(data: any): FieldErrors | null {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return null;
  }

  const result: FieldErrors = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      result[key] = value.map((v) => String(v));
    } else if (typeof value === "string") {
      result[key] = [value];
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

export function extractPagination(
  payload: any,
  fallbackPage: number,
  fallbackPerPage: number,
): BasePagination {
  const pagination = payload?.pagination ?? payload?.meta?.pagination ?? payload?.meta;

  return {
    currentPage: Math.max(
      1,
      Number(pagination?.current_page ?? pagination?.currentPage ?? fallbackPage) || fallbackPage,
    ),
    lastPage: Math.max(
      1,
      Number(pagination?.last_page ?? pagination?.lastPage ?? fallbackPage) || fallbackPage,
    ),
    perPage: Math.max(
      1,
      Number(pagination?.per_page ?? pagination?.perPage ?? fallbackPerPage) || fallbackPerPage,
    ),
    total: Math.max(0, Number(pagination?.total ?? 0) || 0),
  };
}
