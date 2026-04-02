"use server";

import { fetchApi } from "./common";

export type ContactMessagePayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactMessage(
  payload: ContactMessagePayload,
): Promise<ContactActionResult> {
  const response = await fetchApi(
    "/contact-us",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    { includeAuth: false },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || "Failed to send your message. Please try again.",
      errors: data?.errors,
    };
  }

  return {
    success: true,
    message: data?.message || "Thank you! Your message has been sent successfully.",
  };
}
