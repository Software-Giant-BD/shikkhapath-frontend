"use server";

import { fetchApi } from "./common";
import { type BloodDonor } from "./blood-donation";
import { type BasePagination } from "./api-utils";

export async function registerBloodDonorAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchApi("/blood-donors", {
      method: "POST",
      body: formData,
    }, { includeAuth: false });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      return {
        success: true,
        message: data?.message || "Registration successful. It will be approved within 24 hours.",
      };
    } else {
      return {
        success: false,
        message: data?.message || "An error occurred during registration.",
      };
    }
  } catch (error) {
    console.error("Donor registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }
}

export async function getBloodDonorsAction(params: { district_id?: string | number; blood_group?: string; page?: number } = {}): Promise<{ items: BloodDonor[]; pagination: BasePagination }> {
  try {
    const query = new URLSearchParams();
    if (params.district_id) query.set("district_id", params.district_id.toString());
    if (params.blood_group) query.set("blood_group", params.blood_group);
    if (params.page) query.set("page", params.page.toString());

    const response = await fetchApi(`/blood-donors?${query.toString()}`, {
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
    console.error("Fetch blood donors error:", error);
    return { items: [], pagination: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
  }
}
