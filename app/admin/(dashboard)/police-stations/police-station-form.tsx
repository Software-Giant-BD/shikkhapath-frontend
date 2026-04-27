"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type PoliceStation } from "@/lib/api/police-station-types";
import {
  createPoliceStation,
  updatePoliceStation,
} from "@/lib/api/police-stations";
import {
  getDivisionsAction,
  getDistrictsAction,
  getUpazilasAction,
  type LocationOption,
} from "@/lib/api/location-actions";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface PoliceStationFormProps {
  initialData?: PoliceStation;
}

export function PoliceStationForm({ initialData }: PoliceStationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone_number: initialData?.phone_number || "",
    division_id: initialData?.division_id?.toString() || "",
    district_id: initialData?.district_id?.toString() || "",
    upazila_id: initialData?.upazila_id?.toString() || "",
    latitude: initialData?.latitude || "",
    address: initialData?.address || "",
    longitude: initialData?.longitude || "",
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      const result = await getDivisionsAction();
      if (result.ok) setDivisions(result.items);
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (formData.division_id) {
      const fetchDistricts = async () => {
        const result = await getDistrictsAction(formData.division_id);
        if (result.ok) setDistricts(result.items);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district_id: "", upazila_id: "" }));
    }
  }, [formData.division_id]);

  useEffect(() => {
    if (formData.district_id) {
      const fetchUpazilas = async () => {
        const result = await getUpazilasAction(formData.district_id);
        if (result.ok) setUpazilas(result.items);
      };
      fetchUpazilas();
    } else {
      setUpazilas([]);
      setFormData((prev) => ({ ...prev, upazila_id: "" }));
    }
  }, [formData.district_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        division_id: parseInt(formData.division_id),
        district_id: parseInt(formData.district_id),
        upazila_id: parseInt(formData.upazila_id),
        is_active: Boolean(formData.is_active),
      };

      if (initialData) {
        await updatePoliceStation(initialData.id, dataToSubmit);
        toast.success("Police station updated successfully");
      } else {
        await createPoliceStation(dataToSubmit);
        toast.success("Police station created successfully");
      }

      router.push("/admin/police-stations");
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
          href="/admin/police-stations"
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
          {initialData ? "Update Station" : "Save Station"}
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
                  Station Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Dhanmondi Police Station"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  placeholder="e.g. 02-9669999"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-slate-700"
                >
                  Active Station
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Location Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Division
                </label>
                <SearchableSelect
                  options={divisions}
                  value={formData.division_id}
                  onChange={(val) => setFormData({ ...formData, division_id: val })}
                  placeholder="Select Division"
                  searchPlaceholder="Search Division..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    District
                  </label>
                  <SearchableSelect
                    options={districts}
                    value={formData.district_id}
                    disabled={!formData.division_id}
                    onChange={(val) => setFormData({ ...formData, district_id: val })}
                    placeholder="Select District"
                    searchPlaceholder="Search District..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Upazila
                  </label>
                  <SearchableSelect
                    options={upazilas}
                    value={formData.upazila_id}
                    disabled={!formData.district_id}
                    onChange={(val) => setFormData({ ...formData, upazila_id: val })}
                    placeholder="Select Upazila"
                    searchPlaceholder="Search Upazila..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="e.g. 23.7393"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    placeholder="e.g. 90.3804"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Latitude and Longitude are used for Google Maps redirection.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter Address"
                  className="w-full rounded-lg border border-slate-200 px-4 py-8 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
