"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "./common";

export async function deleteNewsletterAction(id: string) {
  try {
    const response = await fetchApi(`/admin/newsletters/${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete subscription.",
      };
    }

    revalidatePath("/admin/newsletters/list");
    return {
      success: true,
      message: data?.message || "Subscription deleted successfully.",
    };
  } catch (error) {
    console.error("Newsletter delete error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}
