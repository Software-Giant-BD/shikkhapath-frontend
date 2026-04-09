import "server-only";

import { fetchApi } from "./common";

export type FolderApiModel = {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
};

export type FolderHierarchyNode = {
  id: string;
  name: string;
};

export type FolderImageApiModel = {
  id: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
  created_at: string;
  folder_id: string | null;
};

export type GetFoldersResult = {
  items: FolderApiModel[];
  parent_hierarchy: FolderHierarchyNode[];
  images: FolderImageApiModel[];
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

function getPayloadMessage(payload: unknown): string | null {
  const data = asObject(payload);
  return typeof data.message === "string" && data.message.trim() ? data.message : null;
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const data = asObject(payload);
  if (Array.isArray(data.resources)) {
    return data.resources;
  }

  const resources = asObject(data.resources);
  const candidates = [resources.folders, resources.items, resources.data, data.folders, data.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function extractParentHierarchy(payload: unknown): unknown[] {
  const data = asObject(payload);
  const resources = asObject(data.resources);

  const candidates = [
    resources.parent_hierarchy,
    resources.parentHierarchy,
    data.parent_hierarchy,
    data.parentHierarchy,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function extractImages(payload: unknown): unknown[] {
  const data = asObject(payload);
  const resources = asObject(data.resources);

  const candidates = [resources.images, resources.files, data.images, data.files];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function normalizeFolder(value: unknown): FolderApiModel {
  const item = asObject(value);

  const parentRaw = item.parent_id ?? item.parentId;
  const parentId = asString(parentRaw);

  return {
    id: asString(item.id),
    name: asString(item.name),
    parent_id: parentId || null,
    created_at: asString(item.created_at ?? item.createdAt),
  };
}

function normalizeHierarchyNode(value: unknown): FolderHierarchyNode | null {
  const item = asObject(value);
  const id = asString(item.id);
  const name = asString(item.name);

  if (!id || !name) {
    return null;
  }

  return { id, name };
}

function normalizeFolderImage(value: unknown, requestedFolderId: string): FolderImageApiModel | null {
  const item = asObject(value);

  const id = asString(item.id);
  const original_url = asString(item.original_url ?? item.url ?? item.image_url);

  if (!id || !original_url) {
    return null;
  }

  const folderId = asString(item.folder_id ?? item.folderId ?? requestedFolderId);

  return {
    id,
    file_name: asString(item.file_name ?? item.name ?? "image"),
    mime_type: asString(item.mime_type ?? item.mimeType ?? "image/*"),
    size: asNumber(item.size),
    original_url,
    created_at: asString(item.created_at ?? item.createdAt, new Date().toISOString()),
    folder_id: folderId || null,
  };
}

export async function getFolders(folder_id = ""): Promise<GetFoldersResult> {
  try {
    const query = new URLSearchParams({ folder_id });
    const url = `/admin/folders?${query.toString()}`;
    const response = await fetchApi(url);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(getPayloadMessage(payload) || "Failed to load folders.");
    }

    const items = extractList(payload)
      .map(normalizeFolder)
      .filter((folder) => folder.id && folder.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    const parent_hierarchy = extractParentHierarchy(payload)
      .map(normalizeHierarchyNode)
      .filter((node): node is FolderHierarchyNode => node !== null);

    const images = extractImages(payload)
      .map((image) => normalizeFolderImage(image, folder_id))
      .filter((image): image is FolderImageApiModel => image !== null);

    return {
      items,
      parent_hierarchy,
      images,
    };
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return {
      items: [],
      parent_hierarchy: [],
      images: [],
    };
  }
}
