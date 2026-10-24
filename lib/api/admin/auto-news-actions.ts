"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "../common";

export type CategoryDistributionItem = {
  id: number;
  title: string;
  slug: string;
  count: number;
  max_limit: number;
};

export type AutoNewsSettings = {
  enabled: boolean;
  daily_limit: number;
  category_daily_limit?: number;
  calculated_category_limit?: number;
  base_category_share?: number;
  active_categories_count?: number;
  categories_distribution?: CategoryDistributionItem[];
  default_status: "published" | "draft";
  generate_image: boolean;
  image_provider: string;
  gemini_api_key?: string;
  gemini_model?: string;
  openrouter_api_key?: string;
  openrouter_model?: string;
  today_processed: number;
  active_sources_count: number;
  total_sources_count: number;
};

export type NewsSourceSectionItem = {
  id: number;
  news_source_id: number;
  name: string;
  section_url: string;
  feed_type: "scraper" | "rss";
  category_id: number | null;
  filter_mode: "none" | "keyword";
  status: "active" | "inactive";
  total_fetched: number;
  last_fetched_at: string | null;
  category?: {
    id: number;
    title: string;
    slug: string;
  } | null;
};

export type NewsSourceItem = {
  id: number;
  name: string;
  website_url: string;
  has_rss: boolean;
  rss_feed_url: string | null;
  default_category_id: number | null;
  filter_mode: "none" | "keyword";
  target_section_name: string | null;
  priority?: number;
  status: "active" | "inactive";
  last_fetched_at: string | null;
  total_fetched: number;
  today_fetched?: number;
  total_sections?: number;
  sections?: NewsSourceSectionItem[];
  default_category?: {
    id: number;
    title: string;
    slug: string;
  } | null;
};

export type CategoryWithKeywords = {
  id: number;
  title: string;
  slug: string;
  match_keywords: string[];
  children?: {
    id: number;
    title: string;
    slug: string;
    match_keywords: string[];
  }[];
};

export type AutoNewsLogItem = {
  id: number;
  news_source_id: number | null;
  news_id: number | null;
  original_title: string;
  original_url: string;
  assigned_category_id: number | null;
  status: "success" | "failed" | "skipped";
  error_message: string | null;
  fetched_at: string;
  created_at: string;
  news_source?: {
    id: number;
    name: string;
    website_url: string;
  } | null;
  assigned_category?: {
    id: number;
    title: string;
    slug: string;
  } | null;
  news?: {
    id: number;
    title: string;
    unique_code: string;
    status: string;
    feature_image_id?: number | null;
    feature_image?: {
      original_url?: string;
    } | null;
  } | null;
};

