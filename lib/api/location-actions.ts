"use server";

import { fetchApi } from "./common";

export type LocationOption = {
  id: string;
  name: string;
  bn_name?: string;
};

export type LocationOptionsActionResult = {
  ok: boolean;
  message: string;
  items: LocationOption[];
};

export async function getDivisionsAction(): Promise<LocationOptionsActionResult> {
  try {
    const response = await fetchApi("/divisions", {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load divisions.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: String(item.bn_name),
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch divisions error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}

export async function getDistrictsAction(divisionId?: string): Promise<LocationOptionsActionResult> {
  try {
    const url = divisionId ? `/districts?division_id=${divisionId}` : "/districts";
    const response = await fetchApi(url, {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load districts.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: String(item.bn_name),
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch districts error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}

export async function getUpazilasAction(districtId?: string): Promise<LocationOptionsActionResult> {
  try {
    const url = districtId ? `/upazilas?district_id=${districtId}` : "/upazilas";
    const response = await fetchApi(url, {
      next: { revalidate: 0 },
    } as any);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: data?.message || "Failed to load upazilas.",
        items: [],
      };
    }

    const items = (data?.resources || []).map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      bn_name: String(item.bn_name),
    }));

    return {
      ok: true,
      message: "Success",
      items,
    };
  } catch (error) {
    console.error("Fetch upazilas error:", error);
    return {
      ok: false,
      message: "Location API is unavailable.",
      items: [],
    };
  }
}
