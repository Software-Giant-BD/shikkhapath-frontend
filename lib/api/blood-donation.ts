import { fetchApi } from "./common";
import { type BloodGroup } from "@/lib/constants/blood-groups";

export type DonorStatus = "pending" | "approved" | "rejected";

export type BloodDonor = {
  id: string;
  name: string;
  phone_number: string;
  location: string;
  blood_group: BloodGroup;
  last_donation_date?: string;
  is_available: boolean;
  status: DonorStatus;
  nid_number: string;
  profile_image_url?: string;
  created_at: string;
};

export type RegisterDonorParams = {
  name: string;
  phone_number: string;
  location: string;
  blood_group: BloodGroup;
  nid_number: string;
  last_donation_date?: string;
  is_available: boolean;
  image?: File;
};

// Mock data for initial development
const MOCK_DONORS: BloodDonor[] = [
  {
    id: "1",
    name: "Arifur Rahman",
    phone_number: "01711223344",
    location: "Dhaka",
    blood_group: "O+",
    last_donation_date: "2024-02-15",
    is_available: true,
    status: "approved",
    nid_number: "1234567890",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sumaiya Akter",
    phone_number: "01811556677",
    location: "Chittagong",
    blood_group: "A+",
    last_donation_date: "2024-01-10",
    is_available: true,
    status: "approved",
    nid_number: "0987654321",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Tanvir Hasan",
    phone_number: "01911998877",
    location: "Dhaka",
    blood_group: "B+",
    last_donation_date: "2023-12-05",
    is_available: false,
    status: "approved",
    nid_number: "1122334455",
    created_at: new Date().toISOString(),
  },
];

export async function getDonors(bloodGroup?: string, location?: string): Promise<BloodDonor[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulation

  let filtered = MOCK_DONORS.filter(d => d.status === "approved");

  if (bloodGroup && bloodGroup !== "All") {
    filtered = filtered.filter(d => d.blood_group === bloodGroup);
  }

  if (location && location !== "All") {
    filtered = filtered.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
  }

  return filtered;
}

export async function registerDonor(data: RegisterDonorParams): Promise<{ ok: boolean; message: string }> {
  try {
    // In a real app, send to backend
    console.log("Registering donor:", data);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulation

    return {
      ok: true,
      message: "Registration successful! You will be visible to seekers once admin approves your verification.",
    };
  } catch (error) {
    console.error("Donor registration error:", error);
    return {
      ok: false,
      message: "An error occurred during registration.",
    };
  }
}
