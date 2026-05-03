"use client";

import type { ChangeEvent } from "react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Save, X } from "lucide-react";

import { useRouter } from "next/navigation";

import { getMediaItems, saveMediaItems } from "@/lib/admin/media-library";
import { getCategoriesByParentAction } from "@/lib/api/category-actions";
import { getDistrictsAction, getDivisionsAction, getUpazilasAction } from "@/lib/api/location-actions";
import { createNewsAction, updateNewsAction } from "@/lib/api/news-actions";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { RichTextEditor } from "@/components/admin/news/RichTextEditor";
import { Select } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { uploadImageAction } from "@/lib/api/image-actions";

type NewsFormValues = {
  title: string;
  unique_code: string;
  excerpt: string;
  content: string;
  category_id: string;
  sub_category_id: string;
  author_name: string;
  source_name: string;
  source_url: string;
  type: "standard" | "video";
  youtube_video_url: string;
  institution_type: string;
  institution_name: string;
  location: string;
  division_id: string;
  district_id: string;
  upazila_id: string;
  feature_image_id: string;
  feature_image_url: string;
  status: "draft" | "published" | "scheduled";
  publish_at: string;
  tags: string[];
  language: string;
  read_time_minutes: string;
  is_featured: "1" | "0";
  show_in_home_left: "1" | "0";
  is_breaking: "1" | "0";
  allow_comments: "1" | "0";
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
};

export type NewsFormInitialValues = Partial<NewsFormValues>;

type NewsFormProps = {
  categoryOptions?: { id: string; title: string; parent_id?: string | null }[];
  headerTitle?: string;
  headerAction?: React.ReactNode;
  mode?: "create" | "edit";
  newsId?: string;
  initialValues?: NewsFormInitialValues;
};

const defaultValues: NewsFormValues = {
  title: "",
  unique_code: "",
  excerpt: "",
  content: "",
  category_id: "",
  sub_category_id: "",
  author_name: "",
  source_name: "",
  source_url: "",
  type: "standard",
  youtube_video_url: "",
  institution_type: "",
  institution_name: "",
  location: "",
  division_id: "",
  district_id: "",
  upazila_id: "",
  feature_image_id: "",
  feature_image_url: "",
  status: "draft",
  publish_at: "",
  tags: [],
  language: "bn",
  read_time_minutes: "5",
  is_featured: "0",
  show_in_home_left: "0",
  is_breaking: "0",
  allow_comments: "1",
  meta_title: "",
  meta_description: "",
  meta_keywords: [],
};

function uniqueCodeify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  const normalized = value.replace(" ", "T");
  return normalized.length >= 16 ? normalized.slice(0, 16) : normalized;
}

