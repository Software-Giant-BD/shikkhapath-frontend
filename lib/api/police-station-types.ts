export type PoliceStation = {
  id: number;
  name: string;
  phone_number: string;
  division_id: number;
  district_id: number;
  upazila_id: number;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  division?: { id: number; name: string; bn_name: string };
  district?: { id: number; name: string; bn_name: string };
  upazila?: { id: number; name: string; bn_name: string };
  address?: string | null;
  distance?: number | null;
  created_at: string;
  updated_at: string;
};

export type PoliceStationPagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

export type PoliceStationListResponse = {
  items: PoliceStation[];
  pagination: PoliceStationPagination;
};
