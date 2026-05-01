"use server";

import { revalidatePath } from "next/cache";
import { fetchApi, rethrowNextErrors } from "../common";

export type Doctor = {
  id: number;
  profile_image: string | null;
  profile_image_url: string | null;
  clinic_image: string | null;
  clinic_image_url: string | null;
  full_name: string;
  specialty: string;
  phone_number: string;
  email: string;
  district_id: number | null;
  hospital_name: string;
  consultation_fee: string;
  bmdc_registration_no: string;
  nid_no: string;
  available_days: string[] | null;
  available_time_slot: string;
  description: string;
  status: "pending" | "active" | "rejected";
  approved_by: number | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  district?: {
    id: number;
    name: string;
  };
};

export async function getDoctors(
  page = 1,
  search = "",
  status = "",
  districtId = "",
  specialty = "",
): Promise<{ data: Doctor[]; meta: any } | null> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(districtId && { district_id: districtId }),
      ...(specialty && { specialty }),
    });

    const response = await fetchApi(`/admin/doctors?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return {
      data: json.resources,
      meta: json.pagination,
    };
  } catch (error) {
    rethrowNextErrors(error);
    console.error("Failed to fetch doctors:", error);
    return null;
  }
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const response = await fetchApi(`/admin/doctors/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.resources || null;
  } catch (error) {
    rethrowNextErrors(error);
    console.error(`Failed to fetch doctor ${id}:`, error);
    return null;
  }
}

export async function updateDoctorStatus(
  id: number,
  status: "pending" | "active" | "rejected",
  rejection_reason?: string,
) {
  try {
    const response = await fetchApi(`/admin/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        ...(status === "rejected" && { rejection_reason }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update doctor status",
      };
    }

    revalidatePath("/admin/doctors/list");
    revalidatePath(`/admin/doctors/${id}`);

    return { success: true };
  } catch (error) {
    rethrowNextErrors(error);
    console.error(`Error updating doctor status ${id}:`, error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export type Appointment = {
  id: number;
  serial_number: number;
  doctor: {
    id: number;
    name: string;
    specialty: string;
  };
  full_name: string;
  age: number;
  phone_number: string;
  email: string | null;
  address: string;
  appointment_day: string;
  appointment_date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
};

export async function getAppointments(
  page = 1,
  search = "",
  status = "",
  doctorId = "",
  date = "",
  specialty = "",
): Promise<{ data: Appointment[]; meta: any } | null> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(doctorId && { doctor_id: doctorId }),
      ...(date && { date }),
      ...(specialty && { specialty }),
    });

    const response = await fetchApi(`/admin/doctor-appointments?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return {
      data: json.resources,
      meta: json.pagination,
    };
  } catch (error) {
    rethrowNextErrors(error);
    console.error("Failed to fetch appointments:", error);
    return null;
  }
}

export async function updateAppointmentStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled" | "completed",
) {
  try {
    const response = await fetchApi(`/admin/doctor-appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update appointment status",
      };
    }

    revalidatePath("/admin/doctor-appointments");

    return { success: true };
  } catch (error) {
    rethrowNextErrors(error);
    console.error(`Error updating appointment status ${id}:`, error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
