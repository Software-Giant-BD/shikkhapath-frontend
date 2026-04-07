import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type UserApiModel = {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  role_id: string;
  role_name: string;
  can_manage_news: boolean;
};

export type GetUsersParams = {
  page?: number;
  per_page?: number;
};

export type UsersListResult = {
  items: UserApiModel[];
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

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "active"].includes(normalized)) return true;
    if (["0", "false", "no", "inactive"].includes(normalized)) return false;
  }

  return fallback;
}

function normalizeUser(value: unknown): UserApiModel {
  const item = asObject(value);
  const role = asObject(item.role);

  return {
    id: asString(item.id),
    name: asString(item.name),
    email: asString(item.email),
    phone: asString(item.phone),
    is_active: asBoolean(item.is_active, true),
    role_id: asString(item.role_id ?? role.id),
    role_name: asString(item.role_name ?? role.name),
    can_manage_news: asBoolean(item.can_manage_news, false),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);
  if (Array.isArray(root.resources)) return root.resources;

  const resources = asObject(root.resources);
  const candidates = [root.data, root.users, resources.users, resources.data, resources.items, resources];

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
    if (root.id !== undefined) return root;
  }

  const root = asObject(payload);
  const resources = asObject(root.resources);
  const candidates = [root.user, root.data, resources.user, resources.data, resources.item, resources];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function getUsersList(params?: GetUsersParams): Promise<UsersListResult> {
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

    const path = query.toString() ? `/admin/users?${query.toString()}` : "/admin/users";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load users.");
    }

    return {
      items: extractList(payload).map(normalizeUser),
      pagination: extractPagination(payload, fallbackPage, fallbackPerPage),
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
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

export async function getUsers(params?: GetUsersParams): Promise<UserApiModel[]> {
  const { items } = await getUsersList(params);
  return items;
}

export async function getUserById(userId: string): Promise<UserApiModel | null> {
  try {
    const response = await fetchApi(`/admin/users/${userId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load user details.");
    }

    const item = extractOne(payload);
    return item ? normalizeUser(item) : null;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}
