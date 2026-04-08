"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Film,
  FolderOpen,
  FolderPlus,
  Image as ImageIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import type { MediaFolder, MediaItem, MediaType } from "@/lib/admin/media-library";
import {
  addMediaFiles,
  createMediaFolder,
  getMediaFolders,
  getMediaItems,
  removeMediaItem,
} from "@/lib/admin/media-library";
import { cn } from "@/lib/utils";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaCenterClient() {
  const [items, setItems] = useState<MediaItem[]>(() => getMediaItems());
  const [folders, setFolders] = useState<MediaFolder[]>(() => getMediaFolders());
  const [tab, setTab] = useState<MediaType>("image");
  const [query, setQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setItems(getMediaItems());
    setFolders(getMediaFolders());
  }, []);

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

  const filteredItems = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (item.folder_id !== currentFolderId) {
        return false;
      }

      if (item.type !== tab) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return item.name.toLowerCase().includes(lowerQuery);
    });
  }, [currentFolderId, items, query, tab]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const nextItems = await addMediaFiles(selected, {
        folder_id: currentFolderId,
        media_type: tab,
      });
      setItems(nextItems);
    } catch {
      setError("Files upload failed. Check file type and try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onDelete = (itemId: string) => {
    setItems(removeMediaItem(itemId));
  };

  const onCreateFolder = () => {
    try {
      const result = createMediaFolder(newFolderName, currentFolderId);
      setFolders(result.folders);
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      setError("");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create folder.");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(["image", "video"] as MediaType[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                    tab === value
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300",
                  )}
                >
                  {value === "image" ? <ImageIcon size={16} /> : <Film size={16} />}
                  {value === "image" ? "Images" : "Videos"}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search folder or file"
                className="w-56"
              />

              <Button type="button" variant="secondary" onClick={() => setIsCreateFolderOpen(true)}>
                <FolderPlus size={14} />
                New Folder
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept={tab === "image" ? "image/*" : "video/*"}
                className="hidden"
                multiple
                onChange={onUpload}
              />

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload size={14} />
                {isUploading ? "Uploading..." : tab === "image" ? "Upload Image" : "Upload Video"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
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
                {index === 0 ? <FolderOpen size={15} /> : null}
                {crumb.name}
                {index < breadcrumbs.length - 1 ? <ChevronRight size={14} /> : null}
              </button>
            ))}
          </div>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700">Folders</h4>

            {visibleFolders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No folder found in this location.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {visibleFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 text-left transition hover:border-indigo-300"
                  >
                    <FolderOpen size={18} className="text-amber-500" />
                    <span className="truncate text-sm font-medium text-slate-700">{folder.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {tab === "image" ? "Image Gallery" : "Video Gallery"}
            </h4>

            {filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
                No {tab} found in this folder.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {filteredItems.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="aspect-video bg-slate-100">
                      {item.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <video src={item.url} className="h-full w-full object-cover" controls={false} />
                      )}
                    </div>

                    <div className="space-y-1 p-3">
                      <p className="truncate text-xs font-semibold text-slate-800" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{formatSize(item.size)}</p>
                      <p className="text-[11px] text-slate-500">{new Date(item.created_at).toLocaleString()}</p>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isCreateFolderOpen ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45"
            onClick={() => setIsCreateFolderOpen(false)}
            aria-label="Close create folder dialog"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Create New Folder</h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => setIsCreateFolderOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="Folder name"
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsCreateFolderOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={onCreateFolder}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
