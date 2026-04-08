export type MediaType = "image" | "video";

export type MediaFolder = {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
};

export type MediaItem = {
  id: string;
  type: MediaType;
  name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
  folder_id: string | null;
};

const MEDIA_STORAGE_KEY = "sp_admin_media_center_v1";
const FOLDER_STORAGE_KEY = "sp_admin_media_folders_v1";

function createMediaId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `media_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getNowIso() {
  return new Date().toISOString();
}

function normalizeFolderName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parseStoredFolders(value: string | null): MediaFolder[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is MediaFolder => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;

      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        (candidate.parent_id === null || typeof candidate.parent_id === "string") &&
        typeof candidate.created_at === "string"
      );
    });
  } catch {
    return [];
  }
}

function parseStoredItems(value: string | null): MediaItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is MediaItem => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Record<string, unknown>;

      return (
        typeof candidate.id === "string" &&
        (candidate.type === "image" || candidate.type === "video") &&
        typeof candidate.name === "string" &&
        typeof candidate.url === "string" &&
        typeof candidate.mime_type === "string" &&
        typeof candidate.size === "number" &&
        typeof candidate.created_at === "string" &&
        (candidate.folder_id === undefined || candidate.folder_id === null || typeof candidate.folder_id === "string")
      );
    });
  } catch {
    return [];
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected file"));
    reader.readAsDataURL(file);
  });
}

function getMediaType(mimeType: string): MediaType | null {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  return null;
}

export function getMediaItems(): MediaItem[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(MEDIA_STORAGE_KEY);
  return parseStoredItems(raw)
    .map((item) => ({
      ...item,
      folder_id: item.folder_id ?? null,
    }))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function saveMediaItems(items: MediaItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
}

export function getMediaFolders(): MediaFolder[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(FOLDER_STORAGE_KEY);
  return parseStoredFolders(raw).sort((a, b) => a.name.localeCompare(b.name));
}

export function saveMediaFolders(folders: MediaFolder[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
}

export function createMediaFolder(name: string, parentId: string | null): {
  folders: MediaFolder[];
  folder: MediaFolder;
} {
  const nextName = normalizeFolderName(name);
  if (!nextName) {
    throw new Error("Folder name is required.");
  }

  const folders = getMediaFolders();
  const parentExists = parentId === null || folders.some((folder) => folder.id === parentId);
  if (!parentExists) {
    throw new Error("Parent folder not found.");
  }

  const duplicate = folders.some(
    (folder) =>
      folder.parent_id === parentId &&
      folder.name.toLowerCase() === nextName.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("A folder with the same name already exists.");
  }

  const createdFolder: MediaFolder = {
    id: createMediaId(),
    name: nextName,
    parent_id: parentId,
    created_at: getNowIso(),
  };

  const nextFolders = [...folders, createdFolder].sort((a, b) => a.name.localeCompare(b.name));
  saveMediaFolders(nextFolders);

  return {
    folders: nextFolders,
    folder: createdFolder,
  };
}

export function getFolderChildren(parentId: string | null): MediaFolder[] {
  return getMediaFolders().filter((folder) => folder.parent_id === parentId);
}

export function getFolderAncestors(folderId: string | null): MediaFolder[] {
  if (!folderId) {
    return [];
  }

  const folders = getMediaFolders();
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const chain: MediaFolder[] = [];

  let currentId: string | null = folderId;
  while (currentId) {
    const currentFolder = byId.get(currentId);
    if (!currentFolder) {
      break;
    }

    chain.push(currentFolder);
    currentId = currentFolder.parent_id;
  }

  return chain.reverse();
}

export async function addMediaFiles(
  files: File[],
  options?: { folder_id?: string | null; media_type?: MediaType },
): Promise<MediaItem[]> {
  const folderId = options?.folder_id ?? null;
  const mediaType = options?.media_type;

  const validFiles = files.filter((file) => {
    const type = getMediaType(file.type);
    if (!type) {
      return false;
    }

    if (mediaType && type !== mediaType) {
      return false;
    }

    return true;
  });

  const createdItems = await Promise.all(
    validFiles.map(async (file) => {
      const type = getMediaType(file.type);
      if (!type) {
        return null;
      }

      return {
        id: createMediaId(),
        type,
        name: file.name,
        url: await fileToDataUrl(file),
        mime_type: file.type,
        size: file.size,
        created_at: getNowIso(),
        folder_id: folderId,
      } satisfies MediaItem;
    }),
  );

  const nextItems = [
    ...createdItems.filter((item): item is MediaItem => item !== null),
    ...getMediaItems(),
  ];
  saveMediaItems(nextItems);

  return nextItems;
}

export function removeMediaItem(itemId: string): MediaItem[] {
  const items = getMediaItems().filter((item) => item.id !== itemId);
  saveMediaItems(items);
  return items;
}
