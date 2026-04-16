import "server-only";

import { extractPagination, fetchApi, type BasePagination } from "./common";

export type JobStatus = "active" | "inactive" | "expired";

export type JobApiModel = {
  id: string;
  title: string;
  slug: string;
  company_name: string;
  category: string;
  job_type: string;
  location: string;
  salary: string;
  deadline: string;
  description: string;
  feature_image_url: string;
  apply_link: string;
  status: JobStatus;
  publish_at: string;
  created_at: string;
};

export type GetJobsParams = {
  page?: number;
  per_page?: number;
  category?: string;
  job_type?: string;
  location?: string;
  status?: string;
};

export type JobListResult = {
  items: JobApiModel[];
  pagination: BasePagination;
};

export async function getJobsList(
  params?: GetJobsParams,
  isAdmin = false
): Promise<JobListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackPerPage = params?.per_page ?? 20;

  try {
    const query = new URLSearchParams();

    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.per_page !== undefined) query.set("per_page", String(params.per_page));
    if (params?.category) query.set("category", params.category);
    if (params?.job_type) query.set("job_type", params.job_type);
    if (params?.location) query.set("location", params.location);
    if (params?.status) query.set("status", params.status);

    const basePath = isAdmin ? "/admin/jobs" : "/jobs";
    const path = query.toString() ? `${basePath}?${query.toString()}` : basePath;
    
    const response = await fetchApi(path, undefined, { includeAuth: isAdmin });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to load jobs list.");
    }

    const items = payload?.resources?.data || payload?.resources || payload?.data || [];

    return {
      items: Array.isArray(items) ? items : [],
      pagination: extractPagination(payload, fallbackPage, fallbackPerPage),
    };
  } catch (error) {
    console.error("Failed to fetch jobs list:", error);
    return {
      items: [],
      pagination: {
        currentPage: fallbackPage,
        lastPage: fallbackPage,
        perPage: fallbackPerPage,
        total: 0,
      },
    };
  }
}

export async function getJobById(jobId: string, isAdmin = false): Promise<JobApiModel | null> {
  try {
    const basePath = isAdmin ? "/admin/jobs" : "/jobs";
    const response = await fetchApi(`${basePath}/${jobId}`, undefined, { includeAuth: isAdmin });
    const payload = await response.json().catch(() => null);

    if (response.status === 404 || !response.ok) {
      return null;
    }

    return payload?.resources || payload?.data || null;
  } catch (error) {
    console.error(`Failed to fetch job ${jobId}:`, error);
    return null;
  }
}

export async function getJobBySlug(slug: string): Promise<JobApiModel | null> {
  try {
    const response = await fetchApi(`/jobs/${slug}`, undefined, { includeAuth: false });
    const payload = await response.json().catch(() => null);

    if (response.status === 404 || !response.ok) {
      return null;
    }

    return payload?.resources || payload?.data || null;
  } catch (error) {
    console.error(`Failed to fetch job by slug ${slug}:`, error);
    return null;
  }
}

export async function createJob(data: FormData | object): Promise<boolean> {
  try {
    const isFormData = data instanceof FormData;
    const response = await fetchApi("/admin/jobs", {
      method: "POST",
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "Failed to create job");
    }

    return true;
  } catch (error) {
    console.error("Failed to create job:", error);
    throw error;
  }
}

export async function updateJob(jobId: string, data: FormData | object): Promise<boolean> {
  try {
    const isFormData = data instanceof FormData;
    
    if (isFormData) {
      data.append("_method", "PUT");
    }

    const response = await fetchApi(`/admin/jobs/${jobId}`, {
      method: isFormData ? "POST" : "PUT",
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "Failed to update job");
    }

    return true;
  } catch (error) {
    console.error(`Failed to update job ${jobId}:`, error);
    throw error;
  }
}

export async function deleteJob(jobId: string): Promise<boolean> {
  try {
    const response = await fetchApi(`/admin/jobs/${jobId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete job");
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete job ${jobId}:`, error);
    return false;
  }
}
