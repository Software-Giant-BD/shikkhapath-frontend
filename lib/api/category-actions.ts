"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "./common";

export type CategoryActionResult = {
  ok: boolean;
  message: string;
};

export type CategoryOption = {
  id: string;
  title: string;
  parent_id: string;
};

export type CategoryOptionsActionResult = {
  ok: boolean;
  message: string;
  items: CategoryOption[];
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

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function extractCategoryList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = asObject(payload);
  if (Array.isArray(root.resources)) {
    return root.resources;
  }

  const resources = asObject(root.resources);
  const candidates = [resources.categories, resources.items, resources.data, root.categories, root.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
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

export async function getCategoriesByParentAction(
  parentId: string,
): Promise<CategoryOptionsActionResult> {
  if (!parentId.trim()) {
    return {
      ok: true,
      message: "Success",
      items: [],
    };
  }

  try {
    const response = await fetchApi(`/admin/categories?parent_id=${encodeURIComponent(parentId)}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to load sub-categories."),
        items: [],
      };
    }

    const items = extractCategoryList(data).map((item) => {
      const row = asObject(item);
      return {
        id: asString(row.id),
        title: asString(row.title),
        parent_id: asString(row.parent_id ?? row.parentId),
      };
    });

    return {
      ok: true,
      message: getMessage(data, "Success"),
      items,
    };
  } catch {
    return {
      ok: false,
      message: "Category API is unavailable.",
      items: [],
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
 
 export async function getAllCategoriesAction() {
   try {
     const response = await fetchApi("/categories", { cache: "no-store" }, { includeAuth: false });
     const payload = await response.json().catch(() => null);
 
     if (!response.ok) {
       return { ok: false, message: "Failed to load categories", items: [] };
     }
 
     const items = extractCategoryList(payload).map((item) => {
       const row = asObject(item);
       return {
         id: asString(row.id),
         title: asString(row.title),
         slug: asString(row.slug),
       };
     });
 
     return { ok: true, message: "Success", items };
   } catch {
     return { ok: false, message: "Category API is unavailable", items: [] };
   }
 }
