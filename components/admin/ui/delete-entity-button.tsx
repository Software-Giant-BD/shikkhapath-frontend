"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { deletePortfolio } from "@/lib/api/portfolios";
import { deleteProject } from "@/lib/api/projects";
import { deleteService } from "@/lib/api/services";

type EntityType = "portfolio" | "project" | "service";

type DeleteEntityButtonProps = {
  id: number;
  title: string;
  entity: EntityType;
};

const ENTITY_LABELS: Record<EntityType, string> = {
  portfolio: "Portfolio",
  project: "Project",
  service: "Service",
};

const ENTITY_FALLBACK_NAMES: Record<EntityType, string> = {
  portfolio: "this portfolio",
  project: "this project",
  service: "this service",
};

const DELETE_HANDLERS = {
  portfolio: deletePortfolio,
  project: deleteProject,
  service: deleteService,
};

export function DeleteEntityButton({ id, title, entity }: DeleteEntityButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await DELETE_HANDLERS[entity](id);

      if (!result.success) {
        setErrorMessage(result.message ?? `Failed to delete ${entity}.`);
        return;
      }

      setIsConfirmOpen(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 size={14} className="mr-1.5 animate-spin" />
        ) : (
          <Trash2 size={14} className="mr-1.5" />
        )}
        Delete
      </Button>

      <ConfirmDialog
        open={isConfirmOpen}
        title={`Delete ${ENTITY_LABELS[entity]}`}
        description={`This will permanently delete \"${title || ENTITY_FALLBACK_NAMES[entity]}\". This action cannot be undone.`}
        confirmText="Yes, Delete"
        loading={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsConfirmOpen(false);
            setErrorMessage(null);
          }
        }}
        onConfirm={handleDelete}
      />

      {errorMessage && <p className="mt-2 text-xs text-rose-600">{errorMessage}</p>}
    </>
  );
}
