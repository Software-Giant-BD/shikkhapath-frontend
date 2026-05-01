"use server";

import { fetchApi } from "./common";
import { revalidatePath } from "next/cache";

export async function getFireStations(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  division_id?: number;
  district_id?: number;
  upazila_id?: number;
  latitude?: number;
  longitude?: number;
  isAdmin?: boolean;
}): Promise<any> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.per_page) query.set("per_page", params.per_page.toString());
  if (params?.search) query.set("search", params.search);
  if (params?.division_id)
    query.set("division_id", params.division_id.toString());
  if (params?.district_id)
    query.set("district_id", params.district_id.toString());
  if (params?.upazila_id) query.set("upazila_id", params.upazila_id.toString());
  if (params?.latitude) query.set("latitude", params.latitude.toString());
  if (params?.longitude) query.set("longitude", params.longitude.toString());

  const endpoint = params?.isAdmin ? "/admin/fire-stations" : "/fire-stations";
  const response = await fetchApi(
    `${endpoint}?${query.toString()}`,
    {},
    { includeAuth: !!params?.isAdmin }
  );
  
  const data = await response.json().catch(() => null);

  if (params?.isAdmin) {
    return {
      items: data?.resources || [],
      pagination: data?.pagination || {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1,
      },
    };
  }

  return data?.resources || [];
}

export async function createFireStation(data: any) {
  const response = await fetchApi("/admin/fire-stations", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({ success: false }));

  if (result.success) {
    revalidatePath("/admin/fire-stations");
  }

  return result;
}

export async function updateFireStation(id: number, data: any) {
  const response = await fetchApi(`/admin/fire-stations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({ success: false }));

  if (result.success) {
    revalidatePath("/admin/fire-stations");
  }

  return result;
}

export async function deleteFireStation(id: number) {
  const response = await fetchApi(`/admin/fire-stations/${id}`, {
    method: "DELETE",
  });

  const result = await response.json().catch(() => ({ success: false }));

  if (result.success) {
    revalidatePath("/admin/fire-stations");
  }

  return result;
}

export async function getFireStation(id: number) {
  const response = await fetchApi(`/admin/fire-stations/${id}`);
  const data = await response.json().catch(() => null);
  return data?.resources;
}
