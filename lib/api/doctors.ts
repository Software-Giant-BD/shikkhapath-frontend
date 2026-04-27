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

// Mock data
const MOCK_DOCTORS: DoctorProfile[] = [
  {
    id: "1",
    name: "Dr. Mahfuzur Rahman",
    specialty: "Cardiology",
    location: "Dhaka",
    hospital: "Labaid Specialized Hospital",
    phone_number: "01711223344",
    fee: 1000,
    available_days: ["Saturday", "Monday", "Wednesday"],
    available_time: "5:00 PM - 8:00 PM",
    image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    nid_number: "1234567890",
    bmdc_number: "A-12345",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Farhana Ahmed",
    specialty: "Gynecology",
    location: "Chittagong",
    hospital: "Evercare Hospital Chattogram",
    phone_number: "01811556677",
    fee: 800,
    available_days: ["Sunday", "Tuesday", "Thursday"],
    available_time: "4:00 PM - 7:00 PM",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400",
    nid_number: "0987654321",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Dr. Tanvir Hossain",
    specialty: "Medicine",
    location: "Dhaka",
    hospital: "Dhaka Medical College Hospital",
    phone_number: "01911998877",
    fee: 600,
    available_days: ["Daily"],
    available_time: "6:00 PM - 9:00 PM",
    image_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    nid_number: "1122334455",
    bmdc_number: "A-54321",
    status: "approved",
    created_at: new Date().toISOString(),
  },
];

export async function getDoctors(specialty?: string, location?: string): Promise<DoctorProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulation

  let filtered = MOCK_DOCTORS.filter(d => d.status === "approved");

  if (specialty && specialty !== "All") {
    filtered = filtered.filter(d => d.specialty === specialty);
  }

  if (location && location !== "All") {
    filtered = filtered.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
  }

  return filtered;
}

export async function registerDoctor(data: RegisterDoctorParams): Promise<{ ok: boolean; message: string }> {
  try {
    console.log("Registering doctor:", data);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulation

    return {
      ok: true,
      message: "Registration successful! Your profile will be visible once admin approves your verification.",
    };
  } catch (error) {
    console.error("Doctor registration error:", error);
    return {
      ok: false,
      message: "An error occurred during registration.",
    };
  }
}
