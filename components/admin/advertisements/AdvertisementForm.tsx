"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { createAdvertisementAction, updateAdvertisementAction } from "@/lib/api/advertisement-actions";
import { Advertisement } from "@/lib/api/advertisements";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";

const CATEGORIES = {
  "Home page": ["Top Banner Ad", "Sidebar Ad", "In-Feed / Mid-Page Ad"],
  "category page": ["Header Ad", "In-Feed Ad", "In-Feed second Ad", "Right Sidebar Ad", "Anchor / Sticky Footer Ad"],
  "services pages": [
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
  const [image, setImage] = useState(initialData?.image || "");
  const [redirectUrl, setRedirectUrl] = useState(initialData?.redirect_url || "");
  const [status, setStatus] = useState(initialData?.status ?? true);

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setPlacement(CATEGORIES[newCategory as keyof typeof CATEGORIES]?.[0] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setSubmitError("");
    setSubmitMessage("");

    const payload = {
      name,
      category,
      placement,
      image,
      redirect_url: redirectUrl,
      status,
    };

    let result;
    if (initialData?.id) {
      result = await updateAdvertisementAction(initialData.id, payload);
    } else {
      result = await createAdvertisementAction(payload);
    }

    setLoading(false);

    if (result.ok) {
      setSubmitMessage(result.message);
      router.push("/admin/advertisements/list");
    } else {
      setSubmitError(result.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 py-4">
            <CardTitle>{headerTitle}</CardTitle>
            {headerAction}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Advertisement Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Redirect URL</label>
                  <input
                    type="url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.keys(CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Placement *</label>
                  <select
                    required
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {CATEGORIES[category as keyof typeof CATEGORIES]?.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image</label>
                <div className="flex items-center gap-4">
                  {image ? (
                    <div className="relative h-24 w-40 overflow-hidden rounded-md border border-slate-200">
                      <Image src={image} alt="Ad Image" fill className="object-cover" />
                    </div>
                  ) : null}
                  <Button type="button" variant="secondary" onClick={() => setMediaPickerOpen(true)}>
                    Select Image
                  </Button>
                  {image && (
                    <Button type="button" variant="secondary" className="text-red-600" onClick={() => setImage("")}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Active
                </label>
              </div>

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

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Advertisement"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <MediaPickerDialog
        isOpen={mediaPickerOpen}
        mediaType="image"
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(selected) => {
          if (selected) setImage(selected.url);
          setMediaPickerOpen(false);
        }}
      />
    </>
  );
}
