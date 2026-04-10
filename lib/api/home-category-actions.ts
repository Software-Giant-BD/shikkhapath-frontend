"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "@/lib/api/common";

export type HomeCategoryItem = {
  id: string;
  title: string;
  slug: string;
};

export type HomeCategoryActionResult = {
  ok: boolean;
  message: string;
};

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function getHomeCategoriesAction(): Promise<HomeCategoryItem[]> {
  try {
    const response = await fetchApi("/admin/home-page-categories");
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return [];
    }

    // Response shape: { success, message, resources: [ { id, category_id, sort_order, category: {...} } ] }
    const root = asObject(payload);
    const list: unknown[] = Array.isArray(root.resources)
      ? (root.resources as unknown[])
      : Array.isArray(payload)
        ? payload
        : [];

    return list
      .map((entry) => {
        const row = asObject(entry);
        // Prefer nested category object; fall back to the row itself.
        const cat = asObject(row.category ?? entry);
        const id = asString(cat.id || row.category_id);
        if (!id) return null;
        return {
          id,
          title: asString(cat.title),
          slug: asString(cat.slug),
          sort_order: Number(asString(row.sort_order, "0")),
        };
      })
      .filter((item): item is HomeCategoryItem & { sort_order: number } => item !== null)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, title, slug }) => ({ id, title, slug }));
  } catch {
    return [];
  }
}

export async function updateHomeCategoriesAction(
  categoryIdsInOrder: string[],
): Promise<HomeCategoryActionResult> {
  try {
    const response = await fetchApi("/admin/home-page-categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_ids: categoryIdsInOrder }),
    });

    const data = await response.json().catch(() => null);
    const message =
      data && typeof data === "object" && typeof (data as Record<string, unknown>).message === "string"
        ? String((data as Record<string, unknown>).message)
        : undefined;

    if (!response.ok) {
      return {
        ok: false,
        message: message ?? "Failed to save homepage categories.",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/categories/homepage");

    return {
      ok: true,
      message: message ?? "Homepage category order saved successfully.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not update homepage categories right now.",
    };
  }
}
