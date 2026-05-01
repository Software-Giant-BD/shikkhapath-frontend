"use server";

import { fetchApi } from "../common";
import { type BloodDonor } from "../blood-donation";
import { type BasePagination } from "../api-utils";

export type AdminBloodDonorFilters = {
  status?: string;
  blood_group?: string;
  district_id?: string | number;
  search?: string;
  page?: number;
  per_page?: number;
};

export async function getAdminBloodDonorsAction(
  filters: AdminBloodDonorFilters = {},
) {
  try {
    const query = new URLSearchParams();
    if (filters.status) query.set("status", filters.status);
    if (filters.blood_group) query.set("blood_group", filters.blood_group);
    if (filters.district_id) query.set("district_id", filters.district_id.toString());
    if (filters.search) query.set("search", filters.search);
    if (filters.page) query.set("page", filters.page.toString());
    if (filters.per_page) query.set("per_page", filters.per_page.toString());

    const response = await fetchApi(`/admin/blood-donors?${query.toString()}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to fetch blood donors",
        items: [],
        pagination: null,
      };
    }

    return {
      success: true,
      items: data.resources as BloodDonor[],
      pagination: data.pagination as BasePagination,
    };
  } catch (error) {
    console.error("Admin fetch blood donors error:", error);
    return {
      success: false,
      message: "Server error",
      items: [],
      pagination: null,
    };
  }
}

export async function updateBloodDonorStatusAction(id: string, status: string) {
  try {
    const response = await fetchApi(`/admin/blood-donors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update status",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Admin update blood donor status error:", error);
    return { success: false, message: "Server error" };
  }
}

export async function deleteBloodDonorAction(id: string) {
  try {
    const response = await fetchApi(`/admin/blood-donors/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete donor",
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Admin delete blood donor error:", error);
    return { success: false, message: "Server error" };
  }
}
