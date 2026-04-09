"use server";

import { revalidatePath } from "next/cache";

import { fetchApi } from "./common";
import { getFolders, type FolderApiModel } from "./folders";

export type FolderActionResult = {
  ok: boolean;
  message: string;
};

export type GetFoldersActionResult = {
  ok: boolean;
  message: string;
  items: FolderApiModel[];
};

function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}

function toParentId(value: string | null | undefined): string {
  return value ? value : "";
}

export async function getFoldersAction(folder_id: number | string ): Promise<GetFoldersActionResult> {
  try {
    const items = await getFolders(folder_id);

    return {
      ok: true,
      message: "Folders loaded successfully.",
      items,
    };
  } catch {
    return {
      ok: false,
      message: "Folder API is unavailable.",
      items: [],
    };
  }
}

export async function createFolderAction(name: string, parent_id: string | null): Promise<FolderActionResult> {
  try {
    const payload = new FormData();
    payload.append("name", name);
    payload.append("parent_id", toParentId(parent_id));

    const response = await fetchApi("/admin/folders", {
      method: "POST",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to create folder."),
      };
    }

    revalidatePath("/admin/media-center");
    return {
      ok: true,
      message: getMessage(data, "Folder created successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Folder API is unavailable.",
    };
  }
}

export async function updateFolderAction(
  folderId: string,
  name: string,
  parent_id: string | null,
): Promise<FolderActionResult> {
  try {
    const payload = new FormData();
    payload.append("name", name);
    payload.append("parent_id", toParentId(parent_id));

    const response = await fetchApi(`/admin/folders/${folderId}`, {
      method: "PUT",
      body: payload,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to update folder."),
      };
    }

    revalidatePath("/admin/media-center");
    return {
      ok: true,
      message: getMessage(data, "Folder updated successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Folder API is unavailable.",
    };
  }
}

export async function deleteFolderAction(folderId: string): Promise<FolderActionResult> {
  try {
    const response = await fetchApi(`/admin/folders/${folderId}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        message: getMessage(data, "Failed to delete folder."),
      };
    }

    revalidatePath("/admin/media-center");
    return {
      ok: true,
      message: getMessage(data, "Folder deleted successfully."),
    };
  } catch {
    return {
      ok: false,
      message: "Folder API is unavailable.",
    };
  }
}
