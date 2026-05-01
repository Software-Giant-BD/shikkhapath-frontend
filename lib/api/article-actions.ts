"use server";

import { fetchApi, rethrowNextErrors } from "./common";

export async function submitArticleAction(formData: FormData) {
  try {
    const response = await fetchApi("/submit-article", {
      method: "POST",
      body: formData,
    }, { includeAuth: false });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Failed to submit article",
        errors: data.errors 
      };
    }

    return { success: true, message: data.message };
  } catch (error) {
    rethrowNextErrors(error);
    return { success: false, error: "Something went wrong" };
  }
}
