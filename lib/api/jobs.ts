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
  isAdmin = false,
): Promise<JobListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackPerPage = params?.per_page ?? 20;

  try {
    const query = new URLSearchParams();

    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.per_page !== undefined)
      query.set("per_page", String(params.per_page));
    if (params?.category) query.set("category", params.category);
    if (params?.job_type) query.set("job_type", params.job_type);
    if (params?.location) query.set("location", params.location);
    if (params?.status) query.set("status", params.status);

    const basePath = isAdmin ? "/admin/jobs" : "/jobs";
    const path = query.toString()
      ? `${basePath}?${query.toString()}`
      : basePath;

    const response = await fetchApi(path, undefined, { includeAuth: isAdmin });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to load jobs list.");
    }

    const items = payload?.resources || [];

    return {
      items: Array.isArray(items) ? items : [],
      pagination: extractPagination(payload, fallbackPage, fallbackPerPage),
    };
  } catch (error) {
    console.error("Failed to fetch jobs list:", error);
    return {
      items: [],
      pagination: {
        current_page: fallbackPage,
        last_page: fallbackPage,
        per_page: fallbackPerPage,
        total: 0,
      },
    };
  }
}

export async function getJobById(
  jobId: string,
  isAdmin = false,
): Promise<JobApiModel | null> {
  try {
    const basePath = isAdmin ? "/admin/jobs" : "/jobs";
    const response = await fetchApi(`${basePath}/${jobId}`, undefined, {
      includeAuth: isAdmin,
    });
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
    const response = await fetchApi(`/jobs/${slug}`, undefined, {
      includeAuth: false,
    });
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

export async function updateJob(
  jobId: string,
  data: FormData | object,
): Promise<boolean> {
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

export async function submitCandidateCV(
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetchApi(
      "/candidates",
      {
        method: "POST",
        body: formData,
        headers: {}, // fetchApi will handle standard headers, but we don't want Content-Type for FormData
      },
      { includeAuth: false },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, message: payload?.message || "Failed to submit CV" };
    }

    return {
      ok: true,
      message: payload?.message || "CV submitted successfully!",
    };
  } catch (error: any) {
    console.error("Failed to submit CV:", error);
    return {
      ok: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export type CandidateApiModel = {
  id: string;
  name: string;
  profession: string;
  experience: string;
  education: string;
  skills: string[];
  cv_path: string;
  location: string;
  status: string;
  created_at: string;
};

export type GetCandidatesParams = {
  page?: number;
  per_page?: number;
  skill?: string;
  profession?: string;
};

export type CandidateListResult = {
  items: CandidateApiModel[];
  pagination: BasePagination;
};

export async function getCandidatesList(
  params?: GetCandidatesParams,
  isAdmin = false,
): Promise<CandidateListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackPerPage = params?.per_page ?? 12;

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    if (params?.skill) query.set("skill", params.skill);
    if (params?.profession) query.set("profession", params.profession);

    const basePath = isAdmin ? "/admin/candidates" : "/candidates";
    const path = query.toString() ? `${basePath}?${query.toString()}` : basePath;
    const response = await fetchApi(path, undefined, { includeAuth: isAdmin });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to load candidates list.");
    }

    const items = payload?.resources;

    return {
      items: Array.isArray(items) ? items : [],
      pagination:
        payload?.pagination ||
        extractPagination(payload, fallbackPage, fallbackPerPage),
    };
  } catch (error) {
    console.error("Failed to fetch candidates list:", error);
    return {
      items: [],
      pagination: {
        current_page: fallbackPage,
        last_page: fallbackPage,
        per_page: fallbackPerPage,
        total: 0,
      },
    };
  }
}

export async function updateCandidateStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  try {
    const response = await fetchApi(`/admin/candidates/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "Failed to update status");
    }

    return true;
  } catch (error) {
    console.error(`Failed to update status for candidate ${id}:`, error);
    throw error;
  }
}
