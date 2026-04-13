"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, CheckCircle2, Loader2, FileText, User } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";
import { registerAmbulanceService } from "@/lib/api/ambulance";
import { Button } from "@/components/ui/button";

interface AmbulanceRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AmbulanceRegistrationForm({ onClose, onSuccess }: AmbulanceRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    location: "",
    nid_number: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof previews) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await registerAmbulanceService({
      ...formData,
      image: ambulanceRef.current?.files?.[0],
      nid_image: nidRef.current?.files?.[0],
      provider_image: providerRef.current?.files?.[0],
    });

    setIsSubmitting(false);

    if (result.ok) {
      onSuccess();
    } else {
      alert(result.message);
    }
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
                {previews.ambulance ? (
                  <img src={previews.ambulance} alt="Ambulance" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                )}
                <input type="file" ref={ambulanceRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ambulance")} />
              </div>
            </div>

            {/* NID Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">NID Copy</label>
              <div 
                onClick={() => nidRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              >
                {previews.nid ? (
                  <img src={previews.nid} alt="NID" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <FileText className="h-6 w-6" />
                    <span className="text-[10px] font-bold">Upload NID</span>
                  </div>
                )}
                <input type="file" ref={nidRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "nid")} />
              </div>
            </div>

            {/* Provider Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Manager Photo</label>
              <div 
                onClick={() => providerRef.current?.click()}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden"
              >
                {previews.provider ? (
                  <img src={previews.provider} alt="Provider" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <User className="h-6 w-6" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                )}
                <input type="file" ref={providerRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "provider")} />
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
              <label htmlFor="location" className="text-sm font-semibold text-slate-700">Service Location</label>
              <select
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 appearance-none"
              >
                <option value="">Select District</option>
                {BANGLADESH_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
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
