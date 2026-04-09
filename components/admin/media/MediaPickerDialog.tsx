"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, FolderOpen, Image as ImageIcon, Upload, Video, X } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import type { MediaFolder, MediaItem, MediaType } from "@/lib/admin/media-library";
import {
  addMediaFiles,
  getMediaItems,
  saveMediaItems,
} from "@/lib/admin/media-library";
import { getFoldersAction } from "@/lib/api/folder-actions";
import { uploadImageAction } from "@/lib/api/image-actions";
import { cn } from "@/lib/utils";

type MediaPickerDialogProps = {
  isOpen: boolean;
  mediaType: MediaType;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPickerDialog({ isOpen, mediaType, onClose, onSelect }: MediaPickerDialogProps) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isVideoType = mediaType === "video";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    async function hydrateFolders() {
      const result = await getFoldersAction();

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        setFolders([]);
        setError(result.message || "Failed to load folders.");
        return;
      }

      setFolders(result.items);
      setError("");
    }

    void hydrateFolders();
    setItems(getMediaItems());
    setCurrentFolderId(null);

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isVideoType) {
      setCurrentFolderId(null);
    }
  }, [isVideoType]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (!isVideoType && item.folder_id !== currentFolderId) {
        return false;
      }

      if (item.type !== mediaType) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return item.name.toLowerCase().includes(lowerQuery);
    });
  }, [currentFolderId, isVideoType, items, mediaType, query]);

  const visibleFolders = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return folders.filter((folder) => {
      if (folder.parent_id !== currentFolderId) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return folder.name.toLowerCase().includes(lowerQuery);
    });
  }, [currentFolderId, folders, query]);

  const breadcrumbs = useMemo(() => {
    if (!currentFolderId) {
      return [{ id: null as string | null, name: "Home" }];
    }

    const byId = new Map(folders.map((folder) => [folder.id, folder]));
    const chain: MediaFolder[] = [];

    let activeId: string | null = currentFolderId;
    while (activeId) {
      const currentFolder = byId.get(activeId);
      if (!currentFolder) {
        break;
      }

      chain.push(currentFolder);
      activeId = currentFolder.parent_id;
    }

    return [{ id: null as string | null, name: "Home" }, ...chain.reverse()];
  }, [currentFolderId, folders]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      if (mediaType === "image") {
        const uploadedItems = [] as MediaItem[];

        for (const file of selected) {
          if (!file.type.startsWith("image/")) {
            continue;
          }

          const payload = new FormData();
          payload.append("file", file);
          payload.append("folder_id", currentFolderId ?? "");

          const result = await uploadImageAction(payload);
          if (!result.ok) {
            setError(result.message || "Failed to upload files.");
            continue;
          }

          if (!result.item) {
            continue;
          }

          uploadedItems.push({
            ...result.item,
            type: "image",
          });
        }

        if (uploadedItems.length > 0) {
          const existingItems = getMediaItems();
          const nextItems = [
            ...uploadedItems,
            ...existingItems.filter((item) => !uploadedItems.some((uploaded) => uploaded.id === item.id)),
          ];

          saveMediaItems(nextItems);
          setItems(nextItems);
        }

        return;
      }

      const nextItems = await addMediaFiles(selected, {
        folder_id: isVideoType ? null : currentFolderId,
        media_type: mediaType,
      });
      setItems(nextItems);
    } catch {
      setError("Failed to upload files.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close media picker"
      />

      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Select from Media Center</h3>
            <p className="text-sm text-slate-500">
              Showing {mediaType === "image" ? "images" : "videos"} for the current editor action.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isVideoType ? "Search video" : "Search folder or file"}
            className="max-w-sm"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === "image" ? "image/*" : "video/*"}
            className="hidden"
            multiple
            onChange={onUpload}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload size={14} />
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>

        {error ? <p className="mb-3 text-sm font-medium text-rose-600">{error}</p> : null}

        {!isVideoType ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <button
                  key={crumb.id ?? "root"}
                  type="button"
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={cn(
                    "inline-flex items-center gap-2 text-slate-600 hover:text-slate-900",
                    index === breadcrumbs.length - 1 ? "font-semibold text-slate-800" : "",
                  )}
                >
                  {index === 0 ? <FolderOpen size={14} /> : null}
                  {crumb.name}
                  {index < breadcrumbs.length - 1 ? <ChevronRight size={14} /> : null}
                </button>
              ))}
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Folders</p>
              {visibleFolders.length === 0 ? (
                <p className="text-sm text-slate-500">No folder found in this location.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {visibleFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-indigo-300"
                    >
                      <FolderOpen size={16} className="text-amber-500" />
                      <span className="truncate">{folder.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm text-slate-500">No {mediaType} found.</p>
          </div>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition",
                  "hover:border-indigo-300 hover:shadow-sm",
                )}
              >
                <div className="aspect-video w-full bg-slate-100">
                  {item.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <video src={item.url} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-xs font-semibold text-slate-800" title={item.name}>{item.name}</p>
                  <p className="text-[11px] text-slate-500">{formatSize(item.size)}</p>
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    {item.type === "image" ? <ImageIcon size={12} /> : <Video size={12} />}
                    {item.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
