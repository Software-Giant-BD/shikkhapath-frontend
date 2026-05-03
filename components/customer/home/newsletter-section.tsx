"use client";

import { useState } from "react";
import { subscribeNewsletterAction } from "@/lib/api/newsletter-actions";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await subscribeNewsletterAction(email);
      if (response.success) {
        setMessage({ type: "success", text: response.message || "ধন্যবাদ! সফলভাবে সাবস্ক্রাইব করা হয়েছে।" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: response.message || "দুঃখিত! কিছু ভুল হয়েছে।" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করুন।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-6 rounded border border-[#d6ab30] bg-[linear-gradient(180deg,#fff8e7_0%,#fffdf7_100%)] p-5 sm:p-7">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b38716]">আমাদের নিউজলেটার</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            প্রতিদিন সকালে সেরা শিরোনাম পান ইনবক্সে
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            শিক্ষা, ক্যাম্পাস ও কর্মজীবনের গুরুত্বপূর্ণ সংবাদ প্রতিদিন সকাল ৮টায়।
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2">
          <form
            className="flex w-full flex-col gap-2 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label htmlFor="nl-email" className="sr-only">
              ইমেইল ঠিকানা
            </label>
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল লিখুন"
              disabled={loading}
              className="h-10 flex-1 rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#c79a1d] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded bg-[#c79a1d] px-5 text-sm font-bold text-white transition-colors hover:bg-[#b38716] disabled:opacity-50"
            >
              {loading ? "প্রসেসিং..." : "সাবস্ক্রাইব"}
            </button>
          </form>
          {message && (
            <p className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
