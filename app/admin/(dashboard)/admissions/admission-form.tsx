"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type AdmissionUniversityModel } from "@/lib/api/admission";
import {
  createAdmissionAction,
  updateAdmissionAction,
} from "@/lib/api/admission-actions";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdmissionFormProps {
  initialData?: AdmissionUniversityModel;
}

const GROUPS = ["Science", "Commerce", "Arts"];
const EXAM_TYPES: AdmissionUniversityModel["exam_type"][] = [
  "Written",
  "MCQ",
  "Online",
  "Written & MCQ",
];

export function AdmissionForm({ initialData }: AdmissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    unit: initialData?.unit || "",
    logo_url: initialData?.logo_url || "",
    exam_date: initialData?.exam_date ? initialData.exam_date.split('T')[0] : "",
    app_start_date: initialData?.app_start_date ? initialData.app_start_date.split('T')[0] : "",
    app_deadline: initialData?.app_deadline ? initialData.app_deadline.split('T')[0] : "",
    exam_type: initialData?.exam_type ?? "MCQ",
    seats: initialData?.seats?.toString() || "",
    tags: initialData?.tags?.join(", ") || "",
    req_ssc: initialData?.req_ssc || 0,
    req_hsc: initialData?.req_hsc || 0,
    req_total: initialData?.req_total || 0,
    allowed_groups: initialData?.allowed_groups || [],
    apply_url: initialData?.apply_url || "",
  });

  const handleGroupToggle = (group: string) => {
    setFormData((prev) => {
      const groups = prev.allowed_groups.includes(group)
        ? prev.allowed_groups.filter((g) => g !== group)
        : [...prev.allowed_groups, group];
      return { ...prev, allowed_groups: groups };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        req_ssc: Number(formData.req_ssc),
        req_hsc: Number(formData.req_hsc),
        req_total: Number(formData.req_total),
        exam_type: formData.exam_type,
      };

      if (initialData?.id) {
        await updateAdmissionAction(initialData.id, dataToSubmit);
        toast.success("Admission updated successfully");
      } else {
        await createAdmissionAction(dataToSubmit);
        toast.success("Admission created successfully");
      }

      router.push("/admin/admissions");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/admissions"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to List
        </Link>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {initialData ? "Update Admission" : "Save Admission"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  University Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. University of Dhaka"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Unit / Faculty
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="e.g. A Unit"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Seats Target
                  </label>
                  <input
                    type="text"
                    value={formData.seats}
                    onChange={(e) =>
                      setFormData({ ...formData, seats: e.target.value })
                    }
                    placeholder="e.g. 1851 or 1851+"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Apply URL
                </label>
                <input
                  type="url"
                  value={formData.apply_url}
                  onChange={(e) =>
                    setFormData({ ...formData, apply_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g. Public, Top Ranked"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Admission Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Application Start
                  </label>
                  <input
                    type="date"
                    value={formData.app_start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, app_start_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.app_deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, app_deadline: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={formData.exam_date}
                    onChange={(e) =>
                      setFormData({ ...formData, exam_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Exam Method
                  </label>
                  <select
                    value={formData.exam_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exam_type: e.target.value as AdmissionUniversityModel["exam_type"],
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    {EXAM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Requirements (GPA)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.req_ssc}
                      onChange={(e) =>
                        setFormData({ ...formData, req_ssc: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="SSC"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">SSC GPA</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.req_hsc}
                      onChange={(e) =>
                        setFormData({ ...formData, req_hsc: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="HSC"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">HSC GPA</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.req_total}
                      onChange={(e) =>
                        setFormData({ ...formData, req_total: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Total"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">Total GPA</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Allowed Groups
                </label>
                <div className="flex flex-wrap gap-3">
                  {GROUPS.map((group) => (
                    <label key={group} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowed_groups.includes(group)}
                        onChange={() => handleGroupToggle(group)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">{group}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
