"use server";
import { fetchApi } from "./common";
import { type MedicalSpecialty } from "@/lib/constants/specialties";

export type DoctorStatus = "pending" | "approved" | "rejected";

export type DoctorProfile = {
  id: string;
  name: string;
  specialty: MedicalSpecialty;
  location: string;
  hospital: string;
  phone_number: string;
  email?: string;
  fee?: number;
  available_days: string[];
  next_available: string;
  available_time: string;
  image_url?: string;
  clinic_image_url?: string;
  nid_number: string;
  bmdc_number?: string;
  status: DoctorStatus;
  created_at: string;
};

export type RegisterDoctorParams = {
  name: string;
  specialty: MedicalSpecialty;
  location: string;
  hospital: string;
  phone_number: string;
  email?: string;
  fee?: number;
  available_days: string[];
  available_time: string;
  nid_number: string;
  bmdc_number?: string;
  profile_image?: File;
  clinic_image?: File;
};



export async function getDoctors(
  specialty?: string,
  districtId?: string,
): Promise<{ data: DoctorProfile[]; pagination?: any }> {
  const params = new URLSearchParams();
  if (specialty && specialty !== "All") {
    params.append("specialty", specialty);
  }
  if (districtId && districtId !== "All") {
    params.append("district_id", districtId);
  }

  try {
    const response = await fetchApi(`/doctors?${params.toString()}`, {
      method: "GET",
    });

    const result = await response.json().catch(() => null);

    if (response.ok && result?.resources) {
      const doctors = result.resources.map((d: any) => ({
        id: d.id,
        name: d.full_name,
        specialty: d.specialty,
        location: d.district_name || "",
        hospital: d.hospital_name,
        phone_number: d.phone_number,
        email: d.email,
        fee: d.consultation_fee,
        available_days: d.available_days || [],
        next_available: d.next_available || "",
        available_time: d.available_time_slot,
        image_url: d.profile_image_url,
        clinic_image_url: d.clinic_image_url,
        nid_number: d.nid_no,
        bmdc_number: d.bmdc_registration_no,
        status: d.status,
        created_at: d.created_at,
      }));

      return {
        data: doctors,
        pagination: result.pagination,
      };
    }
  } catch (error) {
    console.error("getDoctors error:", error);
  }

  return { data: [] };
}

export async function registerDoctor(
  data: FormData,
): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetchApi("/doctors", {
      method: "POST",
      body: data,
    });

    const result = await response.json().catch(() => null);

    if (response.ok) {
      return {
        ok: true,
        message:
          result?.message ||
          "Registration successful! Your profile will be visible once admin approves your verification.",
      };
    } else {
      return {
        ok: false,
        message: result?.message || "An error occurred during registration.",
      };
    }
  } catch (error: any) {
    console.error("Doctor registration error:", error);
    return {
      ok: false,
      message: error.message || "An error occurred during registration.",
    };
  }
}

export async function bookAppointment(data: {
  doctor_id: string;
  full_name: string;
  age: number;
  phone_number: string;
  email?: string;
  address: string;
  appointment_day: string;
}): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetchApi("/doctors/book-appointment", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json().catch(() => null);

    if (response.ok) {
      return {
        ok: true,
        message: result?.message || "Appointment booked successfully!",
      };
    } else {
      return {
        ok: false,
        message: result?.message || "An error occurred during booking.",
      };
    }
  } catch (error: any) {
    console.error("Doctor booking error:", error);
    return {
      ok: false,
      message: error.message || "An error occurred during booking.",
    };
  }
}
