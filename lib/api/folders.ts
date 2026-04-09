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

export type GetFoldersResult = {
  items: FolderApiModel[];
  parent_hierarchy: FolderHierarchyNode[];
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
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

    return {
      items,
      parent_hierarchy,
    };
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return {
      items: [],
      parent_hierarchy: [],
    };
  }
}
