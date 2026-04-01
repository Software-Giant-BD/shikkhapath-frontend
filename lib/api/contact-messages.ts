"use server";

import {
  extractPagination,
  fetchApi,
  type BasePagination,
  type FieldErrors,
} from "./common";

export type { FieldErrors } from "./common";

export type ContactMessageRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedContactMessagesResponse = {
  messages: ContactMessageRecord[];
  pagination: BasePagination;
};

export type ContactMessageActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
  data?: any;
};

function normalizeContactMessage(message: any): ContactMessageRecord {
  return {
    id: Number(message?.id ?? 0),
    name: String(message?.name ?? ""),
    email: String(message?.email ?? ""),
    phone: String(message?.phone ?? ""),
    subject: String(message?.subject ?? ""),
    message: String(message?.message ?? ""),
    status: String(message?.status ?? "pending"),
    createdAt: String(message?.created_at ?? message?.createdAt ?? ""),
    updatedAt: String(message?.updated_at ?? message?.updatedAt ?? ""),
  };
}

export async function getContactMessages(
  page = 1,
  perPage = 10,
): Promise<PaginatedContactMessagesResponse> {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const response = await fetchApi(`/admin/contact-messages?${query.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load contact messages.");
  }

  return {
    messages: (Array.isArray(data?.resources) ? data.resources : [])
      .map(normalizeContactMessage)
      .filter((message) => message.id),
    pagination: extractPagination(data, page, perPage),
  };
}

export async function updateContactMessageStatus(
  contactMessageId: number,
  status: string,
): Promise<ContactMessageActionResult> {
  const response = await fetchApi(`/admin/contact-messages/${contactMessageId}/status`, {
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
      message: data?.message || "Failed to update message status.",
      fieldErrors: data?.errors,
    };
  }

  return {
    success: true,
    message: data?.message || "Status updated successfully.",
    data,
  };
}
