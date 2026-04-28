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

export async function getAdmissions(
  params?: GetFilters,
): Promise<AdmissionListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  const url = query ? `/api/admissions?${query}` : `/api/admissions`;

  try {
    const res = await fetchApi(url, {
      next: { revalidate: 60, tags: ["admissions"] },
    });
    if (!res.ok) throw new Error("Failed to fetch admissions");
    const json = await res.json();
    return {
      items: (json.data || []).map((item: any) => ({
        ...item,
        id: item.id?.toString() || Math.random().toString(),
      })),
      pagination: extractPagination(
        json,
        params?.page || 1,
        params?.limit || 15,
      ),
    };
  } catch (err) {
    console.error("API Error fallback for getAdmissions", err);
    return {
      items: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: params?.limit || 15,
        total: 0,
      },
    };
  }
}

export async function createAdmission(
  data: Omit<AdmissionUniversityModel, "id">,
): Promise<AdmissionUniversityModel> {
  const res = await fetchApi("/admin/admissions", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create admission");
  }

  const json = await res.json();
  return json.data;
}

export async function updateAdmission(
  id: string,
  data: Partial<AdmissionUniversityModel>,
): Promise<AdmissionUniversityModel> {
  const res = await fetchApi(`/admin/admissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update admission");
  }

  const json = await res.json();
  return json.data;
}

export async function deleteAdmission(id: string): Promise<void> {
  const res = await fetchApi(`/admin/admissions/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete admission");
  }
}

export async function getAdmission(id: string): Promise<AdmissionUniversityModel | null> {
  try {
    const res = await fetchApi(`/admin/admissions/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return {
      ...json.data,
      id: json.data.id?.toString(),
    };
  } catch (error) {
    return null;
  }
}
