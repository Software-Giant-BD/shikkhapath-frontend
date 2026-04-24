"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Save, X, ImageIcon } from "lucide-react";

import { createAdvertisementAction, updateAdvertisementAction } from "@/lib/api/advertisement-actions";
import { Advertisement } from "@/lib/api/advertisements";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

const CATEGORIES = {
  "Home Page": ["Top Banner Ad", "Sidebar Ad", "In-Feed / Mid-Page Ad"],
  "Category Page": ["Header Ad", "In-Feed Ad", "In-Feed second Ad", "Right Sidebar Ad", "Anchor / Sticky Footer Ad"],
  "Services Pages": [
    "Ambulance Ad",
    "Police Ad",
    "Fire Ad",
    "Blood Ad",
    "Doctor Ad",
    "Jobs Ad",
    "SSC/HSC (রুটিন | রেজাল্ট) Ad",
    "Admission Ad",
    "CGPA Calculator Ad",
  ],
};

const AD_DIMENSIONS: Record<string, string> = {
  "Top Banner Ad": "1140 x 100",
  "Sidebar Ad": "300 x 250",
  "In-Feed / Mid-Page Ad": "728 x 90",
  "Header Ad": "728 x 90",
  "In-Feed Ad": "728 x 90",
  "In-Feed second Ad": "728 x 90",
  "Right Sidebar Ad": "300 x 250",
  "Anchor / Sticky Footer Ad": "728 x 90",
  "Ambulance Ad": "300 x 250",
  "Police Ad": "300 x 250",
  "Fire Ad": "300 x 250",
  "Blood Ad": "300 x 250",
  "Doctor Ad": "300 x 250",
  "Jobs Ad": "300 x 250",
  "SSC/HSC (রুটিন | রেজাল্ট) Ad": "300 x 250",
  "Admission Ad": "300 x 250",
  "CGPA Calculator Ad": "300 x 250",
};

type AdvertisementFormProps = {
  initialData?: Advertisement;
  headerTitle: string;
  headerAction?: React.ReactNode;
};

export function AdvertisementForm({ initialData, headerTitle, headerAction }: AdvertisementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || Object.keys(CATEGORIES)[0]);
  const [placement, setPlacement] = useState(initialData?.placement || CATEGORIES[Object.keys(CATEGORIES)[0] as keyof typeof CATEGORIES][0]);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [redirectUrl, setRedirectUrl] = useState(initialData?.redirect_url || "");
  const [status, setStatus] = useState(initialData?.status ?? true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setPlacement(CATEGORIES[newCategory as keyof typeof CATEGORIES]?.[0] || "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    setSubmitMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("placement", placement);
    formData.append("redirect_url", redirectUrl);
    formData.append("status", status ? "1" : "0");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    let result;
    if (initialData?.id) {
      result = await updateAdvertisementAction(initialData.id, formData);
    } else {
      result = await createAdvertisementAction(formData);
    }

    setLoading(false);

    if (result.ok) {
      setSubmitMessage(result.message);
      setTimeout(() => router.push("/admin/advertisements/list"), 1500);
    } else {
      setSubmitError(result.message);
    }
  };

  const recommendedDimensions = AD_DIMENSIONS[placement] || "728 x 90";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800">{headerTitle}</CardTitle>
            {headerAction}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Advertisement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Collection 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Redirect URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Category</label>
                  <select
                    required
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full h-12 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white transition-all appearance-none cursor-pointer"
                  >
                    {Object.keys(CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Placement</label>
                  <select
                    required
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full h-12 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES[category as keyof typeof CATEGORIES]?.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-start gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-800">Active</span>
                    <p className="text-xs text-slate-500">This advertisement will be visible to users once saved.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-600 block">Image</label>
              <div className="relative group">
                <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-300">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="mt-2 text-xs">No image selected</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Upload size={18} />
                  Change Image
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="text-center text-xs text-slate-500 font-medium">
                Recommended size: <span className="text-slate-800 font-bold">{recommendedDimensions} pixels</span>. Max file size: 2MB.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-100"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              Save Advertisement
            </button>
          </div>

          {submitMessage && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              {submitMessage}
            </div>
          )}

          {submitError && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              {submitError}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
