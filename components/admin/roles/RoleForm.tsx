"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { createRoleAction, updateRoleAction } from "@/lib/api/role-actions";

export type RoleFormValues = {
  name: string;
  permission_ids_csv: string;
};

type RoleFormProps = {
  mode: "add" | "edit";
  roleId?: string;
  initialValues?: Partial<RoleFormValues>;
};

const defaultValues: RoleFormValues = {
  name: "",
  permission_ids_csv: "",
};

function normalizeCsvIds(value: string): string {
  const unique = Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

  return unique.join(", ");
}

export function RoleForm({ mode, roleId, initialValues }: RoleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<RoleFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitText = mode === "add" ? "Save Role" : "Update Role";

  const permissionPreview = useMemo(() => {
    return form.permission_ids_csv
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);
  }, [form.permission_ids_csv]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

        if (mode === "edit" && !roleId) {
          setSubmitError("Role ID is missing for update request.");
          return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        const payload = new FormData();
        payload.append("name", form.name);

        form.permission_ids_csv
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((permissionId) => {
            payload.append("permission_ids[]", permissionId);
          });

        try {
          const result =
            mode === "add"
              ? await createRoleAction(payload)
              : await updateRoleAction(roleId as string, payload);

          if (!result.ok) {
            setSubmitError(result.message || "Request failed. Please try again.");
            return;
          }

          router.push("/admin/roles/list");
          router.refresh();
        } catch {
          setSubmitError("Network error. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={form.name}
              placeholder="e.g. Content Manager"
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission_ids">Permission IDs</Label>
            <Textarea
              id="permission_ids"
              rows={3}
              value={form.permission_ids_csv}
              placeholder="e.g. 1, 2, 3"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, permission_ids_csv: event.target.value }))
              }
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  permission_ids_csv: normalizeCsvIds(prev.permission_ids_csv),
                }))
              }
            />
            <p className="text-xs text-slate-500">
              Comma-separated IDs will be submitted as <code>permission_ids[]</code>.
            </p>
            {permissionPreview.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {permissionPreview.map((permissionId) => (
                  <span
                    key={permissionId}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  >
                    #{permissionId}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/roles/list">
          <Button type="button" variant="secondary">
            <ArrowLeft size={16} />
            Back to List
          </Button>
        </Link>

        <Button type="submit" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
}
