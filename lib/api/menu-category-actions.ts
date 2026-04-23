"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "@/lib/api/common";

export type MenuCategoryItem = {
  id: string;
  title: string;
  slug: string;
};

export type MenuCategoryActionResult = {
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

export async function getMenuCategoriesAction(): Promise<MenuCategoryItem[]> {
  try {
    const response = await fetchApi("/admin/website-menu-categories");
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return [];
    }

    const root = asObject(payload);
    const list: unknown[] = Array.isArray(root.resources)
      ? (root.resources as unknown[])
      : Array.isArray(payload)
        ? payload
        : [];

    return list
      .map((entry) => {
        const row = asObject(entry);
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
      .filter((item): item is MenuCategoryItem & { sort_order: number } => item !== null)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ id, title, slug }) => ({ id, title, slug }));
  } catch {
    return [];
  }
}

export async function updateMenuCategoriesAction(
  categoryIdsInOrder: string[],
): Promise<MenuCategoryActionResult> {
  try {
    const response = await fetchApi("/admin/website-menu-categories", {
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
        message: message ?? "Failed to save menu categories.",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/categories/menu");

    return {
      ok: true,
      message: message ?? "Menu category order saved successfully.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not update menu categories right now.",
    };
  }
}
