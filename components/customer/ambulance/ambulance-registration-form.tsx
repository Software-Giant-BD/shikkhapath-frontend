"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, CheckCircle2, Loader2, FileText, User } from "lucide-react";
import { registerAmbulanceAction } from "@/lib/api/ambulance-actions";
import { getDistrictsAction, type LocationOption } from "@/lib/api/location-actions";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface AmbulanceRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AmbulanceRegistrationForm({ onClose, onSuccess }: AmbulanceRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  
  // Preview states
  const [previews, setPreviews] = useState({
    ambulance: null as string | null,
    nid: null as string | null,
    provider: null as string | null,
  });

  // Refs
  const ambulanceRef = useRef<HTMLInputElement>(null);
  const nidRef = useRef<HTMLInputElement>(null);
  const providerRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    district_id: "",
    nid_number: "",
    description: "",
  });

  useEffect(() => {
    getDistrictsAction().then(res => {
      if (res.ok) {
        setDistricts(res.items);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof previews) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPreviews(prev => ({ ...prev, [type]: "pdf" }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("phone_number", formData.phone_number);
    data.append("district_id", formData.district_id);
    data.append("nid_number", formData.nid_number);
    data.append("ambulance_details", formData.description);

    if (ambulanceRef.current?.files?.[0]) {
      data.append("ambulance_photo", ambulanceRef.current.files[0]);
    }
    if (nidRef.current?.files?.[0]) {
      data.append("nid_copy", nidRef.current.files[0]);
    }
    if (providerRef.current?.files?.[0]) {
      data.append("manager_photo", providerRef.current.files[0]);
    }

    const result = await registerAmbulanceAction(data);

    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      alert(result.message);
    }
  };

  const renderPreview = (preview: string | null, label: string, icon: React.ReactNode) => {
    if (preview === "pdf") {
      return (
        <div className="flex flex-col items-center gap-1 text-primary">
          <FileText className="h-8 w-8" />
          <span className="text-[10px] font-bold">PDF Selected</span>
        </div>
      );
    }
    
    if (preview) {
      return <img src={preview} alt={label} className="h-full w-full object-cover" />;
    }

    return (
      <div className="flex flex-col items-center gap-1 text-slate-400">
        {icon}
        <span className="text-[10px] font-bold">{label}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <div 
        className="ase-fade-up w-full max-w-2xl h-full max-h-[95vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-800">Register Ambulance Service</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6">
          {/* Document Uploads Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Ambulance Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Ambulance Photo</label>
              <div 
                onClick={() => ambulanceRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              >
                {renderPreview(previews.ambulance, "Upload Photo", <Camera className="h-6 w-6" />)}
                <input type="file" ref={ambulanceRef} className="hidden" accept=".webp,.png,.jpg,.jpeg,.pdf" onChange={(e) => handleFileChange(e, "ambulance")} />
              </div>
            </div>

            {/* NID Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">NID Copy</label>
              <div 
                onClick={() => nidRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              >
                {renderPreview(previews.nid, "Upload NID", <FileText className="h-6 w-6" />)}
                <input type="file" ref={nidRef} className="hidden" accept=".webp,.png,.jpg,.jpeg,.pdf" onChange={(e) => handleFileChange(e, "nid")} />
              </div>
            </div>

            {/* Provider Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Manager Photo</label>
              <div 
                onClick={() => providerRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              >
                {renderPreview(previews.provider, "Upload Photo", <User className="h-6 w-6" />)}
                <input type="file" ref={providerRef} className="hidden" accept=".webp,.png,.jpg,.jpeg,.pdf" onChange={(e) => handleFileChange(e, "provider")} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"
                placeholder="Manager/Owner name"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone_number" className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"
                placeholder="017XXXXXXXX"
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-2">
              <label htmlFor="district_id" className="text-sm font-semibold text-slate-700">Service Location</label>
              <select
                id="district_id"
                name="district_id"
                required
                value={formData.district_id}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 appearance-none"
              >
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.bn_name || d.name}</option>
                ))}
              </select>
            </div>

            {/* NID Number */}
            <div className="space-y-2">
              <label htmlFor="nid_number" className="text-sm font-semibold text-slate-700">NID Number</label>
              <input
                id="nid_number"
                name="nid_number"
                required
                value={formData.nid_number}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"
                placeholder="10 or 17 digit NID"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700">Ambulance Details</label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none"
              placeholder="E.g. Full ICU support, available 24/7..."
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-primary text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
            <p className="mt-4 text-center text-[11px] text-slate-400">
              *All documents will be verified by our admin team before listing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
