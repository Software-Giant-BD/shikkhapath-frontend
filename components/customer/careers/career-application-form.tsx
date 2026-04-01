"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { submitCareerApplication } from "@/lib/api/career-applications";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function validateFile(file: File | null, label: string, required: boolean) {
  if (!file) {
    return required ? `${label} is required.` : null;
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return `${label} must be a PDF, DOC, or DOCX file.`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${label} must be 10 MB or smaller.`;
  }

  return null;
}

export function CareerApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const resume = formData.get("resume");
    const coverLetter = formData.get("cover_letter");

    const resumeFile = resume instanceof File && resume.size > 0 ? resume : null;
    const coverLetterFile = coverLetter instanceof File && coverLetter.size > 0 ? coverLetter : null;

    const resumeValidationError = validateFile(resumeFile, "Resume", true);
    if (resumeValidationError) {
      setSubmitError(resumeValidationError);
      setIsSubmitting(false);
      return;
    }

    const coverLetterValidationError = validateFile(coverLetterFile, "Cover letter", false);
    if (coverLetterValidationError) {
      setSubmitError(coverLetterValidationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitCareerApplication(formData);

      if (!result.success) {
        const firstFieldError = result.errors
          ? Object.values(result.errors).flat().find(Boolean)
          : null;

        throw new Error(firstFieldError || result.message || "Failed to submit your application.");
      }

      setSubmitSuccess(result.message || "Application submitted successfully.");
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {submitSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-semibold text-slate-700">Full Name *</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#386e7f] focus:ring-1 focus:ring-[#386e7f] outline-none transition-all"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#386e7f] focus:ring-1 focus:ring-[#386e7f] outline-none transition-all"
            placeholder="(555) 000-0000"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address *</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#386e7f] focus:ring-1 focus:ring-[#386e7f] outline-none transition-all"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="text-sm font-semibold text-slate-700">Position Applying For *</label>
        <select
          id="position"
          name="position"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#386e7f] focus:ring-1 focus:ring-[#386e7f] outline-none transition-all bg-white"
          required
          defaultValue=""
        >
          <option value="" disabled>---- Select Position ----</option>
          <option value="Team Leader - NY/NJ">Team Leader - NY/NJ</option>
          <option value="Assistant Team Leader - NY/NJ">Assistant Team Leader - NY/NJ</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          <label htmlFor="resume" className="text-sm font-semibold text-slate-700">Upload Resume *</label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#386e7f]/10 file:text-[#386e7f] hover:file:bg-[#386e7f]/20 cursor-pointer"
            required
          />
          <p className="text-xs text-slate-500">Accepted: PDF, DOC, DOCX. Max size: 10 MB.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="cover_letter" className="text-sm font-semibold text-slate-700">Upload Cover Letter</label>
          <input
            id="cover_letter"
            name="cover_letter"
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 cursor-pointer"
          />
          <p className="text-xs text-slate-500">Optional. Accepted: PDF, DOC, DOCX. Max size: 10 MB.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 flex items-center justify-center gap-2 px-8 py-4 bg-[#386e7f] text-white rounded-xl font-semibold hover:bg-[#2a5563] shadow-lg shadow-[#386e7f]/20 hover:-translate-y-0.5 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
