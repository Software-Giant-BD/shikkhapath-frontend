import "server-only";
import { fetchApi } from "./common";

export async function getPublicSettings() {
  try {
    const response = await fetchApi(
      "/settings",
      { next: { revalidate: 3600 } },
      { includeAuth: false }
    );
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {};
    }

    return data.resources || {};
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return {};
  }
}
