"use server";

import { revalidatePath } from "next/cache";
import { 
  getJobsList, 
  createJob, 
  updateJob, 
  deleteJob, 
  getCandidatesList,
  updateCandidateStatus,
  type GetJobsParams, 
  type JobListResult,
  type GetCandidatesParams,
  type CandidateListResult
} from "./jobs";

export async function fetchJobsAction(params?: GetJobsParams): Promise<JobListResult> {
  return getJobsList(params, false);
}

export async function fetchCandidatesAction(params?: GetCandidatesParams): Promise<CandidateListResult> {
  return getCandidatesList(params);
}

export async function createJobAction(formData: FormData | object) {
  try {
    await createJob(formData);
    revalidatePath("/admin/jobs/list");
    return { ok: true, message: "" };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create job" };
  }
}

export async function updateJobAction(jobId: string, formData: FormData | object) {
  try {
    await updateJob(jobId, formData);
    revalidatePath("/admin/jobs/list");
    revalidatePath(`/admin/jobs/${jobId}`);
    return { ok: true, message: "" };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to update job" };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    await deleteJob(jobId);
    revalidatePath("/admin/jobs/list");
    return { ok: true, message: "" };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to delete job" };
  }
}

export async function submitCandidateCVAction(formData: FormData) {
  const result = await import("./jobs").then(m => m.submitCandidateCV(formData));
  if (result.ok) {
    revalidatePath("/jobs/hire-talent");
  }
  return result;
}

export async function updateCandidateStatusAction(id: string, status: "approved" | "rejected") {
  try {
    await updateCandidateStatus(id, status);
    revalidatePath("/admin/candidates/list");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

