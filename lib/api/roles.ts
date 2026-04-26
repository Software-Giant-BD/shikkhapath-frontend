import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type RoleApiModel = {
  id: string;
  name: string;
  is_active: boolean;
  description: string;
  assigned_user_count: number;
};

export type GetRolesParams = {
  page?: number;
  per_page?: number;
};

export type RolesListResult = {
  items: RoleApiModel[];
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

function asBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "active"].includes(normalized)) return true;
    if (["0", "false", "no", "inactive"].includes(normalized)) return false;
  }

  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function normalizeRole(value: unknown): RoleApiModel {
  const item = asObject(value);

  return {
    id: asString(item.id),
    name: asString(item.name),
    is_active: asBoolean(item.is_active ?? item.isActive ?? item.status, true),
    description: asString(item.description),
    assigned_user_count: asNumber(
      item.assigned_user_count ?? item.assignedUsersCount ?? item.users_count,
      0,
    ),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);
  if (Array.isArray(root.resources)) return root.resources;

  const resources = asObject(root.resources);
  const candidates = [
    root.data,
    root.roles,
    resources.roles,
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

function extractOne(payload: unknown): unknown | null {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const root = payload as Record<string, unknown>;
    if (root.id !== undefined) return root;
  }

  const root = asObject(payload);
  const resources = asObject(root.resources);
  const candidates = [
    root.role,
    root.data,
    resources.role,
    resources.data,
    resources.item,
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

export async function getRolesList(
  params?: GetRolesParams,
): Promise<RolesListResult> {
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
      ? `/admin/roles?${query.toString()}`
      : "/admin/roles";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load roles.");
    }

    return {
      items: extractList(payload).map(normalizeRole),
      pagination: extractPagination(payload, fallbackPage, fallbackper_page),
    };
  } catch (error) {
    console.error("Failed to fetch roles:", error);
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

export async function getRoles(
  params?: GetRolesParams,
): Promise<RoleApiModel[]> {
  const { items } = await getRolesList(params);
  return items;
}

export async function getRoleById(
  roleId: string,
): Promise<RoleApiModel | null> {
  try {
    const response = await fetchApi(`/admin/roles/${roleId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load role details.",
      );
    }

    const item = extractOne(payload);
    return item ? normalizeRole(item) : null;
  } catch (error) {
    console.error(`Failed to fetch role ${roleId}:`, error);
    return null;
  }
}
