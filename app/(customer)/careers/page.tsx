import { Metadata } from "next";
import { 
  PenTool, 
  Sparkles, 
  Target, 
  Globe, 
  Award, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Briefcase, 
  Building2, 
  Newspaper, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Star,
  Mail,
  UserCheck,
  TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
  title: "লেখক হোন | Shikkhapath",
  description: "Shikkhapath-এ আপনার জ্ঞান ও আইডিয়া হাজারো শিক্ষার্থীর কাছে পৌঁছে দেওয়ার সুযোগ।",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      {/* Header Section */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <PenTool className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Shikkhapath – লেখক হোন
          </h1>
          <h2 className="mt-6 flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">
            <Sparkles className="h-6 w-6 text-amber-500" />
            আপনি কি লিখতে ভালোবাসেন?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Shikkhapath আপনাকে দিচ্ছে একটি সুযোগ—আপনার জ্ঞান, অভিজ্ঞতা এবং আইডিয়া হাজারো শিক্ষার্থীর কাছে পৌঁছে দেওয়ার।
          </p>
          <div className="mt-6 inline-flex rounded-2xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-100">
            <p className="font-medium">
              👉 আপনি যদি শিক্ষা, ক্যারিয়ার বা শিক্ষার্থীদের জন্য উপকারী কোনো বিষয়ে লিখতে চান, তাহলে আমাদের প্ল্যাটফর্মে স্বাগতম।
            </p>
          </div>
        </div>
      </section>

      {/* Why Write & What to Write Grid */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Why Write */}
          <div className="rounded-3xl bg-slate-900 p-8 shadow-lg text-white">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <Target className="h-6 w-6 text-amber-400" />
              কেন Shikkha Path-এ লিখবেন?
            </h2>
            <ul className="space-y-4">
              {[
                { icon: Globe, text: "আপনার লেখার মাধ্যমে হাজারো পাঠকের কাছে পৌঁছাতে পারবেন" },
                { icon: GraduationCap, text: "শিক্ষার্থীদের উপকারে আসবে এমন কন্টেন্ট তৈরি করার সুযোগ" },
                { icon: UserCheck, text: "নিজের ব্যক্তিগত ব্র্যান্ড তৈরি করতে পারবেন" },
                { icon: PenTool, text: "ভবিষ্যতে নিয়মিত কন্ট্রিবিউটর হওয়ার সুযোগ" },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-medium text-white/90 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to Write */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
              <BookOpen className="h-6 w-6 text-blue-500" />
              কী বিষয়ে লিখতে পারবেন?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: BookOpen, text: "শিক্ষা বিষয়ক আর্টিকেল", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Target, text: "ভর্তি প্রস্তুতি ও গাইডলাইন", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: Lightbulb, text: "স্টাডি টিপস ও প্রোডাক্টিভিটি", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Briefcase, text: "ক্যারিয়ার গাইড ও জব প্রস্তুতি", color: "text-purple-500", bg: "bg-purple-50" },
                { icon: Building2, text: "বিশ্ববিদ্যালয়/মেডিকেল তথ্য", color: "text-rose-500", bg: "bg-rose-50" },
                { icon: Newspaper, text: "শিক্ষা সংক্রান্ত আপডেট ও নিউজ", color: "text-indigo-500", bg: "bg-indigo-50" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Guidelines & Benefits */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Guidelines */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
              <AlertCircle className="h-6 w-6 text-rose-500" />
              লেখার নিয়মাবলী
            </h2>
            <ul className="space-y-4">
              {[
                "লেখা অবশ্যই মৌলিক (Original) হতে হবে",
                "তথ্য সঠিক ও নির্ভরযোগ্য হতে হবে",
                "সহজ ও পরিষ্কার ভাষায় লিখতে হবে",
                "কপি-পেস্ট বা প্লেজিয়ারিজম গ্রহণযোগ্য নয়",
                "বিভ্রান্তিকর বা ভুয়া তথ্য দেওয়া যাবে না"
              ].map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                  <span className="font-medium">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Special Benefits */}
          <div className="rounded-3xl bg-amber-50 p-8 ring-1 ring-amber-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
              <Award className="h-6 w-6 text-amber-600" />
              বিশেষ সুবিধা
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Featured Writer</h3>
                  <p className="text-sm text-slate-600">ভালো লেখকদের Featured করা হবে</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Special Opportunities</h3>
                  <p className="text-sm text-slate-600">নিয়মিত লেখকদের জন্য বিশেষ সুযোগ</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Paid Writing</h3>
                  <p className="text-sm text-slate-600">ভবিষ্যতে Paid Writing সুযোগ (নির্বাচিত ক্ষেত্রে)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How to Become a Writer CTA */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#1a1a1a] text-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16">
              <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold">
                <Send className="h-8 w-8 text-amber-500" />
                কীভাবে লেখক হবেন?
              </h2>
              <div className="space-y-6">
                {[
                  { num: "১", text: "আপনার লেখা প্রস্তুত করুন" },
                  { num: "২", text: "আমাদের কাছে সাবমিট করুন" },
                  { num: "৩", text: "আমাদের সম্পাদকীয় টিম রিভিউ করবে" },
                  { num: "৪", text: "অনুমোদিত হলে আপনার লেখা প্রকাশ করা হবে" },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c79a1d] font-bold text-white">
                      {step.num}
                    </div>
                    <span className="text-lg font-medium text-white/90">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#c79a1d] p-8 text-center sm:p-12">
              <Mail className="mb-4 h-12 w-12 text-white" />
              <h3 className="mb-2 text-2xl font-bold text-white">লেখা পাঠান</h3>
              <p className="mb-6 text-white/90">আপনার লেখা বা যেকোনো প্রশ্নের জন্য ইমেইল করুন</p>
              <a 
                href="mailto:support@shikkhapath.com" 
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
              >
                support@shikkhapath.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
