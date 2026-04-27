"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Phone, MapPin, Globe, Shield, Map as MapIcon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { Label } from "@/components/admin/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { getDivisionsAction, getDistrictsAction, getUpazilasAction, type LocationOption } from "@/lib/api/location-actions";
import { createFireStation, updateFireStation } from "@/lib/api/fire-stations";
import { type FireStation } from "@/lib/api/fire-station-types";
import { toast } from "sonner";

interface FireStationFormProps {
  initialData?: FireStation;
}

export function FireStationForm({ initialData }: FireStationFormProps) {
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
    address: initialData?.address || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    getDivisionsAction().then((res) => {
      if (res.ok) setDivisions(res.items);
    });
  }, []);

  useEffect(() => {
    if (formData.division_id) {
      getDistrictsAction(formData.division_id).then((res) => {
        if (res.ok) setDistricts(res.items);
      });
    } else {
      setDistricts([]);
    }
  }, [formData.division_id]);

  useEffect(() => {
    if (formData.district_id) {
      getUpazilasAction(formData.district_id).then((res) => {
        if (res.ok) setUpazilas(res.items);
      });
    } else {
      setUpazilas([]);
    }
  }, [formData.district_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = initialData
        ? await updateFireStation(initialData.id, formData)
        : await createFireStation(formData);

      if (res.success) {
        toast.success(initialData ? "Fire station updated" : "Fire station created");
        router.push("/admin/fire-stations");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save fire station");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Shield size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Station Information</CardTitle>
                  <p className="text-xs text-slate-500">Basic details about the fire station</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Station Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Enter station name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-10"
                  />
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-slate-700 font-semibold">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone_number"
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-semibold">Full Address</Label>
                <div className="relative">
                  <Input
                    id="address"
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Globe size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Location Details</CardTitle>
                  <p className="text-xs text-slate-500">Geographic information for mapping</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Division</Label>
                  <SearchableSelect
                    options={divisions}
                    value={formData.division_id}
                    onChange={(val) => setFormData({ ...formData, division_id: val, district_id: "", upazila_id: "" })}
                    placeholder="Select Division"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">District</Label>
                  <SearchableSelect
                    options={districts}
                    value={formData.district_id}
                    disabled={!formData.division_id}
                    onChange={(val) => setFormData({ ...formData, district_id: val, upazila_id: "" })}
                    placeholder="Select District"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Upazila</Label>
                  <SearchableSelect
                    options={upazilas}
                    value={formData.upazila_id}
                    disabled={!formData.district_id}
                    onChange={(val) => setFormData({ ...formData, upazila_id: val })}
                    placeholder="Select Upazila"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-slate-700 font-semibold">Latitude</Label>
                  <div className="relative">
                    <Input
                      id="latitude"
                      placeholder="e.g. 23.8103"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="pl-10"
                    />
                    <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-slate-700 font-semibold">Longitude</Label>
                  <div className="relative">
                    <Input
                      id="longitude"
                      placeholder="e.g. 90.4125"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="pl-10"
                    />
                    <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">Active Status</Label>
                  <p className="text-xs text-slate-500">Show in public directory</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/30">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-orange-800">Verification</h4>
                    <p className="text-[11px] text-orange-700 leading-relaxed">
                      Ensure all phone numbers and locations are verified before publishing.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {initialData ? "Update Fire Station" : "Save Fire Station"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
