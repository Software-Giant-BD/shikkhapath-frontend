"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Upload, Video, X } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import type { MediaItem, MediaType } from "@/lib/admin/media-library";
import { addMediaFiles, getMediaItems } from "@/lib/admin/media-library";
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
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setItems(getMediaItems());
    setError("");
  }, [isOpen]);

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
      if (item.type !== mediaType) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return item.name.toLowerCase().includes(lowerQuery);
    });
  }, [items, mediaType, query]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) {
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const nextItems = await addMediaFiles(selected);
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
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
            placeholder="Search by file name"
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

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm text-slate-500">No {mediaType} found. Upload new files from here or use Media Center page.</p>
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