function buildInitialFormValues(
  initialValues?: NewsFormInitialValues,
): NewsFormValues {
  if (!initialValues) return defaultValues;

  return {
    ...defaultValues,
    ...initialValues,
    tags: Array.isArray(initialValues.tags)
      ? initialValues.tags
      : ((initialValues.tags as unknown as string) ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    meta_keywords: Array.isArray(initialValues.meta_keywords)
      ? initialValues.meta_keywords
      : ((initialValues.meta_keywords as unknown as string) ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    publish_at: toDateTimeLocal(initialValues.publish_at ?? ""),
  };
}

export function NewsForm({
  categoryOptions = [],
  headerTitle,
  headerAction,
  mode = "create",
  newsId,
  initialValues,
}: NewsFormProps) {
  const [form, setForm] = useState<NewsFormValues>(() =>
    buildInitialFormValues(initialValues),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [featureImageError, setFeatureImageError] = useState("");
  const [subCategoryOptions, setSubCategoryOptions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(false);
  const [isUploadingFeatureImage, setIsUploadingFeatureImage] = useState(false);
  const [uniqueCodeEdited, setUniqueCodeEdited] = useState(Boolean(initialValues?.unique_code));
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [divisionOptions, setDivisionOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [districtOptions, setDistrictOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [upazilaOptions, setUpazilaOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isDivisionLoading, setIsDivisionLoading] = useState(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [isUpazilaLoading, setIsUpazilaLoading] = useState(false);
  const featureImageInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const isEditMode = mode === "edit" && Boolean(newsId);

  const parentCategories = useMemo(
    () => categoryOptions.filter((c) => !c.parent_id),
    [categoryOptions],
  );

  useEffect(() => {
    setForm(buildInitialFormValues(initialValues));
    setUniqueCodeEdited(Boolean(initialValues?.unique_code));
  }, [initialValues]);

  useEffect(() => {
    let active = true;

    async function loadSubCategories() {
      if (!form.category_id) {
        setSubCategoryOptions([]);
        setIsSubCategoryLoading(false);
        return;
      }

      setIsSubCategoryLoading(true);
      const result = await getCategoriesByParentAction(form.category_id);

      if (!active) return;

      if (!result.ok) {
        setSubCategoryOptions([]);
        setSubmitError(result.message);
        setIsSubCategoryLoading(false);
        return;
      }

      setSubCategoryOptions(
        result.items.map((item) => ({ id: item.id, title: item.title })),
      );
      setIsSubCategoryLoading(false);
    }

    void loadSubCategories();

    return () => {
      active = false;
    };
  }, [form.category_id]);

  useEffect(() => {
    async function loadDivisions() {
      setIsDivisionLoading(true);
      const result = await getDivisionsAction();
      if (result.ok) {
        setDivisionOptions(result.items);
      }
      setIsDivisionLoading(false);
    }
    void loadDivisions();
  }, []);

  useEffect(() => {
    async function loadDistricts() {
      if (!form.division_id) {
        setDistrictOptions([]);
        return;
      }
      setIsDistrictLoading(true);
      const result = await getDistrictsAction(form.division_id);
      if (result.ok) {
        setDistrictOptions(result.items);
      }
      setIsDistrictLoading(false);
    }
    void loadDistricts();
  }, [form.division_id]);

  useEffect(() => {
    async function loadUpazilas() {
      if (!form.district_id) {
        setUpazilaOptions([]);
        return;
      }
      setIsUpazilaLoading(true);
      const result = await getUpazilasAction(form.district_id);
      if (result.ok) {
        setUpazilaOptions(result.items);
      }
      setIsUpazilaLoading(false);
    }
    void loadUpazilas();
  }, [form.district_id]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().replace(/,/g, "");
    if (!trimmed) return;

    if (form.tags.includes(trimmed)) {
      setTagInput("");
      return;
    }

    setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const onTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && form.tags.length > 0) {
      removeTag(form.tags[form.tags.length - 1]);
    }
  };

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().replace(/,/g, "");
    if (!trimmed) return;

    if (form.meta_keywords.includes(trimmed)) {
      setKeywordInput("");
      return;
    }

    setForm((prev) => ({ ...prev, meta_keywords: [...prev.meta_keywords, trimmed] }));
    setKeywordInput("");
  };

  const removeKeyword = (keywordToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter((k) => k !== keywordToRemove),
    }));
  };

  const onKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(keywordInput);
    } else if (e.key === "Backspace" && !keywordInput && form.meta_keywords.length > 0) {
      removeKeyword(form.meta_keywords[form.meta_keywords.length - 1]);
    }
  };

  const onUploadFeatureImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) {
      return;
    }

    setIsUploadingFeatureImage(true);
    setFeatureImageError("");

    try {
      const payload = new FormData();
      payload.append("file", selectedFile);
      payload.append("folder_id", "");

      const result = await uploadImageAction(payload);
      if (!result.ok || !result.item?.url) {
        setFeatureImageError(
          result.message || "Failed to upload feature image.",
        );
        return;
      }

      const nextItem = {
        ...result.item,
        type: "image" as const,
      };

      const existingItems = getMediaItems();
      const nextItems = [
        nextItem,
        ...existingItems.filter((item) => item.id !== nextItem.id),
      ];

      saveMediaItems(nextItems);
      setForm((prev) => ({
        ...prev,
        feature_image_url: result.item?.url || "",
        feature_image_id: result.item?.id?.toString() || "",
      }));
    } catch {
      setFeatureImageError("Failed to upload feature image.");
    } finally {
      setIsUploadingFeatureImage(false);
      if (featureImageInputRef.current) {
        featureImageInputRef.current.value = "";
      }
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmitMessage("");
        setSubmitError("");
        setFieldErrors({});

        const payload = {
          title: form.title,
          unique_code: form.unique_code || undefined,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
          category_id: form.category_id || undefined,
          sub_category_id: form.sub_category_id || undefined,
          author_name: form.author_name || undefined,
          source_name: form.source_name || undefined,
          source_url: form.source_url || undefined,
          type: form.type,
          youtube_video_url:
            form.type === "video" ? form.youtube_video_url : undefined,
          division_id: form.division_id || undefined,
          district_id: form.district_id || undefined,
          upazila_id: form.upazila_id || undefined,
         
          feature_image_id:
            (form.type === "standard" ) &&
            form.feature_image_id
              ? parseInt(form.feature_image_id, 10)
              : undefined,
          status: form.status,
          publish_at: form.publish_at || undefined,
          tags: form.tags,
          language: form.language || undefined,
          read_time_minutes: form.read_time_minutes
            ? parseInt(form.read_time_minutes, 10)
            : undefined,
          is_featured:
            form.type === "standard" ? form.is_featured === "1" : false,
          show_in_home_left:
            form.type === "standard" ? form.show_in_home_left === "1" : false,
          is_breaking:
            form.type === "standard" ? form.is_breaking === "1" : false,
          allow_comments: form.allow_comments === "1",
          meta_title: form.meta_title || undefined,
          meta_description: form.meta_description || undefined,
          meta_keywords: form.meta_keywords.length > 0 ? form.meta_keywords.join(", ") : undefined,
        };

        const result =
          isEditMode && newsId
            ? await updateNewsAction(newsId, payload)
            : await createNewsAction(payload);

        setIsSubmitting(false);

        if (!result.ok) {
          if (result.fieldErrors) setFieldErrors(result.fieldErrors);
          setSubmitError(result.message);
          return;
        }

        setSubmitMessage(result.message);
        router.push("/admin/news/list");
      }}
    >
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {headerTitle ? (
              <h2 className="text-2xl font-bold text-slate-800">
                {headerTitle}
              </h2>
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
                  unique_code: uniqueCodeEdited ? prev.unique_code : uniqueCodeify(title),
                }));
              }}
              required
            />
            {fieldErrors.title ? (
              <p className="text-xs font-medium text-rose-600">
                {fieldErrors.title[0]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unique_code">Unique Code</Label>
              <Input
                id="unique_code"
                value={form.unique_code}
                placeholder="headline-url-unique_code"
                onChange={(event) => {
                  setUniqueCodeEdited(true);
                  setForm((prev) => ({
                    ...prev,
                    unique_code: uniqueCodeify(event.target.value),
                  }));
                }}
                required
              />
              {fieldErrors.unique_code ? (
                <p className="text-xs font-medium text-rose-600">
                  {fieldErrors.unique_code[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <SearchableSelect
                options={[
                  { id: "", name: "Select Category" },
                  ...parentCategories.map((c) => ({ id: c.id, name: c.title })),
                ]}
                value={form.category_id}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    category_id: val,
                    sub_category_id: "",
                  }))
                }
                placeholder="Select Category"
                searchPlaceholder="Search categories..."
              />
              {fieldErrors.category_id ? (
                <p className="text-xs font-medium text-rose-600">
                  {fieldErrors.category_id[0]}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub_category_id">Sub-category</Label>
            <SearchableSelect
              options={[
                {
                  id: "",
                  name: isSubCategoryLoading
                    ? "Loading..."
                    : form.category_id
                      ? "Select Sub-category"
                      : "Select Category first",
                },
                ...subCategoryOptions.map((sc) => ({ id: sc.id, name: sc.title })),
              ]}
              value={form.sub_category_id}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, sub_category_id: val }))
              }
              placeholder={isSubCategoryLoading ? "Loading..." : "Select Sub-category"}
              searchPlaceholder="Search sub-categories..."
              disabled={!form.category_id || isSubCategoryLoading}
            />
            {fieldErrors.sub_category_id ? (
              <p className="text-xs font-medium text-rose-600">
                {fieldErrors.sub_category_id[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Summary</Label>
            <Textarea
              id="excerpt"
              rows={3}
              maxLength={250}
              value={form.excerpt}
              placeholder="2-3 line summary for cards and social preview"
              onChange={(event) =>
                setForm((prev) => ({ ...prev, excerpt: event.target.value }))
              }
            />
            <p className="text-xs text-slate-500">
              {form.excerpt.length}/250 characters
            </p>
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
        <CardContent className="space-y-5 rounded-b-xl bg-slate-50/50">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="news_type">News Type</Label>
                  <Select
                    id="news_type"
                    value={form.type}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        type: event.target.value as "standard" | "video",
                      }))
                    }
                  >
                    <option value="standard">Standard Article</option>
                    <option value="video">Video News</option>
                  </Select>
                </div>

                <div className="h-px w-full bg-slate-100 my-4" />

                {(form.type === "standard" ) && (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-800">
                        Feature Media
                      </h3>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      {form.feature_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.feature_image_url}
                          alt="Selected feature"
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-100 via-slate-50 to-slate-100 text-slate-500">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                            <ImageIcon size={18} />
                          </span>
                          <p className="text-sm font-medium">
                            No feature image selected
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/35 bg-white/88 p-2 backdrop-blur-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            ref={featureImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              void onUploadFeatureImage(event);
                            }}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-9"
                            onClick={() =>
                              featureImageInputRef.current?.click()
                            }
                            disabled={isUploadingFeatureImage}
                          >
                            {isUploadingFeatureImage
                              ? "Uploading..."
                              : "Upload"}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-9"
                            onClick={() => setIsMediaPickerOpen(true)}
                          >
                            Media Center
                          </Button>
                          {form.feature_image_url ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className="h-9 text-rose-600 hover:text-rose-700"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  feature_image_url: "",
                                  feature_image_id: "",
                                }))
                              }
                            >
                              Remove
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {featureImageError ? (
                      <p className="text-xs font-medium text-rose-600">
                        {featureImageError}
                      </p>
                    ) : null}
                  </>
                )}

              

                {form.type === "video" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-800">
                        YouTube Video URL
                      </h3>
                    </div>
                    <Input
                      id="youtube_video_url"
                      type="url"
                      value={form.youtube_video_url}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          youtube_video_url: event.target.value,
                        }))
                      }
                    />
                    {fieldErrors.youtube_video_url ? (
                      <p className="text-xs font-medium text-rose-600">
                        {fieldErrors.youtube_video_url[0]}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="source_name"
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Source Name
                  </Label>
                  <Input
                    id="source_name"
                    value={form.source_name}
                    placeholder="e.g. Shikkhapath Daily"
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        source_name: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="source_url"
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    Source URL
                  </Label>
                  <Input
                    id="source_url"
                    type="url"
                    value={form.source_url}
                    placeholder="https://example.com/source"
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        source_url: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Language Settings
                    </p>
                    <Select
                      id="language"
                      value={form.language}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          language: event.target.value,
                        }))
                      }
                    >
                      <option value="bn">Bangla</option>
                      <option value="en">English</option>
                    </Select>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Reporter / Author
                    </p>
                    <Input
                      id="author_name"
                      value={form.author_name}
                      placeholder="Reporter name"
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          author_name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Read Time (minutes)
                    </p>
                    <Input
                      id="read_time_minutes"
                      type="number"
                      min={1}
                      value={form.read_time_minutes}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          read_time_minutes: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="division_id">Division</Label>
              <SearchableSelect
                options={[
                  { id: "", name: isDivisionLoading ? "Loading..." : "Select Division" },
                  ...divisionOptions,
                ]}
                value={form.division_id}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    division_id: val,
                    district_id: "",
                    upazila_id: "",
                  }))
                }
                placeholder={isDivisionLoading ? "Loading..." : "Select Division"}
                searchPlaceholder="Search division..."
                disabled={isDivisionLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district_id">District</Label>
              <SearchableSelect
                options={[
                  {
                    id: "",
                    name: isDistrictLoading
                      ? "Loading..."
                      : form.division_id
                        ? "Select District"
                        : "Select Division first",
                  },
                  ...districtOptions,
                ]}
                value={form.district_id}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    district_id: val,
                    upazila_id: "",
                  }))
                }
                placeholder={isDistrictLoading ? "Loading..." : "Select District"}
                searchPlaceholder="Search district..."
                disabled={!form.division_id || isDistrictLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upazila_id">Upazila / Area</Label>
              <SearchableSelect
                options={[
                  {
                    id: "",
                    name: isUpazilaLoading
                      ? "Loading..."
                      : form.district_id
                        ? "Select Upazila"
                        : "Select District first",
                  },
                  ...upazilaOptions,
                ]}
                value={form.upazila_id}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, upazila_id: val }))
                }
                placeholder={isUpazilaLoading ? "Loading..." : "Select Upazila"}
                searchPlaceholder="Search upazila..."
                disabled={!form.district_id || isUpazilaLoading}
              />
            </div>
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
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as NewsFormValues["status"],
                  }))
                }
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
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    publish_at: event.target.value,
                  }))
                }
                required
              />
              {fieldErrors.publish_at ? (
                <p className="text-xs font-medium text-rose-600">
                  {fieldErrors.publish_at[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allow_comments">Allow Comments</Label>
              <Select
                id="allow_comments"
                value={form.allow_comments}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    allow_comments: event.target.value as "1" | "0",
                  }))
                }
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
            </div>
          </div>

          {form.type === "standard" && (
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="is_featured">Featured Story</Label>
                <Select
                  id="is_featured"
                  value={form.is_featured}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      is_featured: event.target.value as "1" | "0",
                    }))
                  }
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="show_in_home_left">Show in Home Left</Label>
                <Select
                  id="show_in_home_left"
                  value={form.show_in_home_left}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      show_in_home_left: event.target.value as "1" | "0",
                    }))
                  }
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
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      is_breaking: event.target.value as "1" | "0",
                    }))
                  }
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-2 focus-within:ring-2 focus-within:ring-indigo-500/20">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 bg-transparent text-sm outline-hidden placeholder:text-slate-400"
                placeholder={form.tags.length === 0 ? "Add tags..." : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagInputKeyDown}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Press Enter or comma to add tags
            </p>
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
              onChange={(event) =>
                setForm((prev) => ({ ...prev, meta_title: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              rows={3}
              maxLength={170}
              value={form.meta_description}
              placeholder="SEO description (Standard: 120-130 chars)"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  meta_description: event.target.value,
                }))
              }
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <p>{form.meta_description.length}/170 characters</p>
              <p>Standard: 120-130 characters</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-2 focus-within:ring-2 focus-within:ring-indigo-500/20">
                {form.meta_keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-emerald-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  id="meta_keywords"
                  className="flex-1 bg-transparent text-sm outline-hidden placeholder:text-slate-400"
                  placeholder={form.meta_keywords.length === 0 ? "Add keywords..." : ""}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={onKeywordInputKeyDown}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Press Enter or comma to add keywords
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {submitMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {submitMessage}
        </p>
      ) : null}

      {submitError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {submitError}
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
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update News"
              : "Save News"}
        </Button>
      </div>

      <MediaPickerDialog
        isOpen={isMediaPickerOpen}
        mediaType="image"
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(item) => {
          console.log("before item");
          console.log(item);
          setFeatureImageError("");
          setForm((prev) => ({
            ...prev,
            feature_image_url: item.url,
            feature_image_id: item.id.toString(),
          }));
          setIsMediaPickerOpen(false);
        }}
      />
    </form>
  );
}
