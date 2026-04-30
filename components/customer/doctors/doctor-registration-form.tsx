"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  Hospital,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  DollarSign,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";
import { registerDoctor } from "@/lib/api/doctors";
import {
  getDistrictsAction,
  type LocationOption,
} from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface DoctorRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export function DoctorRegistrationForm({
  onClose,
  onSuccess,
}: DoctorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [previews, setPreviews] = useState({
    profile: null as string | null,
    clinic: null as string | null,
  });

  const profileRef = useRef<HTMLInputElement>(null);
  const clinicRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    district_id: "",
    specialty: "" as any,
    hospital: "",
    fee: "",
    available_days: [] as string[],
    available_time: "",
    nid_number: "",
    bmdc_number: "",
    description: "",
  });

  useEffect(() => {
    getDistrictsAction().then((res) => {
      if (res.ok) {
        setDistricts(res.items);
      }
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const days = prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day];
      return { ...prev, available_days: days };
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof typeof previews,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.available_days.length === 0) {
      alert("Please select at least one available day.");
      return;
    }
    setIsSubmitting(true);

    const data = new FormData();
    data.append("full_name", formData.name);
    data.append("phone_number", formData.phone_number);
    if (formData.email) data.append("email", formData.email);
    data.append("district_id", formData.district_id);
    data.append("specialty", formData.specialty);
    data.append("hospital_name", formData.hospital);
    if (formData.fee) data.append("consultation_fee", formData.fee);
    data.append("available_time_slot", formData.available_time);
    data.append("nid_no", formData.nid_number);
    if (formData.bmdc_number)
      data.append("bmdc_registration_no", formData.bmdc_number);
    data.append("description", formData.description);

    formData.available_days.forEach((day) => {
      data.append("available_days[]", day);
    });

    if (profileRef.current?.files?.[0]) {
      data.append("profile_image", profileRef.current.files[0]);
    }
    if (clinicRef.current?.files?.[0]) {
      data.append("clinic_image", clinicRef.current.files[0]);
    }

    const result = await registerDoctor(data);

    setIsSubmitting(false);

    if (result.ok) {
      onSuccess();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-md p-4 sm:p-6">
      <div
        className="ase-fade-up w-full max-w-2xl h-full max-h-[95vh] overflow-y-auto rounded-[40px] bg-white shadow-2xl transition-all no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Doctor Registration
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                Professional Enrollment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-50 p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 p-8 pt-6">
          {/* Photos Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
                Profile Image
              </label>
              <div
                onClick={() => profileRef.current?.click()}
                className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-500/50 hover:bg-blue-50/30 overflow-hidden"
              >
                {previews.profile ? (
                  <img
                    src={previews.profile}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-blue-400 transition-colors">
                    <User className="h-10 w-10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Upload Portrait
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={profileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile")}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
                Clinic/Hospital Image
              </label>
              <div
                onClick={() => clinicRef.current?.click()}
                className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-500/50 hover:bg-blue-50/30 overflow-hidden"
              >
                {previews.clinic ? (
                  <img
                    src={previews.clinic}
                    alt="Clinic"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-blue-400 transition-colors">
                    <Hospital className="h-10 w-10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Optional Upload
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={clinicRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "clinic")}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                  placeholder="Dr. Firstname Lastname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Specialty
              </label>
              <SearchableSelect
                options={MEDICAL_SPECIALTIES.map((s) => ({ id: s, name: s }))}
                value={formData.specialty}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, specialty: val }))
                }
                placeholder="Select Specialty"
                searchPlaceholder="Search specialty..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Phone Number
              </label>
              <input
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="017XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="[EMAIL_ADDRESS]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                NID for Verification
              </label>
              <input
                name="nid_number"
                required
                value={formData.nid_number}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="10 or 17 digit NID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Location
              </label>
              <SearchableSelect
                options={districts.map((d) => ({
                  id: d.id,
                  name: d.name,
                  bn_name: d.bn_name,
                }))}
                value={formData.district_id}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, district_id: val }))
                }
                placeholder="Select District"
                searchPlaceholder="Search district..."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Hospital / Clinic Name
              </label>
              <input
                name="hospital"
                required
                value={formData.hospital}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="E.g. United Hospital, Apollo Clinic..."
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                Consultation Fee (Optional)
              </label>
              <input
                name="fee"
                type="number"
                value={formData.fee}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="In BDT (e.g. 1000)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                BM&DC Registration No.
              </label>
              <input
                name="bmdc_number"
                value={formData.bmdc_number}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
                placeholder="A-12345"
              />
            </div>
          
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                    formData.available_days.includes(day)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              Available Time Slot
            </label>
            <input
              name="available_time"
              required
              value={formData.available_time}
              onChange={handleInputChange}
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-4 text-sm font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white"
              placeholder="E.g. 4:00 PM - 7:00 PM"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              Professional Bio / Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, description: val }))
              }
              placeholder="Write about your experience, qualifications, and services..."
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-[24px] bg-blue-600 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing Enrollment...
                </div>
              ) : (
                "Finish Professional Profile"
              )}
            </Button>
            <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              BMDC Certification Verification Required
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