export async function getAutoNewsSettingsAction() {
  try {
    const res = await fetchApi("/admin/auto-news/settings", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to fetch settings" };
    }

    return { success: true, settings: data.resources as AutoNewsSettings };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function updateAutoNewsSettingsAction(settings: Partial<AutoNewsSettings>) {
  try {
    const res = await fetchApi("/admin/auto-news/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to update settings" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Settings updated successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function getNewsSourcesAction() {
  try {
    const res = await fetchApi("/admin/news-sources", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to fetch sources", sources: [] };
    }

    return { success: true, sources: (data.resources || []) as NewsSourceItem[] };
  } catch {
    return { success: false, message: "Server connection failed", sources: [] };
  }
}

export async function detectNewsSourceRssAction(websiteUrl: string) {
  try {
    const res = await fetchApi("/admin/news-sources/detect-rss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website_url: websiteUrl }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to detect RSS feed",
        found: false,
        feed_url: null,
      };
    }

    const resources = data.resources || {};
    return {
      success: true,
      found: Boolean(resources.found),
      feed_url: (resources.feed_url as string) || null,
      method: (resources.method as string) || null,
      message: (resources.message as string) || data?.message || "Detection complete",
    };
  } catch {
    return {
      success: false,
      message: "Server connection failed",
      found: false,
      feed_url: null,
    };
  }
}

export async function createNewsSourceAction(payload: {
  name: string;
  website_url: string;
  has_rss?: boolean;
  rss_feed_url?: string | null;
  default_category_id?: number | null;
  filter_mode?: "none" | "keyword";
  target_section_name?: string | null;
  status: "active" | "inactive";
}) {
  try {
    const res = await fetchApi("/admin/news-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to create source" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Source added successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function updateNewsSourceAction(
  id: number,
  payload: {
    name: string;
    website_url: string;
    has_rss: boolean;
    rss_feed_url?: string;
    default_category_id?: number | null;
    filter_mode?: "none" | "keyword";
    target_section_name?: string | null;
    status: "active" | "inactive";
  }
) {
  try {
    const res = await fetchApi(`/admin/news-sources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to update source" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Source updated successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function deleteNewsSourceAction(id: number) {
  try {
    const res = await fetchApi(`/admin/news-sources/${id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to delete source" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Source deleted successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function toggleNewsSourceAction(id: number) {
  try {
    const res = await fetchApi(`/admin/news-sources/${id}/toggle`, {
      method: "PATCH",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to toggle source" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Source status updated" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function reorderNewsSourcesAction(sourceIds: number[]) {
  try {
    const res = await fetchApi("/admin/news-sources/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_ids: sourceIds }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to reorder sources" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Sources priority reordered successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function getCategoryKeywordsAction() {
  try {
    const res = await fetchApi("/admin/auto-news/category-keywords", {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to fetch categories", categories: [] };
    }

    return { success: true, categories: (data.resources || []) as CategoryWithKeywords[] };
  } catch {
    return { success: false, message: "Server connection failed", categories: [] };
  }
}

export async function updateCategoryKeywordsAction(categoryId: number, keywords: string[]) {
  try {
    const res = await fetchApi("/admin/auto-news/category-keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, match_keywords: keywords }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to update keywords" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Keywords updated successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function generateCategoryKeywordsAction(categoryId: number, autoSave: boolean = false) {
  try {
    const res = await fetchApi("/admin/auto-news/category-keywords/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, auto_save: autoSave }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to generate AI keywords",
        keywords: [] as string[],
      };
    }

    if (autoSave) {
      revalidatePath("/admin/settings/auto-news");
    }

    const resources = data.resources || {};
    return {
      success: true,
      message: data?.message || "AI tags generated successfully",
      categoryId: (resources.category_id as number) ?? categoryId,
      keywords: (resources.match_keywords as string[]) || [],
    };
  } catch {
    return {
      success: false,
      message: "Server connection failed",
      keywords: [] as string[],
    };
  }
}

export async function getAutoNewsLogsAction(page = 1, perPage = 15, status?: string) {
  try {
    const statusParam = status && status !== "all" ? `&status=${encodeURIComponent(status)}` : "";
    const res = await fetchApi(`/admin/auto-news/logs?page=${page}&per_page=${perPage}${statusParam}`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to fetch logs", items: [], pagination: null };
    }

    const items = Array.isArray(data.resources)
      ? data.resources
      : (data.resources?.items || []);
    const pagination = data.pagination || data.resources?.pagination;

    return {
      success: true,
      items: items as AutoNewsLogItem[],
      pagination: {
        total: Number(pagination?.total || items.length || 0),
        current_page: Number(pagination?.current_page || 1),
        last_page: Number(pagination?.last_page || 1),
      },
    };
  } catch {
    return { success: false, message: "Server connection failed", items: [], pagination: null };
  }
}

export async function triggerAutoNewsAction(limit?: number) {
  try {
    const res = await fetchApi("/admin/auto-news/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(limit ? { limit } : {}),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Trigger failed", result: null };
    }

    revalidatePath("/admin/settings/auto-news");
    revalidatePath("/admin/news");
    return { success: true, message: data?.message || "Auto-news processed", result: data.resources };
  } catch {
    return { success: false, message: "Server connection failed", result: null };
  }
}

export async function createNewsSourceSectionAction(
  sourceId: number,
  payload: {
    name: string;
    section_url: string;
    feed_type: "scraper" | "rss";
    category_id?: number | null;
    filter_mode: "none" | "keyword";
    status?: "active" | "inactive";
  }
) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to add section" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Category section added successfully", section: data.resources as NewsSourceSectionItem };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function updateNewsSourceSectionAction(
  sourceId: number,
  sectionId: number,
  payload: {
    name: string;
    section_url: string;
    feed_type: "scraper" | "rss";
    category_id?: number | null;
    filter_mode: "none" | "keyword";
    status: "active" | "inactive";
  }
) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/sections/${sectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to update section" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Category section updated successfully", section: data.resources as NewsSourceSectionItem };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function deleteNewsSourceSectionAction(sourceId: number, sectionId: number) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/sections/${sectionId}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to delete section" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Section deleted successfully" };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export async function toggleNewsSourceSectionAction(sourceId: number, sectionId: number) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/sections/${sectionId}/toggle`, {
      method: "PATCH",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to toggle section" };
    }

    revalidatePath("/admin/settings/auto-news");
    return { success: true, message: data?.message || "Status updated successfully", section: data.resources as NewsSourceSectionItem };
  } catch {
    return { success: false, message: "Server connection failed" };
  }
}

export type AiDetectedCategoryItem = {
  external_name: string;
  section_url: string;
  feed_type: "scraper" | "rss";
  matched_category_id: number | null;
  matched_category_title: string | null;
  confidence: "high" | "medium" | "low" | "none";
  filter_mode: "none" | "keyword";
  already_linked?: boolean;
};

export async function aiDetectPortalSectionsAction(sourceId: number) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/ai-detect-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to auto-detect categories",
        categories: [] as AiDetectedCategoryItem[],
        total_detected: 0,
      };
    }

    const resources = data.resources || {};
    return {
      success: true,
      message: data?.message || "AI detected categories successfully",
      categories: (resources.categories || []) as AiDetectedCategoryItem[],
      total_detected: resources.total_detected || 0,
    };
  } catch {
    return {
      success: false,
      message: "Server connection failed",
      categories: [] as AiDetectedCategoryItem[],
      total_detected: 0,
    };
  }
}

export async function batchSaveNewsSourceSectionsAction(
  sourceId: number,
  sections: Array<{
    name: string;
    section_url: string;
    feed_type: "scraper" | "rss";
    category_id: number | null;
    filter_mode: "none" | "keyword";
    status?: "active" | "inactive";
  }>
) {
  try {
    const res = await fetchApi(`/admin/news-sources/${sourceId}/batch-sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to batch save sections", sections: [] };
    }

    revalidatePath("/admin/settings/auto-news");
    return {
      success: true,
      message: data?.message || "Sections imported successfully",
      sections: (data.resources?.sections || []) as NewsSourceSectionItem[],
    };
  } catch {
    return { success: false, message: "Server connection failed", sections: [] };
  }
}

