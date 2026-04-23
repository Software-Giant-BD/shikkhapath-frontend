"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/admin/ui/button";
import { deleteAdvertisementAction } from "@/lib/api/advertisement-actions";

export function DeleteAdvertisementButton({ id }: { id: number | string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;

    setLoading(true);
    const result = await deleteAdvertisementAction(id);
    setLoading(false);

    if (result.ok) {
      window.alert(result.message);
      router.refresh();
    } else {
      window.alert(result.message);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 size={14} />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
