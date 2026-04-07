"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "./common";

export type UserActionResult = {
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

export async function createUserAction(payload: FormData): Promise<UserActionResult> {
  try {
    const response = await fetchApi("/admin/users", {
      method: "POST",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to create user."),
      };
    }

    revalidatePath("/admin/users/list");
    return {
      ok: true,
      message: getMessage(data, "User created successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "User API is unavailable.",
    };
  }
}

export async function updateUserAction(userId: string, payload: FormData): Promise<UserActionResult> {
  try {
    const response = await fetchApi(`/admin/users/${userId}`, {
      method: "PUT",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update user."),
      };
    }

    revalidatePath("/admin/users/list");
    revalidatePath(`/admin/users/${userId}/edit`);

    return {
      ok: true,
      message: getMessage(data, "User updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "User API is unavailable.",
    };
  }
}
