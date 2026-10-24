"use client";

import { useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { AiNewsCreator } from "./AiNewsCreator";
import { type GeneratedNewsResult } from "@/lib/api/admin/auto-news-actions";

type Props = {
  open: boolean;
  onClose: () => void;
  categories?: Array<{ id: number; title: string; slug?: string }>;
  onSuccess?: (news: GeneratedNewsResult) => void;
};

export function AiNewsCreatorModal({
  open,
  onClose,
  categories = [],
  onSuccess,
}: Props) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl my-auto z-10">
        <div className="relative">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 shadow-md transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          <AiNewsCreator
            categories={categories}
            onSuccess={(news) => {
              onSuccess?.(news);
            }}
          />
        </div>
      </div>
    </div>
  );
}
