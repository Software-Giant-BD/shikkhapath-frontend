"use server";

import { revalidatePath } from "next/cache";

import { fetchApi, type FieldErrors } from "./common";

export type NewsActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: FieldErrors;
};

export type NewsStatusValue = "draft" | "published" | "scheduled";

function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }
  return fallback;
}

export type CreateNewsPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category_id?: string;
  sub_category_id?: string;
  author_name?: string;
  source_name?: string;
  source_url?: string;
  feature_image_url?: string;
  status?: string;
  publish_at?: string;
  tags?: string;
  language?: string;
  read_time_minutes?: number;
  is_featured?: boolean;
  is_breaking?: boolean;
  allow_comments?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
};

export async function createNewsAction(payload: CreateNewsPayload): Promise<NewsActionResult> {
  try {
    const response = await fetchApi("/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 422 && data?.errors) {
        return {
          ok: false,
          message: getMessage(data, "Please fix the validation errors."),
          fieldErrors: data.errors as FieldErrors,
        };
      }
      return {
        ok: false,
        message: getMessage(data, "Failed to create news."),
      };
    }

    revalidatePath("/admin/news/list");
    return {
      ok: true,
      message: getMessage(data, "News created successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "News API is unavailable.",
    };
  }
}

export async function updateNewsStatusAction(
  newsId: string,
  status: NewsStatusValue,
): Promise<NewsActionResult> {
  try {
    const response = await fetchApi(`/admin/news/${newsId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update news status."),
      };
    }

    revalidatePath("/admin/news/list");
    return {
      ok: true,
      message: getMessage(data, "News status updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "News API is unavailable.",
    };
  }
}
