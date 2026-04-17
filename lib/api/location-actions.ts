"use server";

import { fetchApi } from "./common";

export type CityOption = {
  id: string;
  name: string;
};

export type CityOptionsActionResult = {
  ok: boolean;
  message: string;
  items: CityOption[];
};

export async function getCitiesAction(): Promise<CityOptionsActionResult> {
  try {
    // Cache for 10 minutes (600 seconds)
    const response = await fetchApi("/cities", {
      next: { revalidate: 600 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load cities.",
        items: [],
      };
    }

    // data.data because responseSuccess usually wraps in data
    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch cities error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}
