"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import type {
  MediaFolder,
  MediaItem,
  MediaType,
} from "@/lib/admin/media-library";
import {
  addMediaFiles,
  getMediaItems,
} from "@/lib/admin/media-library";
import {
  createFolderAction,
  deleteFolderAction,
  getFoldersAction,
  updateFolderAction,
} from "@/lib/api/folder-actions";
import { cn } from "@/lib/utils";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateOnly(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function MediaCenterClient() {
  const [items, setItems] = useState<MediaItem[]>(() => getMediaItems());
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [tab, setTab] = useState<MediaType>("image");
  const [query, setQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isVideoTab = tab === "video";

  const refreshFolders = useCallback(async () => {
    setIsLoadingFolders(true);

    const result = await getFoldersAction('');

    if (!result.ok) {
      setError(result.message || "Failed to load folders.");
      setIsLoadingFolders(false);
      return;
    }

    setFolders(result.items);
    setError("");
    setCurrentFolderId((prev) => {
      if (!prev) {
        return null;
      }

      return result.items.some((folder) => folder.id === prev) ? prev : null;
    });
    setIsLoadingFolders(false);
  }, []);

  useEffect(() => {
    setItems(getMediaItems());
    void refreshFolders();
  }, [refreshFolders]);

  useEffect(() => {
    if (isVideoTab) {
      setCurrentFolderId(null);
      setIsCreateFolderOpen(false);
    }
  }, [isVideoTab]);

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
      if (!isVideoTab && item.folder_id !== currentFolderId) {
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
  }, [currentFolderId, isVideoTab, items, query, tab]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const nextItems = await addMediaFiles(selected, {
        folder_id: isVideoTab ? null : currentFolderId,
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

  const onCreateFolder = async () => {
    const nextName = newFolderName.trim();
    if (!nextName || isSavingFolder) {
      return;
    }

    setIsSavingFolder(true);

    try {
      const result = editingFolder
        ? await updateFolderAction(editingFolder.id, nextName, editingFolder.parent_id)
        : await createFolderAction(nextName, currentFolderId);

      if (!result.ok) {
        setError(result.message || "Failed to save folder.");
        return;
      }

      await refreshFolders();
      setNewFolderName("");
      setEditingFolder(null);
      setIsCreateFolderOpen(false);
      setError("");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to save folder.",
      );
    } finally {
      setIsSavingFolder(false);
    }
  };

  const onEditFolder = (folder: MediaFolder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsCreateFolderOpen(true);
    setError("");
  };

  const onDeleteFolder = async (folder: MediaFolder) => {
    if (isSavingFolder) {
      return;
    }

    const confirmed = window.confirm(`Delete folder \"${folder.name}\"?`);
    if (!confirmed) {
      return;
    }

    setIsSavingFolder(true);
    setError("");

    try {
      const result = await deleteFolderAction(folder.id);
      if (!result.ok) {
        setError(result.message || "Failed to delete folder.");
        return;
      }

      await refreshFolders();
    } finally {
      setIsSavingFolder(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-10">
              <h4 className="text-3xl font-bold text-slate-900">Media Center</h4>
              <div className="flex items-center gap-4">
                {(["image", "video"] as MediaType[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTab(value)}
                    className={cn(
                      "border-b-2 pb-1 text-xl font-medium transition-colors",
                      tab === value
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-slate-800 hover:text-slate-900",
                    )}
                  >
                    {value === "image" ? "Images" : "Videos"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  isVideoTab ? "Search video" : "Search folder or file"
                }
                className="w-56"
              />

              {!isVideoTab ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingFolder(null);
                    setNewFolderName("");
                    setIsCreateFolderOpen(true);
                  }}
                >
                  <FolderPlus size={14} />
                  New Folder
                </Button>
              ) : null}

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
                {isUploading
                  ? "Uploading..."
                  : tab === "image"
                    ? "Upload Image"
                    : "Upload Video"}
              </Button>
            </div>
          </div>

          {!isVideoTab ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <button
                  key={crumb.id ?? "root"}
                  type="button"
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={cn(
                    "inline-flex items-center gap-2 text-slate-600 hover:text-slate-900",
                    index === breadcrumbs.length - 1
                      ? "font-semibold text-slate-800"
                      : "",
                  )}
                >
                  {index === 0 ? <FolderOpen size={15} /> : null}
                  {crumb.name}
                  {index < breadcrumbs.length - 1 ? (
                    <ChevronRight size={14} />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}

          {!isVideoTab ? (
            <div className="space-y-3">
              {isLoadingFolders ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  Loading folders...
                </div>
              ) : visibleFolders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No folder found in this location.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {visibleFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="space-y-2 rounded-xl border border-slate-200 bg-white px-3 py-4 transition hover:border-indigo-300"
                    >
                      <button
                        type="button"
                        onClick={() => setCurrentFolderId(folder.id)}
                        className="flex w-full items-center gap-2 text-left"
                      >
                        <FolderOpen size={18} className="text-amber-500" />
                        <span className="truncate text-sm font-medium text-slate-700">
                          {folder.name}
                        </span>
                      </button>

                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditFolder(folder)}
                          title="Rename folder"
                          aria-label={`Rename ${folder.name}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => void onDeleteFolder(folder)}
                          disabled={isSavingFolder}
                          title="Delete folder"
                          aria-label={`Delete ${folder.name}`}
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              {tab === "image" ? "Image Gallery" : "Video Gallery"}
            </div>

            {filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
                {isVideoTab
                  ? "No video found."
                  : "No image found in this folder."}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="aspect-video bg-slate-100">
                      {item.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          controls={false}
                        />
                      )}
                    </div>

                    <div className="space-y-2 p-3.5">
                      <p
                        className="truncate text-base font-semibold text-slate-900"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatSize(item.size)}</span>
                        <span>{formatDateOnly(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isCreateFolderOpen ? (
        <div className="fixed inset-0 z-85 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45"
            onClick={() => {
              setIsCreateFolderOpen(false);
              setEditingFolder(null);
              setNewFolderName("");
            }}
            aria-label="Close create folder dialog"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingFolder ? "Rename Folder" : "Create New Folder"}
              </h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => {
                  setIsCreateFolderOpen(false);
                  setEditingFolder(null);
                  setNewFolderName("");
                }}
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreateFolderOpen(false);
                    setEditingFolder(null);
                    setNewFolderName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => void onCreateFolder()}
                  disabled={isSavingFolder || !newFolderName.trim()}
                >
                  {isSavingFolder
                    ? "Saving..."
                    : editingFolder
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
