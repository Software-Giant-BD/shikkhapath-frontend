import { fetchApi } from "./common";

export type TrainType = "Intercity" | "Mail" | "Express" | "Commuter";

export type Train = {
  id: string | number;
  train_name: string;
  train_code: string;
  from_station: string;
  to_station: string;
  departure_time: string;
  arrival_time: string;
  off_day: string;
  train_type: TrainType;
};

export type TrainSearchParams = {
  from?: string;
  to?: string;
  date?: string;
};

// Mock data for initial development
const MOCK_TRAINS: Train[] = [
  {
    id: 1,
    train_name: "Subarna Express",
    train_code: "701",
    from_station: "Dhaka",
    to_station: "Chattogram",
    departure_time: "07:00 AM",
    arrival_time: "01:30 PM",
    off_day: "Monday",
    train_type: "Intercity",
  },
  {
    id: 2,
    train_name: "Parabat Express",
    train_code: "709",
    from_station: "Dhaka",
    to_station: "Sylhet",
    departure_time: "06:20 AM",
    arrival_time: "01:00 PM",
    off_day: "Tuesday",
    train_type: "Intercity",
  },
  {
    id: 3,
    train_name: "Silkcity Express",
    train_code: "753",
    from_station: "Dhaka",
    to_station: "Rajshahi",
    departure_time: "02:45 PM",
    arrival_time: "08:35 PM",
    off_day: "Sunday",
    train_type: "Intercity",
  },
  {
    id: 4,
    train_name: "Mahanagar Express",
    train_code: "721",
    from_station: "Chattogram",
    to_station: "Dhaka",
    departure_time: "12:30 PM",
    arrival_time: "07:10 PM",
    off_day: "Sunday",
    train_type: "Intercity",
  },
  {
    id: 5,
    train_name: "Turna Express",
    train_code: "741",
    from_station: "Dhaka",
    to_station: "Chattogram",
    departure_time: "11:30 PM",
    arrival_time: "06:20 AM",
    off_day: "No",
    train_type: "Intercity",
  },
  {
    id: 6,
    train_name: "Kalni Express",
    train_code: "773",
    from_station: "Dhaka",
    to_station: "Sylhet",
    departure_time: "03:00 PM",
    arrival_time: "09:30 PM",
    off_day: "Friday",
    train_type: "Intercity",
  },
];

export async function getTrains(params?: TrainSearchParams): Promise<Train[]> {
  try {
    // In a real app, this would use fetchApi with query params
    // const query = new URLSearchParams(params as any).toString();
    // const response = await fetchApi(`/train-schedules?${query}`);
    // if (!response.ok) return MOCK_TRAINS;
    // return await response.json();

    // Simulating API behavior with local filtering
    await new Promise((resolve) => setTimeout(resolve, 600));

    let results = [...MOCK_TRAINS];

    if (params?.from) {
      results = results.filter((t) =>
        t.from_station.toLowerCase().includes(params.from!.toLowerCase())
      );
    }

    if (params?.to) {
      results = results.filter((t) =>
        t.to_station.toLowerCase().includes(params.to!.toLowerCase())
      );
    }

    if (params?.date) {
      const date = new Date(params.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      results = results.filter((t) => t.off_day !== dayName);
    }

    return results;
  } catch (error) {
    console.error("Error fetching trains:", error);
    return MOCK_TRAINS;
  }
}
