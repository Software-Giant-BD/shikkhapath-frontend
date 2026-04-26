"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { fetchApi } from "./common";

export async function createAdvertisementAction(payload: object | FormData) {
  try {
    const isFormData = payload instanceof FormData;
    const response = await fetchApi("/admin/advertisements", {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, message: "Failed to create advertisement." };
    }

    revalidatePath("/admin/advertisements");
    revalidateTag("advertisements", "page");
    return { ok: true, message: "Advertisement created successfully." };
  } catch (error) {
    return { ok: false, message: "API is unavailable." };
  }
}

export async function updateAdvertisementAction(
  id: string | number,
  payload: object | FormData,
) {
  try {
    const isFormData = payload instanceof FormData;
    if (isFormData) {
      payload.append("_method", "PUT");
    }

    const response = await fetchApi(`/admin/advertisements/${id}`, {
      method: isFormData ? "POST" : "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, message: "Failed to update advertisement." };
    }

    revalidatePath("/admin/advertisements");
    revalidatePath(`/admin/advertisements/${id}`);
    revalidateTag("advertisements", "page");
    return { ok: true, message: "Advertisement updated successfully." };
  } catch (error) {
    return { ok: false, message: "API is unavailable." };
  }
}

export async function deleteAdvertisementAction(id: string | number) {
  try {
    const response = await fetchApi(`/admin/advertisements/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { ok: false, message: "Failed to delete advertisement." };
    }

    revalidatePath("/admin/advertisements");
    revalidateTag("advertisements", "page");
    return { ok: true, message: "Advertisement deleted successfully." };
  } catch (error) {
    return { ok: false, message: "API is unavailable." };
  }
}

export async function updateAdvertisementStatusAction(
  id: string | number,
  status: boolean,
) {
  try {
    const response = await fetchApi(`/admin/advertisements/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      return { ok: false, message: "Failed to update status." };
    }

    revalidatePath("/admin/advertisements");
    revalidateTag("advertisements", "page");
    return { ok: true, message: "Status updated successfully." };
  } catch (error) {
    return { ok: false, message: "API is unavailable." };
  }
}
