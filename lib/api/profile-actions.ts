"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "./common";

export type ProfileActionResult = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
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

export async function updateProfileAction(
  payload: FormData,
): Promise<ProfileActionResult> {
  try {
    const response = await fetchApi("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(payload.entries())),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update profile."),
        errors: data?.errors,
      };
    }

    revalidatePath("/admin/profile");
    return {
      ok: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      ok: false,
      message: "Profile API is unavailable.",
    };
  }
}
