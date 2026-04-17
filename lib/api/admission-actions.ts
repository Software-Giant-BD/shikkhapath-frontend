"use server";

import { getAdmissions, type GetFilters, type AdmissionListResult } from "./admission";

export async function fetchAdmissionsAction(params?: GetFilters): Promise<AdmissionListResult> {
  return await getAdmissions(params);
}
