"use server";

import { fetchApi } from "./common";

export type LocationOption = {
  id: string;
  name: string;
  bn_name?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  url_slug?: string;
  excerpt: string;
  feature_image_url: string | null;
  publish_at: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
};

export type LocationOptionsActionResult = {
  ok: boolean;
  message: string;
  items: LocationOption[];
};

export async function getDivisionsAction(): Promise<LocationOptionsActionResult> {
  try {
    const response = await fetchApi("/divisions", {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load divisions.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: item.bn_name ? String(item.bn_name) : undefined,
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch divisions error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}

export async function getDistrictsAction(divisionId?: string): Promise<LocationOptionsActionResult> {
  try {
    const url = divisionId ? `/districts?division_id=${divisionId}` : "/districts";
    const response = await fetchApi(url, {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load districts.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: item.bn_name ? String(item.bn_name) : undefined,
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch districts error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}

export async function getUpazilasAction(districtId?: string): Promise<LocationOptionsActionResult> {
  try {
    const url = districtId ? `/upazilas?district_id=${districtId}` : "/upazilas";
    const response = await fetchApi(url, {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load upazilas.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: item.bn_name ? String(item.bn_name) : undefined,
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch upazilas error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}

export type PaginationInfo = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function getLocalNewsAction(params: {
  division_id?: string;
  district_id?: string;
  upazila_id?: string;
  page?: number;
}): Promise<{ ok: boolean; news: NewsItem[]; pagination?: PaginationInfo }> {
  try {
    const query = new URLSearchParams();
    if (params.division_id) query.set("division_id", params.division_id);
    if (params.district_id) query.set("district_id", params.district_id);
    if (params.upazila_id) query.set("upazila_id", params.upazila_id);
    if (params.page) query.set("page", String(params.page));
    query.set("per_page", "12");

    const path = query.toString() ? `/local-news?${query.toString()}` : "/local-news";
    const response = await fetchApi(path, undefined, { includeAuth: false });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, news: [] };
    }

    const resources = data?.resources?.news || data?.news || data?.resources || [];
    const paginationData = data?.resources?.pagination || data?.pagination || null;

    const news = (Array.isArray(resources) ? resources : []).map((item: any) => ({
      id: String(item.id),
      title: String(item.title),
      slug: String(item.slug),
      url_slug: String(item.url_slug || item.urlSlug || item.slug),
      excerpt: String(item.excerpt || ""),
      feature_image_url: item.feature_image_url || item.featureImageUrl || null,
      publish_at: String(item.publish_at || ""),
      category: item.category
        ? {
            id: String(item.category.id),
            title: String(item.category.title),
            slug: String(item.category.slug),
          }
        : undefined,
    }));

    return { 
      ok: true, 
      news, 
      pagination: paginationData 
        ? {
            current_page: Number(paginationData.current_page),
            last_page: Number(paginationData.last_page),
            per_page: Number(paginationData.per_page),
            total: Number(paginationData.total),
          }
        : undefined
    };
  } catch (error) {
    console.error("Fetch local news error:", error);
    return { ok: false, news: [] };
  }
}
