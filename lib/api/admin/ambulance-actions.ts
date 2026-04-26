"use server";

import { revalidatePath } from "next/cache";
import { fetchApi, type FieldErrors } from "../common";
import { type AmbulanceService, type BasePagination } from "../ambulance";

export type AmbulanceActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: FieldErrors;
};

export type AmbulanceStatus = "pending" | "approved" | "rejected";

function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }
  return fallback;
}

export async function getAdminAmbulanceList(params: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}): Promise<{ items: AmbulanceService[]; pagination: BasePagination }> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.per_page) query.append("per_page", params.per_page.toString());
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const response = await fetchApi(`/admin/ambulances?${query.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    return {
      items: [],
      pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    };
  }

  return {
    items: data.resources,
    pagination: data.pagination,
  };
}

export async function updateAmbulanceStatusAction(
  ambulanceId: string,
  status: AmbulanceStatus,
  rejectionReason?: string,
): Promise<AmbulanceActionResult> {
  try {
    const response = await fetchApi(`/admin/ambulances/${ambulanceId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejection_reason: rejectionReason }),
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
        message: getMessage(data, "Failed to update ambulance status."),
      };
    }

    revalidatePath("/admin/ambulances");
    return {
      ok: true,
      message: getMessage(data, "Ambulance status updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Ambulance API is unavailable.",
    };
  }
}
