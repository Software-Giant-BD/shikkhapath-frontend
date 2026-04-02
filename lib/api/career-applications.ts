"use server";

import {
  extractPagination,
  fetchApi,
  normalizeImageUrl,
  type BasePagination,
} from "./common";

export type CareerApplicationRecord = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedCareerApplicationsResponse = {
  applications: CareerApplicationRecord[];
  pagination: BasePagination;
};

export type CareerApplicationActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
};

function normalizeCareerApplication(payload: any): CareerApplicationRecord {
  return {
    id: Number(payload?.id ?? 0),
    fullName: String(payload?.full_name ?? payload?.fullName ?? ""),
    phone: String(payload?.phone ?? ""),
    email: String(payload?.email ?? ""),
    position: String(payload?.position ?? ""),
    resumeUrl: normalizeImageUrl(payload?.resume ?? payload?.resume_url ?? payload?.resumeUrl),
    coverLetterUrl: normalizeImageUrl(
      payload?.cover_letter ?? payload?.cover_letter_url ?? payload?.coverLetter ?? payload?.coverLetterUrl,
    ),
    status: String(payload?.status ?? "new"),
    createdAt: String(payload?.created_at ?? payload?.createdAt ?? ""),
    updatedAt: String(payload?.updated_at ?? payload?.updatedAt ?? ""),
  };
}

export async function getCareerApplications(
  page = 1,
  perPage = 10,
): Promise<PaginatedCareerApplicationsResponse> {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetchApi(`/admin/career-applications?${query.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load career applications.");
  }

  return {
    applications: (Array.isArray(data?.resources) ? data.resources : [])
      .map(normalizeCareerApplication)
      .filter((application) => application.id),
    pagination: extractPagination(data, page, perPage),
  };
}

export async function updateCareerApplicationStatus(
  applicationId: number,
  status: string,
): Promise<CareerApplicationActionResult> {
  const response = await fetchApi(`/admin/career-applications/${applicationId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: status.trim() }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || "Failed to update application status.",
      errors: data?.errors,
      data,
    };
  }

  return {
    success: true,
    message: data?.message || "Application status updated successfully.",
    data,
  };
}

export async function submitCareerApplication(
  formData: FormData,
): Promise<CareerApplicationActionResult> {
  const outgoing = new FormData();

  const appendText = (key: string) => {
    const value = formData.get(key);
    if (typeof value === "string") {
      outgoing.append(key, value.trim());
    }
  };

  appendText("full_name");
  appendText("phone");
  appendText("email");
  appendText("position");

  const resume = formData.get("resume");
  if (resume instanceof File && resume.size > 0) {
    outgoing.append("resume", resume, resume.name);
  }

  const coverLetter = formData.get("cover_letter");
  if (coverLetter instanceof File && coverLetter.size > 0) {
    outgoing.append("cover_letter", coverLetter, coverLetter.name);
  }

  const response = await fetchApi(
    "/career-applications",
    {
      method: "POST",
      body: outgoing,
    },
    { includeAuth: false },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || "Failed to submit your application. Please try again.",
      errors: data?.errors,
    };
  }

  return {
    success: true,
    message: data?.message || "Application submitted successfully.",
  };
}
