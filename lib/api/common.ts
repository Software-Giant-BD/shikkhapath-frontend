import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type BasePagination, type FieldErrors } from "./api-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export { type BasePagination, type FieldErrors };
export { extractPagination, extractFieldErrors, normalizeImageUrl, parseStringArray } from "./api-utils";

export async function getAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value;
}

/**
 * Check if an error is a Next.js redirect error
 */
export function isRedirectError(error: any): boolean {
  return error?.digest?.startsWith("NEXT_REDIRECT");
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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body && typeof init.body === "string" ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    
    console.error(`[fetchApi] Failed to fetch from ${path}:`, error);
    // Throw a generic error that will be caught by error.tsx boundaries
    throw new Error("Server is not responding. Please try again later.");
  }

  // Handle 401 Unauthorized — redirect to route handler which clears the cookie.
  // Cookies can only be modified in a Server Action or Route Handler, not here.
  if (response.status === 401 && includeAuth) {
    redirect("/api/admin/clear-session");
  }

  return response;
}
