export type MediaType = "image" | "video";

export type MediaItem = {
  id: string;
  type: MediaType;
  name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
};

const STORAGE_KEY = "sp_admin_media_center_v1";

function createMediaId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `media_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isBrowser() {
  return typeof window !== "undefined";
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
        typeof candidate.created_at === "string"
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

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return parseStoredItems(raw).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function saveMediaItems(items: MediaItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function addMediaFiles(files: File[]): Promise<MediaItem[]> {
  const validFiles = files.filter((file) => getMediaType(file.type));

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
        created_at: new Date().toISOString(),
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
