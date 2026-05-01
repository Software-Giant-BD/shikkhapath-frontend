import { fetchApi, extractPagination } from "./common";

export type Advertisement = {
  id: number;
  name: string;
  category: string;
  placement: string;
  image: string | null;
  redirect_url: string | null;
  status: boolean;
};

export async function getAdvertisements(params?: { page?: number; per_page?: number; category?: string; placement?: string; status?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params?.category) searchParams.set("category", params.category);
  if (params?.placement) searchParams.set("placement", params.placement);
  if (params?.status !== undefined) searchParams.set("status", params.status ? '1' : '0');

  const response = await fetchApi(`/admin/advertisements?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    return { items: [], pagination: extractPagination({}, 1, 10) };
  }

  const data = await response.json();
  const items = Array.isArray(data.resources) ? data.resources : (Array.isArray(data.data) ? data.data : data);

  return {
    items: items as Advertisement[],
    pagination: extractPagination(data, params?.page ?? 1, params?.per_page ?? 10),
  };
}

export async function getCustomerAdvertisements(params?: { category?: string; placement?: string; }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.placement) searchParams.set("placement", params.placement);

  const response = await fetchApi(`/advertisements?${searchParams.toString()}`, {
    next: {
      revalidate: 300, // 5 minutes
      tags: ["advertisements"],
    },
  }, { includeAuth: false });

  if (!response.ok) {
    return { items: [] };
  }

  const data = await response.json();
  const items = Array.isArray(data.resources) ? data.resources : [];

  return {
    items: items as Advertisement[],
  };
}

export async function getAdvertisement(id: number | string) {
  const response = await fetchApi(`/admin/advertisements/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  return (data.resources ?? []) as Advertisement;
}
