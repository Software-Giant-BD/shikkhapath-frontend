import { fetchApi } from "./common";
import { uploadImageAction, type UploadedImageModel } from "./image-actions";

export type AmbulanceStatus = "pending" | "approved" | "rejected";

export type AmbulanceService = {
  id: string;
  provider_name: string;
  phone_number: string;
  location: string;
  description: string;
  image_url: string;
  nid_number: string;
  status: AmbulanceStatus;
  created_at: string;
};

export type RegisterAmbulanceParams = {
  full_name: string;
  phone_number: string;
  location: string;
  nid_number: string;
  description: string;
  image?: File;
  nid_image?: File;
  provider_image?: File;
};

// Mock data for initial development
const MOCK_SERVICES: AmbulanceService[] = [
  {
    id: "1",
    provider_name: "Dhaka Central Ambulance",
    phone_number: "01711223344",
    location: "Dhaka",
    description: "24/7 Emergency ambulance service with ICUs.",
    image_url: "https://images.unsplash.com/photo-1587748410538-ad471079734f?auto=format&fit=crop&q=80&w=800",
    nid_number: "1234567890",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    provider_name: "Chittagong Life Care",
    phone_number: "01811556677",
    location: "Chittagong",
    description: "Affordable ambulance for long distance patient transport.",
    image_url: "https://images.unsplash.com/photo-1516574103923-388a9548304c?auto=format&fit=crop&q=80&w=800",
    nid_number: "0987654321",
    status: "approved",
    created_at: new Date().toISOString(),
  },
];

export async function getAmbulanceServices(location?: string): Promise<AmbulanceService[]> {
  // In a real app, this would be a fetchApi call
  // For now, returning mock data filtered by location
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

  if (!location || location === "All") {
    return MOCK_SERVICES;
  }

  return MOCK_SERVICES.filter((s) => s.location.toLowerCase().includes(location.toLowerCase()));
}

export async function registerAmbulanceService(data: RegisterAmbulanceParams): Promise<{ ok: boolean; message: string }> {
  try {
    let imageUrl = "";

    if (data.image) {
      const formData = new FormData();
      formData.append("image", data.image);
      const uploadResult = await uploadImageAction(formData);
      if (uploadResult.ok && uploadResult.item) {
        imageUrl = uploadResult.item.url;
      }
    }

    // In a real app, send data to backend
    console.log("Registering ambulance service:", { ...data, image_url: imageUrl });

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulation

    return {
      ok: true,
      message: "Registration submitted successfully. Pending admin approval.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      ok: false,
      message: "An error occurred during registration.",
    };
  }
}
