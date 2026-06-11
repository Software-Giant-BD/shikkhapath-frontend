"use server";

import { fetchApi } from "./common";

export type GenerateSeoPayload = {
  title: string;
  description: string;
  category: string;
};

export type SeoData = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  topics?: string[];
};

export type GenerateSeoActionResult = {
  ok: boolean;
  data: SeoData | null;
  message: string;
};

export async function generateSeoAction(
  payload: GenerateSeoPayload,
): Promise<GenerateSeoActionResult> {
  try {
    const response = await fetchApi("/admin/generate-seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        data: null,
        message: result?.message || "Failed to generate SEO data.",
      };
    }

    return {
      ok: true,
      data: result?.resources || null,
      message: result?.message || "SEO data generated successfully.",
    };
  } catch {
    return {
      ok: false,
      data: null,
      message: "SEO generation API is unavailable.",
    };
  }
}
