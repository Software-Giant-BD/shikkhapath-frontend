import "server-only";

import { fetchApi } from "./common";

export type RoleApiModel = {
  id: string;
  name: string;
  permission_ids: string[];
  users_count: number;
  status: "active" | "inactive";
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function normalizeStatus(value: unknown): "active" | "inactive" {
  return asString(value, "active").toLowerCase() === "inactive" ? "inactive" : "active";
}

function normalizeRole(value: unknown): RoleApiModel {
  const item = asObject(value);

  const permissionIds = asStringArray(
    item.permission_ids ?? item.permissionIds ?? item.permissions,
  );

  return {
    id: asString(item.id),
    name: asString(item.name),
    permission_ids: permissionIds,
    users_count: asNumber(item.users_count ?? item.usersCount ?? item.total_users, 0),
    status: normalizeStatus(item.status),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);
  if (Array.isArray(root.resources)) return root.resources;

  const resources = asObject(root.resources);
  const candidates = [root.data, root.roles, resources.roles, resources.data, resources.items, resources];

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
  const candidates = [root.role, root.data, resources.role, resources.data, resources.item, resources];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function getRoles(): Promise<RoleApiModel[]> {
  try {
    const response = await fetchApi("/roles");
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load roles.");
    }

    return extractList(payload).map(normalizeRole);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return [];
  }
}

export async function getRoleById(roleId: string): Promise<RoleApiModel | null> {
  try {
    const response = await fetchApi(`/roles/${roleId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load role details.");
    }

    const item = extractOne(payload);
    return item ? normalizeRole(item) : null;
  } catch (error) {
    console.error(`Failed to fetch role ${roleId}:`, error);
    return null;
  }
}
