import "server-only";

import { cookies } from "next/headers";
import { type BasePagination, type FieldErrors } from "./api-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export { type BasePagination, type FieldErrors };
export { extractPagination, extractFieldErrors, normalizeImageUrl, parseStringArray } from "./api-utils";

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
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
}
