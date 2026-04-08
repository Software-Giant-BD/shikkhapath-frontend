"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { RichTextEditor } from "@/components/admin/news/RichTextEditor";
import { Select } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";

type NewsFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  author_name: string;
  source_name: string;
  source_url: string;
  feature_image_url: string;
  status: "draft" | "published" | "scheduled";
  publish_at: string;
  tags: string;
  language: string;
  read_time_minutes: string;
  is_featured: "1" | "0";
  is_breaking: "1" | "0";
  allow_comments: "1" | "0";
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
};

type NewsFormProps = {
  headerTitle?: string;
  headerAction?: React.ReactNode;
};

const defaultValues: NewsFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category_id: "",
  author_name: "",
  source_name: "",
  source_url: "",
  feature_image_url: "",
  status: "draft",
  publish_at: "",
  tags: "",
  language: "bn",
  read_time_minutes: "5",
  is_featured: "0",
  is_breaking: "0",
  allow_comments: "1",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function NewsForm({ headerTitle, headerAction }: NewsFormProps) {
  const [form, setForm] = useState<NewsFormValues>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const tagPreview = useMemo(() => {
    return form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 10);
  }, [form.tags]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmitMessage("");

        // Keeping this as a UI-ready form until News API endpoints are wired.
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsSubmitting(false);
        setSubmitMessage("News draft is ready. Connect API to persist this payload.");
      }}
    >
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {headerTitle ? (
              <h2 className="text-2xl font-bold text-slate-800">{headerTitle}</h2>
            ) : (
              <CardTitle>Headline & Story</CardTitle>
            )}
          </div>

          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              placeholder="Write a compelling headline"
              onChange={(event) => {
                const title = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: slugEdited ? prev.slug : slugify(title),
                }));
              }}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder="headline-url-slug"
                onChange={(event) => {
                  setSlugEdited(true);
                  setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }));
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category ID</Label>
              <Input
                id="category_id"
                value={form.category_id}
                placeholder="e.g. 3"
                onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Summary</Label>
            <Textarea
              id="excerpt"
              rows={3}
              maxLength={250}
              value={form.excerpt}
              placeholder="2-3 line summary for cards and social preview"
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            />
            <p className="text-xs text-slate-500">{form.excerpt.length}/250 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">News Content</Label>
            <RichTextEditor
              value={form.content}
              placeholder="Write the full story body in paragraph format"
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feature_image_url">Feature Image URL</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  id="feature_image_url"
                  type="url"
                  value={form.feature_image_url}
                  placeholder="https://..."
                  onChange={(event) => setForm((prev) => ({ ...prev, feature_image_url: event.target.value }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  Select from Media Center
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                id="language"
                value={form.language}
                onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
              >
                <option value="bn">Bangla</option>
                <option value="en">English</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source_name">Source Name</Label>
              <Input
                id="source_name"
                value={form.source_name}
                placeholder="e.g. Reuters"
                onChange={(event) => setForm((prev) => ({ ...prev, source_name: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_url">Source URL</Label>
              <Input
                id="source_url"
                type="url"
                value={form.source_url}
                placeholder="https://..."
                onChange={(event) => setForm((prev) => ({ ...prev, source_url: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author_name">Reporter / Author</Label>
            <Input
              id="author_name"
              value={form.author_name}
              placeholder="Reporter name"
              onChange={(event) => setForm((prev) => ({ ...prev, author_name: event.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as NewsFormValues["status"] }))}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publish_at">Publish At</Label>
              <Input
                id="publish_at"
                type="datetime-local"
                value={form.publish_at}
                onChange={(event) => setForm((prev) => ({ ...prev, publish_at: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time_minutes">Read Time (minutes)</Label>
              <Input
                id="read_time_minutes"
                type="number"
                min={1}
                value={form.read_time_minutes}
                onChange={(event) => setForm((prev) => ({ ...prev, read_time_minutes: event.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="is_featured">Featured Story</Label>
              <Select
                id="is_featured"
                value={form.is_featured}
                onChange={(event) => setForm((prev) => ({ ...prev, is_featured: event.target.value as "1" | "0" }))}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_breaking">Breaking News</Label>
              <Select
                id="is_breaking"
                value={form.is_breaking}
                onChange={(event) => setForm((prev) => ({ ...prev, is_breaking: event.target.value as "1" | "0" }))}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allow_comments">Allow Comments</Label>
              <Select
                id="allow_comments"
                value={form.allow_comments}
                onChange={(event) => setForm((prev) => ({ ...prev, allow_comments: event.target.value as "1" | "0" }))}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={form.tags}
              placeholder="education, exam, dhaka"
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            />
            {tagPreview.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {tagPreview.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={form.meta_title}
              placeholder="SEO title for search engines"
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
              placeholder="SEO description (up to 160-170 chars)"
              onChange={(event) => setForm((prev) => ({ ...prev, meta_description: event.target.value }))}
            />
            <p className="text-xs text-slate-500">{form.meta_description.length}/170 characters</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={form.meta_keywords}
                placeholder="keyword one, keyword two"
                onChange={(event) => setForm((prev) => ({ ...prev, meta_keywords: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input
                id="canonical_url"
                type="url"
                value={form.canonical_url}
                placeholder="https://example.com/news/..."
                onChange={(event) => setForm((prev) => ({ ...prev, canonical_url: event.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {submitMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {submitMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/news/list">
          <Button type="button" variant="secondary">
            <ArrowLeft size={16} />
            Back to List
          </Button>
        </Link>

        <Button type="submit" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? "Saving..." : "Save News"}
        </Button>
      </div>

      <MediaPickerDialog
        isOpen={isMediaPickerOpen}
        mediaType="image"
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(item) => {
          setForm((prev) => ({ ...prev, feature_image_url: item.url }));
          setIsMediaPickerOpen(false);
        }}
      />
    </form>
  );
}
