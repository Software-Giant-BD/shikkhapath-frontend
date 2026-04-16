"use server";

import { revalidatePath } from "next/cache";
import { getRoutines, getResults, type GetFilters, type ResultSearchFilters, type RoutineListResult, type ResultListResult } from "./ssc-hsc";

export async function fetchRoutinesAction(params?: GetFilters): Promise<RoutineListResult> {
  return await getRoutines(params);
}

export async function fetchResultsAction(params?: ResultSearchFilters): Promise<ResultListResult> {
  return await getResults(params);
}
