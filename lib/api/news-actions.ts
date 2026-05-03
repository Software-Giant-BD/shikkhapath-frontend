"use server";

import { revalidatePath } from "next/cache";

import { fetchApi, type FieldErrors } from "./common";
import { getLatestNews } from "./news";

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
  unique_code?: string;
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
  tags?: string[];
  language?: string;
  read_time_minutes?: number;
  is_featured?: boolean;
  show_in_home_left?: boolean;
  is_breaking?: boolean;
  allow_comments?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  division_id?: string;
  district_id?: string;
  upazila_id?: string;
};

export async function createNewsAction(
  payload: CreateNewsPayload,
): Promise<NewsActionResult> {
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

export async function updateNewsAction(
  newsId: string,
  payload: CreateNewsPayload,
): Promise<NewsActionResult> {
  try {
    const response = await fetchApi(`/admin/news/${newsId}`, {
      method: "PUT",
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
        message: getMessage(data, "Failed to update news."),
      };
    }

    revalidatePath("/admin/news/list");
    revalidatePath(`/admin/news/${newsId}/edit`);
    return {
      ok: true,
      message: getMessage(data, "News updated successfully."),
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

export async function getInitialSearchNewsAction() {
  try {
    const news = await getLatestNews();
    return {
      ok: true,
      items: news,
    };
  } catch (error) {
    console.error("Failed to fetch initial search news:", error);
    return {
      ok: false,
      items: [],
    };
  }
}

export async function searchCustomerNewsAction(params: {
  q?: string;
  category_id?: string;
  author?: string;
  type?: string;
  date?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}) {
  const { searchCustomerNews } = await import("./news");
  return await searchCustomerNews(params);
}
