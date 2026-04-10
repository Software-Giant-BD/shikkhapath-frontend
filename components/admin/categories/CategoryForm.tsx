"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { createCategoryAction, updateCategoryAction } from "@/lib/api/category-actions";

export type CategoryFormValues = {
  title: string;
  slug: string;
  parent_id: string;
  status: "published" | "draft";
  sort_order: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  show_in_menu: boolean;
  featured: boolean;
};

type CategoryFormInitialValues = Partial<CategoryFormValues> & {
  og_image_url?: string;
};

type CategoryFormProps = {
  mode: "add" | "edit";
  initialValues?: CategoryFormInitialValues;
  categoryId?: string;
  parentOptions?: { id: string; title: string }[];
  showDetailsHeader?: boolean;
  headerTitle?: string;
  headerAction?: React.ReactNode;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const defaultValues: CategoryFormValues = {
  title: "",
  slug: "",
  parent_id: "",
  status: "published",
  sort_order: "0",
  description: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  show_in_menu: true,
  featured: false,
};

export function CategoryForm({
  mode,
  initialValues,
  categoryId,
  parentOptions = [],
  showDetailsHeader = true,
  headerTitle,
  headerAction,
}: CategoryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    mode === "edit" || Boolean(initialValues?.slug),
  );
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState(initialValues?.og_image_url ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitText = mode === "add" ? "Save Category" : "Update Category";
  const shouldShowHeader = Boolean(headerTitle || headerAction || showDetailsHeader);

  const keywordsPreview = useMemo(() => {
    return form.meta_keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }, [form.meta_keywords]);

  useEffect(() => {
    if (!ogImageFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(ogImageFile);
    setOgImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [ogImageFile]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

        if (mode === "edit" && !categoryId) {
          setSubmitError("Category ID is missing for update request.");
          return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        const payload = new FormData();
        payload.append("title", form.title);
        payload.append("slug", form.slug);
        payload.append("parent_id", form.parent_id);
        payload.append("status", form.status);
        payload.append("sort_order", form.sort_order);
        payload.append("description", form.description);
        payload.append("meta_title", form.meta_title);
        payload.append("meta_description", form.meta_description);
        payload.append("meta_keywords", form.meta_keywords);
        payload.append("show_in_menu", form.show_in_menu ? "1" : "0");
        payload.append("featured", form.featured ? "1" : "0");

        if (ogImageFile) {
          payload.append("og_image", ogImageFile);
        }

        try {
          const result =
            mode === "add"
              ? await createCategoryAction(payload)
              : await updateCategoryAction(categoryId as string, payload);

          if (!result.ok) {
            setSubmitError(result.message || "Request failed. Please try again.");
            return;
          }

          router.push("/admin/categories/list");
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
                <CardTitle>Category Details</CardTitle>
              ) : null}
            </div>

            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </CardHeader>
        ) : null}
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                placeholder="e.g. Education"
                onChange={(event) => {
                  const title = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: isSlugManuallyEdited ? prev.slug : slugify(title),
                  }));
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder="e.g. education"
                onChange={(event) => {
                  const nextSlug = slugify(event.target.value);
                  setIsSlugManuallyEdited(Boolean(nextSlug));
                  setForm((prev) => ({ ...prev, slug: nextSlug }));
                }}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select
                id="parent_id"
                value={form.parent_id}
                onChange={(event) => setForm((prev) => ({ ...prev, parent_id: event.target.value }))}
              >
                <option value="">None (Top-level)</option>
                {parentOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as CategoryFormValues["status"] }))
                }
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              placeholder="Short category summary for archive and listing pages."
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={form.meta_title}
              placeholder="SEO title for search results"
              onChange={(event) => setForm((prev) => ({ ...prev, meta_title: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              rows={3}
              maxLength={170}
              value={form.meta_description}
              placeholder="SEO description (recommended up to 160-170 chars)"
              onChange={(event) => setForm((prev) => ({ ...prev, meta_description: event.target.value }))}
            />
            <p className="text-xs text-slate-500">{form.meta_description.length}/170 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
              id="meta_keywords"
              value={form.meta_keywords}
              placeholder="education, university, admission"
              onChange={(event) => setForm((prev) => ({ ...prev, meta_keywords: event.target.value }))}
            />
            {keywordsPreview.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {keywordsPreview.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImageUpload">OG Image Upload</Label>
            <Input
              id="ogImageUpload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setOgImageFile(file);
              }}
            />
            <p className="text-xs text-slate-500">Recommended size: 1200x630 (JPG/PNG/WebP)</p>
            {ogImageFile ? (
              <p className="text-xs text-slate-600">Selected: {ogImageFile.name}</p>
            ) : null}
            {ogImagePreview ? (
              <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                <img src={ogImagePreview} alt="OG image preview" className="h-auto w-full object-cover" />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox
                checked={form.show_in_menu}
                onCheckedChange={(value) => setForm((prev) => ({ ...prev, show_in_menu: Boolean(value) }))}
            />
            Show this category in website menu
          </label>

          <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Homepage category order is managed from <strong>Categories &gt; Home Page Categories</strong>.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {submitError ? <p className="w-full text-sm text-red-600 sm:order-first">{submitError}</p> : null}
        <Link href="/admin/categories/list">
          <Button type="button" variant="secondary" className="w-full sm:w-auto">
            <ArrowLeft size={16} />
            Back to List
          </Button>
        </Link>
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
}
