"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitContactMessage } from "@/lib/api/contact"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isSubmitting) return

    setSubmitError(null)
    setSubmitSuccess(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    }

    try {
      const result = await submitContactMessage(payload)

      if (!result.success) {
        throw new Error(result.message || "Failed to send your message. Please try again.")
      }

      setSubmitSuccess(result.message || "Thank you! Your message has been sent successfully.")
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="ase-panel p-8 sm:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Get In Touch With Us</h2>
        <p className="text-slate-500 mt-2">Fill out the form below and our team will respond shortly.</p>
      </div>
      
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">Name *</label>
            <input 
              id="name" 
              name="name"
              type="text" 
              required 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-[#255f76] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#255f76]/30" 
              placeholder="e.g. John Doe" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email *</label>
            <input 
              id="email" 
              name="email"
              type="email" 
              required 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-[#255f76] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#255f76]/30" 
              placeholder="john@example.com" 
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone *</label>
            <input 
              id="phone" 
              name="phone"
              type="tel" 
              required 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-[#255f76] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#255f76]/30" 
              placeholder="+1 (555) 000-0000" 
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="subject" className="text-sm font-semibold text-slate-700">Subject *</label>
            <input 
              id="subject" 
              name="subject"
              type="text" 
              required 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-[#255f76] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#255f76]/30" 
              placeholder="How can we assist you?" 
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message *</label>
            <textarea 
              id="message" 
              name="message"
              rows={6} 
              required 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 transition-all focus:border-[#255f76] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#255f76]/30 resize-y" 
              placeholder="Provide details about your inquiry..." 
            />
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#255f76] py-6 text-base font-semibold tracking-wide text-white shadow-lg shadow-[#255f76]/20 transition-all hover:bg-[#1f4f62] disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Sending..." : "Send Message"}
            <Send className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  )
}
