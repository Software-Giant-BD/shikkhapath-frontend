"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "../common";

export type SettingActionResult = {
  success: boolean;
  message: string;
  resources?: Record<string, string>;
};

export async function getSettingsAction(): Promise<SettingActionResult> {
  try {
    const response = await fetchApi("/admin/settings", {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to fetch settings",
      };
    }

    return {
      success: true,
      message: "Settings fetched successfully",
      resources: data.resources || {},
    };
  } catch (error) {
    return {
      success: false,
      message: "Settings API is unavailable",
    };
  }
}

export async function updateSettingsAction(settings: Record<string, any>): Promise<SettingActionResult> {
  try {
    const response = await fetchApi("/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update settings",
      };
    }

    revalidatePath("/admin/settings");
    // Also revalidate public pages that use settings
    revalidatePath("/", "layout"); 

    return {
      success: true,
      message: data?.message || "Settings updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Settings API is unavailable",
    };
  }
}
