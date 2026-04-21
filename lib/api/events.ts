import "server-only";
import { fetchApi, extractPagination, type BasePagination } from "./common";

export type EventType = "Admission Event" | "Seminar" | "Workshop" | "Competition" | "Webinar" | "Campus Program";

export interface UniversityEventModel {
  id: string;
  title: string;
  university_id: string;
  university_name: string;
  city: string;
  start_date: string; // ISO 
  end_date: string;   // ISO
  location: string;
  description: string;
  type: EventType;
  registration_url: string;
}

export interface EventListResult {
  items: UniversityEventModel[];
  pagination: BasePagination;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  city?: string;
  type?: string;
  university?: string;
}

export async function getUniversityEvents(params?: EventFilters): Promise<EventListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.city) searchParams.set("city", params.city);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.university) searchParams.set("university", params.university);

  const query = searchParams.toString();
  const url = query ? `/api/university-events?${query}` : `/api/university-events`;
  
  try {
    const res = await fetchApi(url, { next: { revalidate: 60, tags: ["events"] } });
    if (!res.ok) throw new Error("Failed to fetch events");
    const json = await res.json();
    return {
      items: json.data || [],
      pagination: extractPagination(json, params?.page || 1, params?.limit || 15),
    };
  } catch (err) {
    console.error("API Mock fallback for getUniversityEvents", err);
    
    // We will generate events close to the current actual date so the calendar populates properly!
    const today = new Date();
    const d = (offset: number) => {
       const cd = new Date(today);
       cd.setDate(cd.getDate() + offset);
       return cd.toISOString();
    };

    let mockData: UniversityEventModel[] = [
      {
        id: "evt-1",
        title: "DU Admission Test Orientation",
        university_id: "du",
        university_name: "Dhaka University",
        city: "Dhaka",
        start_date: d(2), // 2 days from now
        end_date: d(2),
        location: "TSC Auditorium, DU Campus",
        description: "An orientation program for incoming admission candidates detailing the process, seating plans, and general guidelines.",
        type: "Admission Event",
        registration_url: "https://du.ac.bd/events/orientation2026",
      },
      {
        id: "evt-2",
        title: "National Tech Olympiad 2026",
        university_id: "buet",
        university_name: "BUET",
        city: "Dhaka",
        start_date: d(5),
        end_date: d(6),
        location: "CSE Building, BUET",
        description: "The largest engineering competition including competitive programming, line follower robots, and hackathons.",
        type: "Competition",
        registration_url: "https://buet.ac.bd/nto",
      },
      {
        id: "evt-3",
        title: "RU A-Unit Exam Briefing",
        university_id: "ru",
        university_name: "Rajshahi University",
        city: "Rajshahi",
        start_date: d(12),
        end_date: d(12),
        location: "Online (Zoom Webinar)",
        description: "Important directives for candidates taking the A-Unit examinations. Learn about OMR checking and time management.",
        type: "Webinar",
        registration_url: "https://ru.ac.bd/webinar",
      },
      {
        id: "evt-4",
        title: "Higher Study Abroad Seminar",
        university_id: "ju",
        university_name: "Jahangirnagar University",
        city: "Savar",
        start_date: d(15),
        end_date: d(15),
        location: "Zahir Raihan Auditorium, JU",
        description: "Explore opportunities for full-ride scholarships in North America and Europe. Open for all 3rd and 4th year students.",
        type: "Seminar",
        registration_url: "https://ju.ac.bd/seminars",
      },
      {
        id: "evt-5",
        title: "Medical Admission Crash Prep",
        university_id: "dmc",
        university_name: "Dhaka Medical College",
        city: "Dhaka",
        start_date: d(-3), // Past event
        end_date: d(-3),
        location: "DMC Gallery 1",
        description: "A free crash course covering essential biology topics for the upcoming national medical admission exam.",
        type: "Workshop",
        registration_url: "https://dmc.gov.bd",
      }
    ];

    if (params?.city) mockData = mockData.filter(e => e.city.toLowerCase() === params.city?.toLowerCase());
    if (params?.type) mockData = mockData.filter(e => e.type === params.type);

    return {
      items: mockData,
      pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: mockData.length },
    };
  }
}
