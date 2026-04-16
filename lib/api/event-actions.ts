"use server";

import { getUniversityEvents, type EventFilters, type EventListResult } from "./events";

export async function fetchUniversityEventsAction(params?: EventFilters): Promise<EventListResult> {
  return await getUniversityEvents(params);
}
