"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Film, FolderOpen, Image as ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import type { MediaItem, MediaType } from "@/lib/admin/media-library";
import { addMediaFiles, getMediaItems, removeMediaItem } from "@/lib/admin/media-library";
import { cn } from "@/lib/utils";

type TabValue = "all" | MediaType;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaCenterClient() {
  const [items, setItems] = useState<MediaItem[]>(() => getMediaItems());
  const [tab, setTab] = useState<TabValue>("all");
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setItems(getMediaItems());
  }, []);

  const filteredItems = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (tab !== "all" && item.type !== tab) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return item.name.toLowerCase().includes(lowerQuery);
    });
  }, [items, query, tab]);

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
      setError("Files upload failed.");
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

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(["all", "image", "video"] as TabValue[]).map((value) => (
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
                {value === "all" ? <FolderOpen size={16} /> : null}
                {value === "image" ? <ImageIcon size={16} /> : null}
                {value === "video" ? <Film size={16} /> : null}
                {value === "all" ? "All" : value === "image" ? "Images" : "Videos"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search file"
              className="w-56"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
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
              {isUploading ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-500">
            No media found.
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
      </CardContent>
    </Card>
  );
}
