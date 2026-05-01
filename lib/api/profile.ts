import "server-only";

import { fetchApi, rethrowNextErrors } from "./common";

export type ProfileApiModel = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role_name: string;
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

function normalizeProfile(value: unknown): ProfileApiModel {
  const item = asObject(value);
  const user = asObject(item.resources);
  const role = asObject(user.role);

  return {
    id: asString(user.id),
    name: asString(user.name),
    email: asString(user.email),
    phone: asString(user.phone),
    role_name: asString(user.role_name ?? role.name),
  };
}

export async function getProfile(): Promise<ProfileApiModel | null> {
  try {
    const response = await fetchApi("/admin/profile");
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load profile.");
    }

    return normalizeProfile(payload);
  } catch (error) {
    rethrowNextErrors(error);
    console.error("Failed to fetch profile:", error);
    return null;
  }
}
