import { type BasePagination } from "./api-utils";

export type AmbulanceStatus = "pending" | "approved" | "rejected";

export type AmbulanceService = {
  id: number;
  full_name: string;
  provider_name: string;
  phone_number: string;
  ambulance_photo: string;
  nid_copy: string;
  manager_photo: string;
  district_id: number;
  district: {
    id: number;
    name: string;
    bn_name: string;
  };
  nid_number: string;
  ambulance_details: string;
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
