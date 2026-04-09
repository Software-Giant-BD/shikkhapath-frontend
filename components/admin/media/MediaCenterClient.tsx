"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Check,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
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
import { deleteImagesAction, moveImagesAction, uploadImageAction } from "@/lib/api/image-actions";
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

const ACTIVE_FOLDER_STORAGE_KEY = "sp_admin_media_active_folder_id";

export function MediaCenterClient() {
  const [items, setItems] = useState<MediaItem[]>(() => getMediaItems());
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [tab, setTab] = useState<MediaType>("image");
  const [query, setQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedFolderId = window.localStorage.getItem(ACTIVE_FOLDER_STORAGE_KEY);
    return savedFolderId && savedFolderId.trim() ? savedFolderId : null;
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [isDeletingImages, setIsDeletingImages] = useState(false);
  const [isMovingImages, setIsMovingImages] = useState(false);
  const [isDeleteImagesConfirmOpen, setIsDeleteImagesConfirmOpen] = useState(false);
  const [isMoveImagesOpen, setIsMoveImagesOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [openFolderMenuId, setOpenFolderMenuId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: "Home" },
  ]);
  const [moveFolders, setMoveFolders] = useState<MediaFolder[]>([]);
  const [moveBreadcrumbs, setMoveBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: "Home" },
  ]);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>("");
  const [isLoadingMoveFolders, setIsLoadingMoveFolders] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isVideoTab = tab === "video";

  const refreshFolders = useCallback(async (folderId: string) => {
    setIsLoadingFolders(true);

    const result = await getFoldersAction(folderId);

    if (!result.ok) {
      setError(result.message || "Failed to load folders.");
      setIsLoadingFolders(false);
      return;
    }

    setFolders(result.items);
    const videoItems = getMediaItems().filter((item) => item.type === "video");
    const imageItems = result.images.map((image) => ({
      id: image.id,
      type: "image" as const,
      name: image.file_name,
      url: image.original_url,
      mime_type: image.mime_type,
      size: image.size,
      created_at: image.created_at,
      folder_id: image.folder_id,
    }));
    setItems([...imageItems, ...videoItems]);

    setBreadcrumbs([
      { id: null, name: "Home" },
      ...result.parent_hierarchy.map((node) => ({ id: node.id, name: node.name })),
    ]);

    if (folderId && result.parent_hierarchy.length === 0) {
      setCurrentFolderId(null);
    }

    setError("");
    setIsLoadingFolders(false);
  }, []);

  useEffect(() => {
    setItems(getMediaItems());
  }, []);

  useEffect(() => {
    if (isVideoTab) {
      return;
    }

    void refreshFolders(currentFolderId ?? "");
  }, [currentFolderId, isVideoTab, refreshFolders]);

  useEffect(() => {
    if (isVideoTab) {
      setCurrentFolderId(null);
      setBreadcrumbs([{ id: null, name: "Home" }]);
      setIsCreateFolderOpen(false);
      setOpenFolderMenuId(null);
      setSelectedImageIds([]);
    }
  }, [isVideoTab]);

  useEffect(() => {
    if (tab === "image") {
      setSelectedImageIds([]);
    }
  }, [currentFolderId, tab]);

  useEffect(() => {
    if (!openFolderMenuId) {
      return;
    }

    const handleOutsideClick = () => {
      setOpenFolderMenuId(null);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openFolderMenuId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentFolderId) {
      window.localStorage.setItem(ACTIVE_FOLDER_STORAGE_KEY, currentFolderId);
      return;
    }

    window.localStorage.removeItem(ACTIVE_FOLDER_STORAGE_KEY);
  }, [currentFolderId]);

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

  const imageItems = useMemo(() => {
    return filteredItems.filter((item) => item.type === "image");
  }, [filteredItems]);

  const allVisibleImagesSelected = imageItems.length > 0 && imageItems.every((item) => selectedImageIds.includes(item.id));

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      if (tab === "image") {
        let successCount = 0;

        for (const file of selected) {
          if (!file.type.startsWith("image/")) {
            continue;
          }

          const payload = new FormData();
          payload.append("file", file);
          payload.append("folder_id", currentFolderId ?? "");

          const result = await uploadImageAction(payload);
          if (!result.ok) {
            setError(result.message || "Files upload failed. Check file type and try again.");
            continue;
          }

          successCount += 1;
        }

        if (successCount > 0) {
          await refreshFolders(currentFolderId ?? "");
        }

        return;
      }

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

      await refreshFolders(currentFolderId ?? "");
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
    setOpenFolderMenuId(null);
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsCreateFolderOpen(true);
    setError("");
  };

  const onDeleteFolder = async (folder: MediaFolder) => {
    setOpenFolderMenuId(null);

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

      await refreshFolders(currentFolderId ?? "");
    } finally {
      setIsSavingFolder(false);
    }
  };

  const onOpenFolder = (folder: MediaFolder) => {
    setOpenFolderMenuId(null);
    setCurrentFolderId(folder.id);
  };

  const onBreadcrumbClick = (index: number) => {
    const target = breadcrumbs[index];
    setCurrentFolderId(target?.id ?? null);
  };

  const onToggleImageSelection = (imageId: string, checked: boolean) => {
    setSelectedImageIds((prev) => {
      if (checked) {
        return prev.includes(imageId) ? prev : [...prev, imageId];
      }

      return prev.filter((id) => id !== imageId);
    });
  };

  const onToggleSelectAllImages = () => {
    if (allVisibleImagesSelected) {
      setSelectedImageIds([]);
      return;
    }

    setSelectedImageIds(imageItems.map((item) => item.id));
  };

  const onDeleteSelectedImages = async () => {
    if (selectedImageIds.length === 0 || isDeletingImages) {
      return;
    }

    setIsDeletingImages(true);
    setError("");

    try {
      const result = await deleteImagesAction(selectedImageIds);

      if (!result.ok) {
        setError(result.message || "Failed to delete selected images.");
        return;
      }

      setIsDeleteImagesConfirmOpen(false);
      setSelectedImageIds([]);
      await refreshFolders(currentFolderId ?? "");
    } finally {
      setIsDeletingImages(false);
    }
  };

  const loadMoveFolders = useCallback(async (folderId: string) => {
    setIsLoadingMoveFolders(true);

    try {
      const result = await getFoldersAction(folderId);

      if (!result.ok) {
        setError(result.message || "Failed to load folders.");
        return;
      }

      setMoveFolders(result.items);
      setMoveBreadcrumbs([
        { id: null, name: "Home" },
        ...result.parent_hierarchy.map((node) => ({ id: node.id, name: node.name })),
      ]);
      setTargetMoveFolderId(folderId);
    } finally {
      setIsLoadingMoveFolders(false);
    }
  }, []);

  const onOpenMoveModal = async () => {
    if (selectedImageIds.length === 0 || isMovingImages) {
      return;
    }

    setIsMoveImagesOpen(true);
    await loadMoveFolders(currentFolderId ?? "");
  };

  const onMoveBreadcrumbClick = async (index: number) => {
    const target = moveBreadcrumbs[index];
    await loadMoveFolders(target?.id ?? "");
  };

  const onMoveFolderOpen = async (folder: MediaFolder) => {
    await loadMoveFolders(folder.id);
  };

  const onConfirmMoveImages = async () => {
    if (selectedImageIds.length === 0 || isMovingImages) {
      return;
    }

    setIsMovingImages(true);
    setError("");

    try {
      const result = await moveImagesAction(targetMoveFolderId, selectedImageIds);

      if (!result.ok) {
        setError(result.message || "Failed to move selected images.");
        return;
      }

      setSelectedImageIds([]);
      setIsMoveImagesOpen(false);
      await refreshFolders(currentFolderId ?? "");
    } finally {
      setIsMovingImages(false);
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
                  isVideoTab ? "Search File" : "Search  file"
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
                  onClick={() => onBreadcrumbClick(index)}
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
                      className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:bg-slate-100/70"
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenFolderMenuId((prev) => (prev === folder.id ? null : folder.id));
                        }}
                        className={cn(
                          "absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-opacity hover:bg-slate-200",
                          openFolderMenuId === folder.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                        )}
                        aria-label={`Folder actions for ${folder.name}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {openFolderMenuId === folder.id ? (
                        <div
                          className="absolute right-2 top-11 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onEditFolder(folder)}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void onDeleteFolder(folder)}
                            disabled={isSavingFolder}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => onOpenFolder(folder)}
                        className="flex w-full flex-col items-center gap-3 pt-2 text-center"
                      >
                        <FolderOpen size={64} className="text-amber-500" strokeWidth={1.8} />
                        <span className="w-full truncate text-xl font-medium text-slate-600">
                          {folder.name}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {tab === "image" ? "Image Gallery" : "Video Gallery"}
              </p>

              {tab === "image" ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSelectAllImages}
                    disabled={imageItems.length === 0}
                  >
                    {allVisibleImagesSelected ? "Unselect All" : "Select All"}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDeleteImagesConfirmOpen(true)}
                    disabled={selectedImageIds.length === 0 || isDeletingImages}
                  >
                    <Trash2 size={14} />
                    {isDeletingImages
                      ? "Deleting..."
                      : `Delete Selected (${selectedImageIds.length})`}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void onOpenMoveModal()}
                    disabled={selectedImageIds.length === 0 || isMovingImages}
                  >
                    {isMovingImages ? "Moving..." : "Move to"}
                  </Button>
                </div>
              ) : null}
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
                    className={cn(
                      "relative overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      item.type === "image" && selectedImageIds.includes(item.id)
                        ? "border-orange-400 ring-2 ring-orange-200"
                        : "border-slate-200",
                    )}
                  >
                    {tab === "image" && item.type === "image" ? (
                      <label className="absolute left-2 top-2 z-10 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white/95 shadow">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-orange-500"
                          checked={selectedImageIds.includes(item.id)}
                          onChange={(event) => onToggleImageSelection(item.id, event.target.checked)}
                        />
                      </label>
                    ) : null}

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

      {isDeleteImagesConfirmOpen ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={() => {
              if (!isDeletingImages) {
                setIsDeleteImagesConfirmOpen(false);
              }
            }}
            aria-label="Close image delete confirmation"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-3xl font-semibold text-slate-900">
                {selectedImageIds.length > 1 ? "Delete Images" : "Delete Image"}
              </h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => {
                  if (!isDeletingImages) {
                    setIsDeleteImagesConfirmOpen(false);
                  }
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-6 text-l text-slate-600">
              {selectedImageIds.length > 1
                ? `Are you sure you want to delete these ${selectedImageIds.length} images?`
                : "Are you sure you want to delete this image?"}
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeleteImagesConfirmOpen(false)}
                disabled={isDeletingImages}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => void onDeleteSelectedImages()}
                disabled={isDeletingImages}
              >
                {isDeletingImages ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isMoveImagesOpen ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={() => {
              if (!isMovingImages) {
                setIsMoveImagesOpen(false);
              }
            }}
            aria-label="Close move images dialog"
          />

          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900">Move Image to</h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => {
                  if (!isMovingImages) {
                    setIsMoveImagesOpen(false);
                  }
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-3 text-sm text-slate-500">Select a folder to move the images to.</p>

            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">
              {moveBreadcrumbs.map((crumb, index) => (
                <button
                  key={crumb.id ?? "root"}
                  type="button"
                  onClick={() => void onMoveBreadcrumbClick(index)}
                  className={cn(
                    "inline-flex items-center gap-2 text-slate-600 hover:text-slate-900",
                    index === moveBreadcrumbs.length - 1 ? "font-semibold text-slate-800" : "",
                  )}
                >
                  {index === 0 ? <FolderOpen size={15} /> : null}
                  {crumb.name}
                  {index < moveBreadcrumbs.length - 1 ? <ChevronRight size={14} /> : null}
                </button>
              ))}
            </div>

            {isLoadingMoveFolders ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Loading folders...
              </div>
            ) : moveFolders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No sub-folder found in this location.
              </div>
            ) : (
              <div className="grid max-h-[38vh] grid-cols-2 gap-4 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4">
                {moveFolders.map((folder) => {
                  const isSelected = targetMoveFolderId === folder.id;

                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => {
                        setTargetMoveFolderId(folder.id);
                      }}
                      onDoubleClick={() => void onMoveFolderOpen(folder)}
                      className={cn(
                        "relative rounded-xl border bg-white p-3 text-left transition hover:border-indigo-300",
                        isSelected ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200",
                      )}
                    >
                      {isSelected ? (
                        <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check size={12} />
                        </span>
                      ) : null}
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FolderOpen size={52} className="text-amber-500" />
                        <span className="w-full truncate text-sm font-medium text-slate-700">{folder.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsMoveImagesOpen(false)}
                disabled={isMovingImages}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void onConfirmMoveImages()}
                disabled={isMovingImages}
              >
                {isMovingImages ? "Moving..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

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
