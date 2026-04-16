import "server-only";
import { fetchApi, extractPagination, type BasePagination } from "./common";

export type ExamType = "SSC" | "HSC";

export interface RoutineModel {
  id: string;
  exam_type: ExamType;
  year: number;
  subject_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  pdf_url?: string;
  created_at: string;
}

export interface RoutineListResult {
  items: RoutineModel[];
  pagination: BasePagination;
}

export interface ResultModel {
  id: string;
  board_name: string;
  exam_type: ExamType;
  year: number;
  roll_number: string;
  gpa: string;
  status: "Pass" | "Fail";
  created_at: string;
}

export interface ResultListResult {
  items: ResultModel[];
  pagination: BasePagination;
}

export interface GetFilters {
  page?: number;
  limit?: number;
  exam_type?: string;
  year?: number;
}

export interface ResultSearchFilters extends GetFilters {
  roll_number?: string;
  board_name?: string;
}

// ---- ROUTINES API ----
export async function getRoutines(params?: GetFilters): Promise<RoutineListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.exam_type) searchParams.set("exam_type", params.exam_type);
  if (params?.year) searchParams.set("year", params.year.toString());

  const query = searchParams.toString();
  const url = query ? `/api/ssc-hsc/routines?${query}` : `/api/ssc-hsc/routines`;
  
  try {
    const res = await fetchApi(url, { next: { revalidate: 60, tags: ["routines"] } });
    if (!res.ok) throw new Error("Failed to fetch routines");
    const json = await res.json();
    return {
      items: (json.data || []).map((item: any) => ({
         ...item,
         id: item.id?.toString() || Math.random().toString()
      })),
      pagination: extractPagination(json, params?.page || 1, params?.limit || 15),
    };
  } catch (err) {
    console.error("API Mock fallback for getRoutines", err);
    // Return mock data if backend isn't ready
    return {
      items: [
        { id: "r1", exam_type: "SSC" as ExamType, year: 2026, subject_name: "Bangla 1st Paper", exam_date: "2026-03-10", start_time: "10:00", end_time: "13:00", created_at: new Date().toISOString() },
        { id: "r2", exam_type: "SSC" as ExamType, year: 2026, subject_name: "English 1st Paper", exam_date: "2026-03-12", start_time: "10:00", end_time: "13:00", created_at: new Date().toISOString() },
        { id: "r3", exam_type: "HSC" as ExamType, year: 2026, subject_name: "Physics 1st Paper", exam_date: "2026-06-15", start_time: "14:00", end_time: "17:00", created_at: new Date().toISOString() },
      ].filter(r => (!params?.exam_type || r.exam_type === params.exam_type) && (!params?.year || r.year === params.year)),
      pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: 3 },
    };
  }
}

export async function getRoutineById(id: string): Promise<RoutineModel | null> {
  return null; // Mock helper for singular editing
}

export async function createRoutine(formData: object | FormData) {
  return fetchApi("/admin/ssc-hsc/routines", {
    method: "POST",
    headers: formData instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: formData instanceof FormData ? formData : JSON.stringify(formData),
  });
}

// ---- RESULTS API ----
export async function getResults(params?: ResultSearchFilters): Promise<ResultListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.exam_type) searchParams.set("exam_type", params.exam_type);
  if (params?.year) searchParams.set("year", params.year.toString());
  if (params?.roll_number) searchParams.set("roll_number", params.roll_number);
  if (params?.board_name) searchParams.set("board_name", params.board_name);

  const query = searchParams.toString();
  const url = query ? `/api/ssc-hsc/results?${query}` : `/api/ssc-hsc/results`;
  
  try {
    const res = await fetchApi(url, { next: { revalidate: 60, tags: ["results"] } });
    if (!res.ok) throw new Error("Failed to fetch results");
    const json = await res.json();
    return {
      items: (json.data || []).map((item: any) => ({
         ...item,
         id: item.id?.toString() || Math.random().toString()
      })),
      pagination: extractPagination(json, params?.page || 1, params?.limit || 15),
    };
  } catch (err) {
    console.error("API Mock fallback for getResults", err);
    
    // Exact match mock fallback for testing the "Search" customer flow
    let mockData: ResultModel[] = [
      { id: "m1", board_name: "Dhaka", exam_type: "SSC", year: 2026, roll_number: "123456", gpa: "5.00", status: "Pass", created_at: new Date().toISOString() },
      { id: "m2", board_name: "Rajshahi", exam_type: "HSC", year: 2026, roll_number: "654321", gpa: "4.50", status: "Pass", created_at: new Date().toISOString() },
    ];
    
    if (params?.roll_number) mockData = mockData.filter(m => m.roll_number === params.roll_number);
    if (params?.board_name) mockData = mockData.filter(m => m.board_name === params.board_name);
    if (params?.exam_type) mockData = mockData.filter(m => m.exam_type === params.exam_type);
    if (params?.year) mockData = mockData.filter(m => m.year === params.year);

    return {
      items: mockData,
      pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: mockData.length },
    };
  }
}

export async function getResultById(id: string): Promise<ResultModel | null> {
  return null;
}

export async function createResult(formData: object | FormData) {
  return fetchApi("/admin/ssc-hsc/results", {
    method: "POST",
    headers: formData instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: formData instanceof FormData ? formData : JSON.stringify(formData),
  });
}
