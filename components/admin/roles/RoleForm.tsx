"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { createRoleAction, updateRoleAction } from "@/lib/api/role-actions";

export type RoleFormValues = {
  name: string;
  is_active: "1" | "0";
  description: string;
};

type RoleFormProps = {
  mode: "add" | "edit";
  roleId?: string;
  initialValues?: Partial<RoleFormValues>;
  showDetailsHeader?: boolean;
  headerTitle?: string;
  headerAction?: React.ReactNode;
};

const defaultValues: RoleFormValues = {
  name: "",
  is_active: "1",
  description: "",
};

export function RoleForm({
  mode,
  roleId,
  initialValues,
  showDetailsHeader = true,
  headerTitle,
  headerAction,
}: RoleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<RoleFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitText = mode === "add" ? "Save Role" : "Update Role";
  const shouldShowHeader = Boolean(headerTitle || headerAction || showDetailsHeader);

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
        payload.append("is_active", form.is_active);
        payload.append("description", form.description);

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
        {shouldShowHeader ? (
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              {headerTitle ? (
                <h2 className="text-2xl font-bold text-slate-800">{headerTitle}</h2>
              ) : showDetailsHeader ? (
                <CardTitle>Role Details</CardTitle>
              ) : null}
            </div>

            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </CardHeader>
        ) : null}
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
            <Label htmlFor="is_active">Status</Label>
            <Select
              id="is_active"
              value={form.is_active}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, is_active: event.target.value as RoleFormValues["is_active"] }))
              }
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              placeholder="Write a short description for this role"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
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
