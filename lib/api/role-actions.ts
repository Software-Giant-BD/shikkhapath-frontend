"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "./common";

export type RoleActionResult = {
  ok: boolean;
  message: string;
};

function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}

export async function createRoleAction(payload: FormData): Promise<RoleActionResult> {
  try {
    const response = await fetchApi("/roles", {
      method: "POST",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to create role."),
      };
    }

    revalidatePath("/admin/roles/list");
    return {
      ok: true,
      message: getMessage(data, "Role created successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Role API is unavailable.",
    };
  }
}

export async function updateRoleAction(roleId: string, payload: FormData): Promise<RoleActionResult> {
  try {
    payload.set("_method", "put");

    const response = await fetchApi(`/roles/${roleId}`, {
      method: "POST",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update role."),
      };
    }

    revalidatePath("/admin/roles/list");
    revalidatePath(`/admin/roles/${roleId}/edit`);

    return {
      ok: true,
      message: getMessage(data, "Role updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Role API is unavailable.",
    };
  }
}
