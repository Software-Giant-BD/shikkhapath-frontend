"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "./common";
import {
  type PoliceStation,
  type PoliceStationListResponse,
} from "./police-station-types";

export type {
  PoliceStation,
  PoliceStationPagination,
  PoliceStationListResponse,
} from "./police-station-types";

export async function getPoliceStations(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  division_id?: number;
  district_id?: number;
  upazila_id?: number;
  division?: string; // for backward compatibility
  city?: string; // for backward compatibility
  area?: string; // for backward compatibility
  userLat?: number; // for backward compatibility
  userLng?: number; // for backward compatibility
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

  // Backward compatibility filters
  if (params?.division && params.division !== "All")
    query.set("division", params.division);
  if (params?.city) query.set("city", params.city);
  if (params?.area) query.set("area", params.area);
  if (params?.userLat) query.set("latitude", params.userLat.toString());
  if (params?.userLng) query.set("longitude", params.userLng.toString());

  const endpoint = params?.isAdmin
    ? "/admin/police-stations"
    : "/police-stations";
  const response = await fetchApi(
    `${endpoint}?${query.toString()}`,
    {},
    { includeAuth: !!params?.isAdmin },
  );
  const data = await response.json().catch(() => null);

  if (params?.isAdmin) {
    return { items: data?.resources || [], pagination: data?.pagination };
  }

  return data?.resources || [];
}

export async function getPoliceStation(id: number): Promise<PoliceStation> {
  const response = await fetchApi(`/admin/police-stations/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch station");
  return data.resources;
}

export async function createPoliceStation(data: any) {
  const response = await fetchApi("/admin/police-stations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to create station");
  revalidatePath("/admin/police-stations");
  return result.resources;
}

export async function updatePoliceStation(id: number, data: any) {
  const response = await fetchApi(`/admin/police-stations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update station");
  revalidatePath("/admin/police-stations");
  return result.resources;
}

export async function deletePoliceStation(id: number) {
  const response = await fetchApi(`/admin/police-stations/${id}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to delete station");
  revalidatePath("/admin/police-stations");
  return result.resources;
}
