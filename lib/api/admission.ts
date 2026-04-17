import "server-only";
import { fetchApi, extractPagination, type BasePagination } from "./common";

export interface AdmissionUniversityModel {
  id: string;
  name: string;
  unit?: string;
  logo_url?: string;
  exam_date: string;
  app_start_date: string;
  app_deadline: string;
  exam_type: "Written" | "MCQ" | "Online" | "Written & MCQ";
  seats: number | string;
  tags: string[];

  // Requirements
  req_ssc: number;
  req_hsc: number;
  req_total: number;
  allowed_groups: string[];
  apply_url: string;
}

export interface AdmissionListResult {
  items: AdmissionUniversityModel[];
  pagination: BasePagination;
}

export interface GetFilters {
  page?: number;
  limit?: number;
}

export async function getAdmissions(params?: GetFilters): Promise<AdmissionListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  const url = query ? `/api/admissions?${query}` : `/api/admissions`;
  
  try {
    const res = await fetchApi(url, { next: { revalidate: 60, tags: ["admissions"] } });
    if (!res.ok) throw new Error("Failed to fetch admissions");
    const json = await res.json();
    return {
      items: (json.data || []).map((item: any) => ({
         ...item,
         id: item.id?.toString() || Math.random().toString()
      })),
      pagination: extractPagination(json, params?.page || 1, params?.limit || 15),
    };
  } catch (err) {
    console.error("API Mock fallback for getAdmissions", err);
    // Return robust mock data for testing Eligibility
    const mockData: AdmissionUniversityModel[] = [
      {
        id: "du-a",
        name: "Dhaka University",
        unit: "A Unit (Science)",
        exam_date: "2026-03-01",
        app_start_date: "2026-01-15",
        app_deadline: "2026-02-15",
        exam_type: "Written & MCQ",
        seats: 1851,
        tags: ["Public", "Top Ranked"],
        req_ssc: 3.5,
        req_hsc: 3.5,
        req_total: 8.0,
        allowed_groups: ["Science"],
        apply_url: "https://admission.eis.du.ac.bd",
      },
      {
        id: "du-b",
        name: "Dhaka University",
        unit: "B Unit (Arts, Law & Social)",
        exam_date: "2026-03-05",
        app_start_date: "2026-01-15",
        app_deadline: "2026-02-15",
        exam_type: "Written & MCQ",
        seats: 2934,
        tags: ["Public", "Competitive"],
        req_ssc: 3.0,
        req_hsc: 3.0,
        req_total: 7.5,
        allowed_groups: ["Science", "Arts", "Commerce"],
        apply_url: "https://admission.eis.du.ac.bd",
      },
      {
        id: "buet",
        name: "BUET",
        unit: "Engineering",
        exam_date: "2026-04-10",
        app_start_date: "2026-01-20",
        app_deadline: "2026-02-25",
        exam_type: "Written",
        seats: 1305,
        tags: ["Engineering", "Leading"],
        req_ssc: 4.0,
        req_hsc: 5.0,
        req_total: 9.0, // BUET actually looks at Math/Phys/Chem exact points, simplifying for mock
        allowed_groups: ["Science"],
        apply_url: "https://ugadmission.buet.ac.bd",
      },
      {
        id: "ru-a",
        name: "Rajshahi University",
        unit: "A Unit (Arts)",
        exam_date: "2026-03-20",
        app_start_date: "2026-02-05",
        app_deadline: "2026-03-01",
        exam_type: "MCQ",
        seats: 2019,
        tags: ["Public", "General"],
        req_ssc: 3.0,
        req_hsc: 3.0,
        req_total: 7.0,
        allowed_groups: ["Arts", "Commerce", "Science"],
        apply_url: "https://admission.ru.ac.bd",
      },
      {
        id: "ju-all",
        name: "Jahangirnagar University",
        unit: "General Units",
        exam_date: "2026-03-25",
        app_start_date: "2026-02-10",
        app_deadline: "2026-03-10",
        exam_type: "MCQ",
        seats: "1889+",
        tags: ["Public", "Nature Campus"],
        req_ssc: 3.5,
        req_hsc: 3.5,
        req_total: 8.0,
        allowed_groups: ["Science", "Commerce", "Arts"],
        apply_url: "https://juniv-admission.org",
      }
    ];

    return {
      items: mockData,
      pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: mockData.length },
    };
  }
}
