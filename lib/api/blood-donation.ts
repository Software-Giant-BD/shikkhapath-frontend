"use server";

import { fetchApi } from "./common";
import { type BloodGroup } from "@/lib/constants/blood-groups";

export type DonorStatus = "pending" | "approved" | "rejected";

export type BloodDonor = {
  id: string;
  full_name: string;
  phone_number: string;
  district: string;
  district_id: number;
  blood_group: BloodGroup;
  last_donation_date?: string;
  is_available: boolean;
  status: DonorStatus;
  nid_number: string;
  image_url?: string;
  created_at: string;
};

export type RegisterDonorParams = {
  full_name: string;
  phone_number: string;
  district_id: number | string;
  blood_group: BloodGroup;
  nid_number: string;
  last_donation_date?: string;
  is_available: boolean;
  image?: File;
};

export async function getDonors(
  bloodGroup?: string,
  districtId?: string | number,
): Promise<BloodDonor[]> {
  try {
    const query = new URLSearchParams();
    if (bloodGroup && bloodGroup !== "All")
      query.set("blood_group", bloodGroup);
    if (districtId && districtId !== "All")
      query.set("district_id", districtId.toString());

    const response = await fetchApi(
      `/blood-donors?${query.toString()}`,
      {
        cache: "no-store",
      },
      { includeAuth: false },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      return [];
    }

    return Array.isArray(data.resources) ? data.resources : [];
  } catch (error) {
    console.error("Fetch donors error:", error);
    return [];
  }
}

export async function registerDonor(
  data: RegisterDonorParams,
): Promise<{ ok: boolean; message: string }> {
  try {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("phone_number", data.phone_number);
    formData.append("district_id", data.district_id.toString());
    formData.append("blood_group", data.blood_group);
    formData.append("nid_number", data.nid_number);
    if (data.last_donation_date)
      formData.append("last_donation_date", data.last_donation_date);
    formData.append("is_available", String(data.is_available));

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetchApi(
      "/blood-donors",
      {
        method: "POST",
        body: formData,
      },
      { includeAuth: false },
    );

    const result = await response.json().catch(() => null);

    if (response.ok) {
      return {
        ok: true,
        message:
          result?.message ||
          "Registration successful! You will be visible once approved.",
      };
    } else {
      return {
        ok: false,
        message: result?.message || "An error occurred during registration.",
      };
    }
  } catch (error) {
    console.error("Donor registration error:", error);
    return {
      ok: false,
      message: "An error occurred during registration.",
    };
  }
}
