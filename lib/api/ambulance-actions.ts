"use server";

import { fetchApi } from "./common";
import { type AmbulanceService } from "./ambulance";
import { type BasePagination } from "./api-utils";

export type RegisterAmbulanceParams = {
  full_name: string;
  phone_number: string;
  location: string;
  nid_number: string;
  description: string;
  ambulance_photo?: File;
  nid_copy?: File;
  manager_photo?: File;
};

export async function getAmbulanceServicesAction(params: { district_id?: string | number; page?: number } = {}): Promise<{ items: AmbulanceService[]; pagination: BasePagination }> {
  try {
    const query = new URLSearchParams();
    if (params.district_id) query.set("district_id", params.district_id.toString());
    if (params.page) query.set("page", params.page.toString());

    const response = await fetchApi(`/ambulances?${query.toString()}`, {
        cache: "no-store"
    }, { includeAuth: false });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
        return { items: [], pagination: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
    }

    return {
        items: Array.isArray(data.resources) ? data.resources : [],
        pagination: data.pagination || { current_page: 1, last_page: 1, per_page: 15, total: 0 }
    };
  } catch (error) {
    console.error("Fetch ambulances error:", error);
    return { items: [], pagination: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
  }
}

export async function registerAmbulanceAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchApi("/ambulance-registration", {
      method: "POST",
      body: formData,
    }, { includeAuth: false });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      return {
        success: true,
        message: data?.message || "Registration submitted successfully. Pending admin approval.",
      };
    } else {
      return {
        success: false,
        message: data?.message || "An error occurred during registration.",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }
}
