import { fetchApi } from "./common";
import { type Division } from "@/lib/constants/divisions";

export type FireStation = {
  id: string;
  station_name: string;
  division: Division;
  city: string;
  area: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // Calculated on the fly if GPS is enabled
};

// Mock data based on the requested structure
const MOCK_FIRE_STATIONS: FireStation[] = [
  {
    id: "1",
    station_name: "Tejgaon Fire Station",
    division: "Dhaka",
    city: "Dhaka",
    area: "Tejgaon",
    phone: "02-9112222",
    address: "Tejgaon, Dhaka",
    latitude: 23.7599,
    longitude: 90.3908,
  },
  {
    id: "2",
    station_name: "Siddique Bazar Fire Station",
    division: "Dhaka",
    city: "Dhaka",
    area: "Siddique Bazar",
    phone: "02-9555555",
    address: "Fulbaria, Dhaka",
    latitude: 23.7226,
    longitude: 90.4101,
  },
  {
    id: "3",
    station_name: "Agrabad Fire Station",
    division: "Chittagong",
    city: "Chittagong",
    area: "Agrabad",
    phone: "031-712222",
    address: "Agrabad, Chittagong",
    latitude: 22.3276,
    longitude: 91.8105,
  },
  {
    id: "4",
    station_name: "Khulna Central Fire Station",
    division: "Khulna",
    city: "Khulna",
    area: "Boyra",
    phone: "041-762222",
    address: "Boyra, Khulna",
    latitude: 22.8456,
    longitude: 89.5403,
  },
  {
    id: "5",
    station_name: "Sylhet Fire Station",
    division: "Sylhet",
    city: "Sylhet",
    area: "Taltola",
    phone: "0821-710222",
    address: "Taltola, Sylhet",
    latitude: 24.8917,
    longitude: 91.8700,
  },
];

export async function getFireStations(options?: {
  division?: string;
  city?: string;
  area?: string;
  userLat?: number;
  userLng?: number;
}): Promise<FireStation[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulation delay

  let filtered = [...MOCK_FIRE_STATIONS];

  if (options?.division && options.division !== "All") {
    filtered = filtered.filter(s => s.division === options.division);
  }

  if (options?.city && options.city !== "All") {
    filtered = filtered.filter(s => s.city.toLowerCase().includes(options.city!.toLowerCase()));
  }

  if (options?.area && options.area !== "All") {
    filtered = filtered.filter(s => s.area.toLowerCase().includes(options.area!.toLowerCase()));
  }

  // Calculate distance if GPS is provided
  if (options?.userLat && options?.userLng) {
    filtered = filtered.map(s => ({
      ...s,
      distance: calculateDistance(options.userLat!, options.userLng!, s.latitude, s.longitude)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return filtered;
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
