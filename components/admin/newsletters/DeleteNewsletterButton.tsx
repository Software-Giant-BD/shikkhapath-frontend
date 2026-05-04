"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { deleteNewsletterAction } from "@/lib/api/newsletter-admin-actions";

type DeleteNewsletterButtonProps = {
  id: string;
};

export function DeleteNewsletterButton({ id }: DeleteNewsletterButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteNewsletterAction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
      Delete
    </Button>
  );
}
