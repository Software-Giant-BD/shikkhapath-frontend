import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, Heart } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/blood-groups";
import { registerBloodDonorAction } from "@/lib/api/blood-donor-actions";
import { getDistrictsAction } from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface DonorRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function DonorRegistrationForm({
  onClose,
  onSuccess,
}: DonorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [districts, setDistricts] = useState<
    { id: string; name: string; bn_name?: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    district_id: "",
    blood_group: "" as any,
    nid_number: "",
    last_donation_date: "",
    is_available: 1,
  });

  useEffect(() => {
    getDistrictsAction().then((res) => {
      if (res.ok) {
        setDistricts(res.items);
      }
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? ((e.target as HTMLInputElement).checked ? 1 : 0) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("phone_number", formData.phone_number);
    data.append("district_id", formData.district_id);
    data.append("blood_group", formData.blood_group);
    data.append("nid_number", formData.nid_number);
    if (formData.last_donation_date) {
      data.append("last_donation_date", formData.last_donation_date);
    }
    data.append("is_available", String(formData.is_available));

    if (fileInputRef.current?.files?.[0]) {
      data.append("image", fileInputRef.current.files[0]);
    }

    const result = await registerBloodDonorAction(data);

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      alert(result.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="ase-fade-up w-full max-w-xl h-full max-h-[95vh] overflow-y-auto rounded-[40px] bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Register as Donor
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Save Lives with every drop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8 pt-6">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-slate-50 bg-slate-100 shadow-md ring-2 ring-red-500/10 transition-all hover:ring-red-500/30"
            >
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <Upload className="h-8 w-8" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-center">
                <p className="text-[8px] font-black uppercase text-white">
                  Upload
                </p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:bg-white"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  name="phone_number"
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:bg-white"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Blood Group
              </label>
              <SearchableSelect
                options={BLOOD_GROUPS.map((g) => ({ id: g, name: g }))}
                value={formData.blood_group}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, blood_group: value }))
                }
                placeholder="Select Group"
                searchPlaceholder="Search group..."
                triggerClassName="border-2 border-slate-100 bg-slate-50/50"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Location
              </label>
              <SearchableSelect
                options={districts}
                value={formData.district_id}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, district_id: value }))
                }
                placeholder="Select District"
                searchPlaceholder="Search districts..."
                className="w-full"
                triggerClassName="border-2 border-slate-100 bg-slate-50/50"
              />
            </div>

            {/* NID */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                NID Number
              </label>
              <input
                name="nid_number"
                value={formData.nid_number}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:bg-white"
                placeholder="10/17 digit NID"
              />
            </div>

            {/* Last Donation */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Last Donation (Optional)
              </label>
              <input
                name="last_donation_date"
                type="date"
                value={formData.last_donation_date}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between rounded-3xl border-2 border-slate-100 bg-slate-50/30 p-5">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-800">
                Current Availability
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Are you available for donation now?
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available === 1}
                onChange={handleInputChange}
                className="peer sr-only"
              />
              <div className="peer h-7 w-14 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-1/2 after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-3xl bg-red-600 text-base font-black text-white shadow-2xl shadow-red-600/30 transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Finish Registration"
              )}
            </Button>
            <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Verification process takes 24 hours
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
