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
import { createUserAction, updateUserAction } from "@/lib/api/user-actions";

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role_id: string;
  is_active: "1" | "0";
  can_manage_news: "1" | "0";
};

type UserFormProps = {
  mode: "add" | "edit";
  userId?: string;
  initialValues?: Partial<UserFormValues>;
  roleOptions: { id: string; name: string }[];
  showDetailsHeader?: boolean;
  headerTitle?: string;
  headerAction?: React.ReactNode;
};

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role_id: "",
  is_active: "1",
  can_manage_news: "0",
};

export function UserForm({
  mode,
  userId,
  initialValues,
  roleOptions,
  showDetailsHeader = true,
  headerTitle,
  headerAction,
}: UserFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<UserFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitText = mode === "add" ? "Save User" : "Update User";
  const shouldShowHeader = Boolean(headerTitle || headerAction || showDetailsHeader);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

        if (mode === "edit" && !userId) {
          setSubmitError("User ID is missing for update request.");
          return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        const payload = new FormData();
        payload.append("name", form.name);
        payload.append("email", form.email);
        payload.append("phone", form.phone);
        payload.append("role_id", form.role_id);
        payload.append("is_active", form.is_active);
        payload.append("can_manage_news", form.can_manage_news);

        if (mode === "add" || form.password.trim()) {
          payload.append("password", form.password);
        }

        try {
          const result =
            mode === "add"
              ? await createUserAction(payload)
              : await updateUserAction(userId as string, payload);

          if (!result.ok) {
            setSubmitError(result.message || "Request failed. Please try again.");
            return;
          }

          router.push("/admin/users/list");
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
                <CardTitle>User Details</CardTitle>
              ) : null}
            </div>

            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </CardHeader>
        ) : null}
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                placeholder={mode === "edit" ? "Keep blank to leave unchanged" : "Enter password"}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required={mode === "add"}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="role_id">Role</Label>
              <Select
                id="role_id"
                value={form.role_id}
                required
                onChange={(event) => setForm((prev) => ({ ...prev, role_id: event.target.value }))}
              >
                <option value="">Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <Select
                id="is_active"
                value={form.is_active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_active: event.target.value as UserFormValues["is_active"] }))
                }
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="can_manage_news">Can Manage News</Label>
              <Select
                id="can_manage_news"
                value={form.can_manage_news}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    can_manage_news: event.target.value as UserFormValues["can_manage_news"],
                  }))
                }
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/users/list">
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
