"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  Link as LinkIcon,
  FileText,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Pencil,
  RefreshCw,
  X,
  Image as ImageIcon,
  ArrowRight,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  generateNewsFromUrlAction,
  generateNewsFromContentAction,
  type GeneratedNewsResult,
} from "@/lib/api/admin/auto-news-actions";

type Mode = "url" | "content";

type Props = {
  categories?: Array<{ id: number; title: string; slug?: string }>;
  defaultStatus?: "published" | "draft";
  onSuccess?: (news: GeneratedNewsResult) => void;
};

export function AiNewsCreator({
  categories = [],
  defaultStatus = "published",
  onSuccess,
}: Props) {
  const [mode, setMode] = useState<Mode>("url");
  const [isPending, startTransition] = useTransition();
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [resultNews, setResultNews] = useState<GeneratedNewsResult | null>(null);

  // Mode 1: URL fields
  const [url, setUrl] = useState("");
  const [urlCategory, setUrlCategory] = useState("");
  const [urlStatus, setUrlStatus] = useState<"published" | "draft">(defaultStatus);
  const [urlGenerateImage, setUrlGenerateImage] = useState(true);
  const [urlCustomImageFile, setUrlCustomImageFile] = useState<File | null>(null);
  const [urlCustomImagePreview, setUrlCustomImagePreview] = useState<string | null>(null);
  const urlFileInputRef = useRef<HTMLInputElement>(null);

  // Mode 2: Content fields
  const [contentTitle, setContentTitle] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [contentCategory, setContentCategory] = useState("");
  const [contentStatus, setContentStatus] = useState<"published" | "draft">(defaultStatus);
  const [contentGenerateImage, setContentGenerateImage] = useState(true);
  const [contentImageUrl, setContentImageUrl] = useState("");
  const [contentImageFile, setContentImageFile] = useState<File | null>(null);
  const [contentImagePreview, setContentImagePreview] = useState<string | null>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);

  // Reset form
  const handleReset = () => {
    setResultNews(null);
    setUrl("");
    setUrlCustomImageFile(null);
    setUrlCustomImagePreview(null);
    setContentTitle("");
    setRawContent("");
    setContentImageUrl("");
    setContentImageFile(null);
    setContentImagePreview(null);
    setLoadingStep("");
  };

  // Image handlers for URL custom image
  const handleUrlImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে");
        return;
      }
      setUrlCustomImageFile(file);
      setUrlCustomImagePreview(URL.createObjectURL(file));
    }
  };

  const removeUrlCustomImage = () => {
    setUrlCustomImageFile(null);
    setUrlCustomImagePreview(null);
    if (urlFileInputRef.current) urlFileInputRef.current.value = "";
  };

  // Image handlers for Content mode
  const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে");
        return;
      }
      setContentImageFile(file);
      setContentImagePreview(URL.createObjectURL(file));
      setContentImageUrl("");
    }
  };

  const removeContentImage = () => {
    setContentImageFile(null);
    setContentImagePreview(null);
    if (contentFileInputRef.current) contentFileInputRef.current.value = "";
  };

  // Submit URL form
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("অনুগ্রহ করে একটি বৈধ লিঙ্ক প্রবেশ করান");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      toast.error("লিঙ্কটি সঠিক ফরম্যাটে নেই");
      return;
    }

    const formData = new FormData();
    formData.append("url", trimmed);
    if (urlCategory) formData.append("category_id", urlCategory);
    formData.append("status", urlStatus);
    formData.append("generate_image", urlGenerateImage ? "1" : "0");
    if (urlCustomImageFile) {
      formData.append("image", urlCustomImageFile);
    }

    setLoadingStep("প্রসেসিং হচ্ছে...");

    startTransition(async () => {
      try {
        const res = await generateNewsFromUrlAction(formData);
        if (res.success && res.news) {
          setResultNews(res.news);
          toast.success(res.message);
          onSuccess?.(res.news);
        } else {
          toast.error(res.message || "সংবাদ তৈরিতে সমস্যা হয়েছে");
        }
      } catch (err: any) {
        toast.error(err?.message || "সার্ভার সংযোগে সমস্যা হয়েছে");
      } finally {
        setLoadingStep("");
      }
    });
  };

  // Submit Content form
  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = rawContent.trim();
    if (trimmed.length < 30) {
      toast.error("কনটেন্ট কমপক্ষে ৩০ অক্ষর হতে হবে");
      return;
    }

    const formData = new FormData();
    formData.append("content", trimmed);
    if (contentTitle.trim()) formData.append("title", contentTitle.trim());
    if (contentCategory) formData.append("category_id", contentCategory);
    formData.append("status", contentStatus);
    formData.append("generate_image", contentGenerateImage ? "1" : "0");
    if (contentImageFile) {
      formData.append("image", contentImageFile);
    } else if (contentImageUrl.trim()) {
      formData.append("image_url", contentImageUrl.trim());
    }

    setLoadingStep("প্রসেসিং হচ্ছে...");

    startTransition(async () => {
      try {
        const res = await generateNewsFromContentAction(formData);
        if (res.success && res.news) {
          setResultNews(res.news);
          toast.success(res.message);
          onSuccess?.(res.news);
        } else {
          toast.error(res.message || "সংবাদ তৈরিতে সমস্যা হয়েছে");
        }
      } catch (err: any) {
        toast.error(err?.message || "সার্ভার সংযোগে সমস্যা হয়েছে");
      } finally {
        setLoadingStep("");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              AI News Creator
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          {!resultNews && (
            <div className="flex items-center bg-slate-200/70 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode("url")}
                disabled={isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mode === "url"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                নিউজ লিঙ্ক থেকে
              </button>
              <button
                type="button"
                onClick={() => setMode("content")}
                disabled={isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mode === "content"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                কনটেন্ট / প্রেস রিলিজ থেকে
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5">
        {/* SUCCESS CARD */}
        {resultNews ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-900 text-sm sm:text-base">
                    সংবাদ সফলভাবে প্রকাশিত হয়েছে!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    পোস্ট আইডি: #{resultNews.id} &bull; স্ট্যাটাস:{" "}
                    <span className="font-medium capitalize">{resultNews.status}</span>
                    {resultNews.category && (
                      <> &bull; ক্যাটাগরি: <span className="font-medium">{resultNews.category.title}</span></>
                    )}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="bg-white hover:bg-slate-50 text-slate-700 border-emerald-200"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                আরেকটি পোস্ট করুন
              </Button>
            </div>

            {/* Generated News Card Preview */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col md:flex-row gap-4 shadow-2xs">
              {resultNews.feature_image_url && (
                <div className="md:w-52 h-32 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={resultNews.feature_image_url}
                    alt={resultNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {resultNews.category && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {resultNews.category.title}
                      </span>
                    )}
                    {resultNews.source_name && (
                      <span className="text-[11px] text-slate-500">
                        সূত্র: {resultNews.source_name}
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                    {resultNews.title}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {resultNews.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Link
                    href={`/${resultNews.category?.slug || "news"}/${resultNews.unique_code}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    খবরটি দেখুন
                  </Link>

                  <Link
                    href={`/admin/news/${resultNews.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    অ্যাডমিন এডিট
                  </Link>

                  <Link
                    href="/admin/news/list"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 ml-auto"
                  >
                    নিউজ লিস্ট দেখুন &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : mode === "url" ? (
          /* FORM 1: NEWS LINK (URL) */
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                নিউজ আর্টিকেলের লিঙ্ক (News Link / URL) *
              </Label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isPending}
                  required
                  className="pr-20 text-xs sm:text-sm h-10 border-slate-300 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) setUrl(text.trim());
                    } catch {}
                  }}
                  className="absolute right-2 top-2 text-[11px] px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium"
                >
                  Paste
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                  ক্যাটাগরি
                </Label>
                <select
                  value={urlCategory}
                  onChange={(e) => setUrlCategory(e.target.value)}
                  disabled={isPending}
                  className="w-full text-xs sm:text-sm h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">স্বয়ংক্রিয় (AI)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <Label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                  পোস্ট স্ট্যাটাস
                </Label>
                <select
                  value={urlStatus}
                  onChange={(e) => setUrlStatus(e.target.value as any)}
                  disabled={isPending}
                  className="w-full text-xs sm:text-sm h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Image Options */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  ফিচার ইমেজ
                </Label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urlGenerateImage}
                    onChange={(e) => setUrlGenerateImage(e.target.checked)}
                    disabled={isPending}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>মূল ছবি না থাকলে AI ইমেজ তৈরি করবে</span>
                </label>
              </div>

              {urlCustomImagePreview ? (
                <div className="relative w-40 h-24 rounded-md overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img
                    src={urlCustomImagePreview}
                    alt="Custom preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeUrlCustomImage}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                    title="ছবি মুছে ফেলুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={urlFileInputRef}
                    accept="image/*"
                    onChange={handleUrlImageChange}
                    disabled={isPending}
                    className="hidden"
                    id="url-custom-image-file"
                  />
                  <label
                    htmlFor="url-custom-image-file"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    কাস্টম ছবি আপলোড (ঐচ্ছিক)
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isPending || !url.trim()}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStep || "প্রসেসিং হচ্ছে..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>নিউজ তৈরি ও প্রকাশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* FORM 2: CONTENT / PRESS RELEASE */
          <form onSubmit={handleContentSubmit} className="space-y-4">
            {/* Title Idea (Optional) */}
            <div>
              <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                খবরের শিরোনাম (ঐচ্ছিক)
              </Label>
              <Input
                type="text"
                placeholder="শিরোনাম লিখুন..."
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                disabled={isPending}
                className="text-xs sm:text-sm h-10 border-slate-300 focus:border-indigo-500"
              />
            </div>

            {/* Raw Content / Press Release (Required) */}
            <div>
              <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                খবরের কনটেন্ট / প্রেস রিলিজ *
              </Label>
              <Textarea
                placeholder="এখানে কনটেন্ট বা প্রেস রিলিজ পেস্ট করুন..."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                disabled={isPending}
                required
                rows={6}
                className="text-xs sm:text-sm border-slate-300 focus:border-indigo-500 font-sans leading-relaxed"
              />
              <div className="flex justify-end text-[11px] text-slate-400 mt-1">
                <span>{rawContent.length} অক্ষর</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                  ক্যাটাগরি
                </Label>
                <select
                  value={contentCategory}
                  onChange={(e) => setContentCategory(e.target.value)}
                  disabled={isPending}
                  className="w-full text-xs sm:text-sm h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">স্বয়ংক্রিয় (AI)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <Label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                  পোস্ট স্ট্যাটাস
                </Label>
                <select
                  value={contentStatus}
                  onChange={(e) => setContentStatus(e.target.value as any)}
                  disabled={isPending}
                  className="w-full text-xs sm:text-sm h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Feature Image Upload or URL or AI */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  ফিচার ইমেজ (ঐচ্ছিক)
                </Label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contentGenerateImage}
                    onChange={(e) => setContentGenerateImage(e.target.checked)}
                    disabled={isPending}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>ছবি না দিলে AI দিয়ে তৈরি করবে</span>
                </label>
              </div>

              {contentImagePreview ? (
                <div className="relative w-40 h-24 rounded-md overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img
                    src={contentImagePreview}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeContentImage}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                    title="ছবি মুছে ফেলুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="file"
                    ref={contentFileInputRef}
                    accept="image/*"
                    onChange={handleContentImageChange}
                    disabled={isPending}
                    className="hidden"
                    id="content-image-file"
                  />
                  <label
                    htmlFor="content-image-file"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                    ছবি আপলোড
                  </label>

                  <span className="text-xs text-slate-400 self-center">অথবা</span>

                  <Input
                    type="url"
                    placeholder="ছবির লিঙ্ক (URL)..."
                    value={contentImageUrl}
                    onChange={(e) => setContentImageUrl(e.target.value)}
                    disabled={isPending}
                    className="text-xs h-8 border-slate-300 flex-1"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isPending || rawContent.trim().length < 30}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStep || "প্রসেসিং হচ্ছে..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>নিউজ তৈরি ও প্রকাশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
