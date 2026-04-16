"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select } from "@/components/admin/ui/select";
import type { RoutineModel } from "@/lib/api/ssc-hsc";

// Since we mock backend, we can just pretend it succeeds.
export function RoutineForm({ initialData }: { initialData?: RoutineModel }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Fake saving
      await new Promise(r => setTimeout(r, 800));
      router.push("/admin/ssc-hsc/routines/list");
      router.refresh();
    } catch {
      setError("Failed to save routine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 md:p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">{initialData ? "Edit Routine Block" : "Add New Exam Routine"}</h2>
      
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Exam Type</Label>
            <Select defaultValue={initialData?.exam_type || "SSC"}>
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" defaultValue={initialData?.year || new Date().getFullYear()} required />
          </div>
          <div className="space-y-2">
            <Label>Subject Name</Label>
            <Input defaultValue={initialData?.subject_name} required placeholder="e.g. Mathematics" />
          </div>
          <div className="space-y-2">
            <Label>Exam Date</Label>
            <Input type="date" defaultValue={initialData?.exam_date} required />
          </div>
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input type="time" defaultValue={initialData?.start_time} required />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input type="time" defaultValue={initialData?.end_time} required />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Routine"}
          </Button>
        </div>
      </form>
    </div>
  );
}
