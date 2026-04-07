"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "./common";

export type CategoryActionResult = {
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

export async function createCategoryAction(payload: FormData): Promise<CategoryActionResult> {
  try {
    const response = await fetchApi("/admin/categories", {
      method: "POST",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to create category."),
      };
    }

    revalidatePath("/admin/categories/list");
    return {
      ok: true,
      message: getMessage(data, "Category created successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Category API is unavailable.",
    };
  }
}

export async function updateCategoryAction(catId: string, payload: FormData): Promise<CategoryActionResult> {
  try {
    const response = await fetchApi(`/admin/categories/${catId}`, {
      method: "PUT",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update category."),
      };
    }

    revalidatePath("/admin/categories/list");
    revalidatePath(`/admin/categories/${catId}/edit`);

    return {
      ok: true,
      message: getMessage(data, "Category updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Category API is unavailable.",
    };
  }
}
