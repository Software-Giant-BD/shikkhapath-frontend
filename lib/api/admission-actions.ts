"use server";

import { 
  getAdmissions, 
  createAdmission,
  updateAdmission,
  deleteAdmission,
  getAdmission,
  type GetFilters, 
  type AdmissionListResult,
  type AdmissionUniversityModel 
} from "./admission";
import { revalidateTag, revalidatePath } from "next/cache";

export async function fetchAdmissionsAction(params?: GetFilters): Promise<AdmissionListResult> {
  return await getAdmissions(params);
}

export async function createAdmissionAction(data: Omit<AdmissionUniversityModel, "id">) {
  const result = await createAdmission(data);
  revalidateTag("admissions", "max");
  revalidatePath("/admin/admissions");
  revalidatePath("/admission");
  return result;
}

export async function updateAdmissionAction(id: string, data: Partial<AdmissionUniversityModel>) {
  const result = await updateAdmission(id, data);
  revalidateTag("admissions", "max");
  revalidatePath("/admin/admissions");
  revalidatePath("/admission");
  return result;
}

export async function deleteAdmissionAction(id: string) {
  await deleteAdmission(id);
  revalidateTag("admissions", "max");
  revalidatePath("/admin/admissions");
  revalidatePath("/admission");
}

export async function getAdmissionAction(id: string) {
  return await getAdmission(id);
}
