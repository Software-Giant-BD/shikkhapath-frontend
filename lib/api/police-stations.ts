import { fetchApi } from "./common";
import { type Division } from "@/lib/constants/divisions";

export type PoliceStation = {
  id: string;
  station_name: string;
  division: Division;
  city: string;
  area: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

// Mock data structured for database migration
const MOCK_POLICE_STATIONS: PoliceStation[] = [
  {
    id: "1",
    station_name: "Dhanmondi Police Station",
    division: "Dhaka",
    city: "Dhaka",
    area: "Dhanmondi",
    phone: "02-9669999",
    address: "Road 6, Dhanmondi, Dhaka",
    latitude: 23.7393,
    longitude: 90.3804,
  },
  {
    id: "2",
    station_name: "Gulshan Police Station",
    division: "Dhaka",
    city: "Dhaka",
    area: "Gulshan",
    phone: "02-9844444",
    address: "Gulshan 1, Dhaka",
    latitude: 23.7788,
    longitude: 90.4131,
  },
  {
    id: "3",
    station_name: "Panchlaish Police Station",
    division: "Chittagong",
    city: "Chittagong",
    area: "Panchlaish",
    phone: "031-681111",
    address: "Panchlaish, Chittagong",
    latitude: 22.3655,
    longitude: 91.8288,
  },
  {
    id: "4",
    station_name: "Shahjalal Police Station",
    division: "Sylhet",
    city: "Sylhet",
    area: "Amberkhana",
    phone: "0821-716444",
    address: "Amberkhana, Sylhet",
    latitude: 24.9083,
    longitude: 91.8681,
  },
  {
    id: "5",
    station_name: "Khulna Kotwali Police Station",
    division: "Khulna",
    city: "Khulna",
    area: "Kotwali",
    phone: "041-720000",
    address: "Kotwali, Khulna",
    latitude: 22.8123,
    longitude: 89.5622,
  },
];

export async function getPoliceStations(options?: {
  division?: string;
  city?: string;
  area?: string;
  userLat?: number;
  userLng?: number;
}): Promise<PoliceStation[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulation delay

  let filtered = [...MOCK_POLICE_STATIONS];

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
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
