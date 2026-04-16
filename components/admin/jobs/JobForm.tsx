"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { Select } from "@/components/admin/ui/select";
import type { JobApiModel } from "@/lib/api/jobs";
import { createJobAction, updateJobAction } from "@/lib/api/jobs-actions";

interface JobFormProps {
  initialData?: JobApiModel;
  headerTitle: string;
  headerAction?: React.ReactNode;
}

export function JobForm({ initialData, headerTitle, headerAction }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    company_name: initialData?.company_name || "",
    category: initialData?.category || "Private",
    job_type: initialData?.job_type || "Full-time",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    deadline: initialData?.deadline || "",
    description: initialData?.description || "",
    apply_link: initialData?.apply_link || "",
    status: initialData?.status || "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (initialData?.id) {
        res = await updateJobAction(initialData.id, formData);
      } else {
        res = await createJobAction(formData);
      }
      
      if (!res.ok) {
        throw new Error(res.message);
      }
      
      router.push("/admin/jobs/list");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{headerTitle}</h2>
        {headerAction}
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g. Code Studio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Govt">Govt Job</option>
              <option value="Private">Private Company</option>
              <option value="NGO">NGO</option>
              <option value="Freelance">Freelance</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_type">Job Type *</Label>
            <Select
              id="job_type"
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka, Bangladesh"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary (Optional)</Label>
            <Input
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 50,000 - 80,000 BDT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apply_link">Apply Link (Original URL) *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="apply_link"
              name="apply_link"
              type="url"
              required
              value={formData.apply_link}
              onChange={handleChange}
              placeholder="https://example.com/apply"
              className="flex-1"
            />
            <ExternalLink className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">Users will be redirected to this link when they click "Apply Now".</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={8}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed job description, requirements, etc."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Job"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
