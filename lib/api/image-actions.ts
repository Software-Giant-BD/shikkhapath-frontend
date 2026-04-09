"use server";

import { fetchApi } from "./common";

export type UploadedImageModel = {
  id: string;
  name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
  folder_id: string | null;
};

export type UploadImageActionResult = {
  ok: boolean;
  message: string;
  item: UploadedImageModel | null;
};

export type DeleteImagesActionResult = {
  ok: boolean;
  message: string;
};

export type MoveImagesActionResult = {
  ok: boolean;
  message: string;
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getMessage(payload: unknown, fallback: string): string {
  const data = asObject(payload);
  return typeof data.message === "string" && data.message.trim() ? data.message : fallback;
}

function extractUrl(value: Record<string, unknown>): string {
  const keys = ["url", "image_url", "file_url", "path", "src", "original_url"];

  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "";
}

function extractImage(payload: unknown): Record<string, unknown> | null {
  const data = asObject(payload);
  const resources = asObject(data.resources);

  const candidates = [
    resources.image,
    resources.item,
    resources.data,
    data.image,
    data.data,
    resources,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Record<string, unknown>;
    }
  }

  return null;
}

function normalizeUploadedImage(value: Record<string, unknown>, fallbackFolderId: string): UploadedImageModel | null {
  const id = asString(value.id);
  const url = extractUrl(value);

  if (!id || !url) {
    return null;
  }

  const folderId = asString(value.folder_id ?? value.folderId ?? fallbackFolderId);

  return {
    id,
    name: asString(value.name ?? value.original_name ?? value.file_name, "Uploaded image"),
    url,
    mime_type: asString(value.mime_type ?? value.mimeType, "image/*"),
    size: asNumber(value.size),
    created_at: asString(value.created_at ?? value.createdAt, new Date().toISOString()),
    folder_id: folderId || null,
  };
}

export async function uploadImageAction(payload: FormData): Promise<UploadImageActionResult> {
  try {
    const folderId = asString(payload.get("folder_id"));

    const response = await fetchApi("/admin/images", {
      method: "POST",
      body: payload,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to upload image."),
        item: null,
      };
    }

    const resource = extractImage(data);
    const item = resource ? normalizeUploadedImage(resource, folderId) : null;

    return {
      ok: true,
      message: getMessage(data, "Image uploaded successfully."),
      item,
    };
  } catch {
    return {
      ok: false,
      message: "Image API is unavailable.",
      item: null,
    };
  }
}

export async function deleteImagesAction(ids: string[]): Promise<DeleteImagesActionResult> {
  if (ids.length === 0) {
    return {
      ok: false,
      message: "No images selected.",
    };
  }

  try {
    const response = await fetchApi("/admin/images/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to delete selected images."),
      };
    }

    return {
      ok: true,
      message: getMessage(data, "Images deleted successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Image API is unavailable.",
    };
  }
}

export async function moveImagesAction(
  folder_id: string,
  ids: string[],
): Promise<MoveImagesActionResult> {
  if (ids.length === 0) {
    return {
      ok: false,
      message: "No images selected.",
    };
  }

  try {
    const response = await fetchApi("/admin/images/move", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder_id,
        ids,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to move selected images."),
      };
    }

    return {
      ok: true,
      message: getMessage(data, "Images moved successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Image API is unavailable.",
    };
  }
}
