"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/ui/button";
import { updateContactMessageStatus } from "@/lib/api/contact-messages";

type StatusUpdateControlProps = {
  contactMessageId: number;
  initialStatus: string;
  options: string[];
};

export function StatusUpdateControl({
  contactMessageId,
  initialStatus,
  options,
}: StatusUpdateControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const normalizedOptions = Array.from(
    new Set([initialStatus, ...options].map((item) => item.trim()).filter(Boolean)),
  );

  const hasChanged = status.trim() !== initialStatus.trim();

  const handleUpdate = () => {
    if (!status.trim()) {
      setFeedback("Status is required.");
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result = await updateContactMessageStatus(contactMessageId, status);

      if (!result.success) {
        setFeedback(result.message ?? "Failed to update status.");
        return;
      }

      setFeedback(result.message ?? "Updated.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isPending}
          className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          {normalizedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!hasChanged || isPending}
          onClick={handleUpdate}
        >
          {isPending ? "Updating..." : "Update"}
        </Button>
      </div>
      {feedback && <p className="text-xs text-slate-500">{feedback}</p>}
    </div>
  );
}
