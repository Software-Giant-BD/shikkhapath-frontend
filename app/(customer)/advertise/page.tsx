import { Metadata } from "next";
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Users, 
  MonitorPlay, 
  PenTool, 
  Share2, 
  Star, 
  CheckCircle2, 
  CreditCard,
  Mail
} from "lucide-react";

export const metadata: Metadata = {
  title: "বিজ্ঞাপন দিন | Shikkhapath",
  description: "Shikkhapath-এ বিজ্ঞাপন দিয়ে আপনার ব্র্যান্ডকে লাখো শিক্ষার্থীর কাছে পৌঁছে দিন।",
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      {/* Header Section */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Megaphone className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Shikkhapath – বিজ্ঞাপন দিন
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Shikkhapath একটি দ্রুত বর্ধনশীল শিক্ষা প্ল্যাটফর্ম, যেখানে প্রতিদিন হাজারো শিক্ষার্থী ভর্তি তথ্য, রেজাল্ট, রুটিন, ক্যারিয়ার গাইড এবং শিক্ষা সংক্রান্ত গুরুত্বপূর্ণ আপডেট পেতে ভিজিট করে।
          </p>
          <p className="mt-4 text-slate-600 font-medium text-amber-700 bg-amber-50 rounded-xl p-4 inline-block">
            👉 আমাদের লক্ষ্য শিক্ষার্থীদের নির্ভরযোগ্য তথ্য দেওয়া এবং ব্র্যান্ডগুলোকে সঠিক অডিয়েন্সের কাছে পৌঁছে দেওয়া।
          </p>
        </div>
      </section>

      {/* Audience & Benefits Grid */}
      <section className="mx-auto mt-16 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Audience */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
              <Users className="h-6 w-6 text-blue-500" />
              আমাদের অডিয়েন্স
            </h2>
            <ul className="space-y-4">
              {[
                { icon: GraduationCap, text: "স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের শিক্ষার্থী", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: BookOpen, text: "ভর্তি পরীক্ষার প্রস্তুতিমূলক শিক্ষার্থী", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: Briefcase, text: "চাকরি প্রার্থী ও ক্যারিয়ার সচেতন যুবক", color: "text-purple-500", bg: "bg-purple-50" },
                { icon: Users, text: "অভিভাবক ও শিক্ষক", color: "text-amber-500", bg: "bg-amber-50" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-slate-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="rounded-3xl bg-slate-900 p-8 shadow-lg text-white">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <TrendingUp className="h-6 w-6 text-amber-400" />
              বিজ্ঞাপনের সুবিধা
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Target, text: "নির্দিষ্ট (Targeted) অডিয়েন্স" },
                { icon: TrendingUp, text: "ব্র্যান্ড ভিজিবিলিটি বৃদ্ধি" },
                { icon: Zap, text: "দ্রুত রিচ ও এনগেজমেন্ট" },
                { icon: DollarSign, text: "কম খরচে কার্যকর প্রচারণা" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20">
                  <item.icon className="h-6 w-6 text-amber-400" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Advertisement Types */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">বিজ্ঞাপনের ধরন</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Website Banner Ads",
              items: ["হোমপেজ ব্যানার", "সাইডবার ব্যানার", "আর্টিকেল ইন-ব্যানার"],
              icon: MonitorPlay,
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              title: "Sponsored Content",
              items: ["আপনার ব্র্যান্ড বা সার্ভিস নিয়ে আর্টিকেল প্রকাশ", "SEO-friendly কন্টেন্ট"],
              icon: PenTool,
              color: "text-purple-600",
              bg: "bg-purple-50"
            },
            {
              title: "Social Media Promotion",
              items: ["Facebook & Instagram পোস্ট", "Boosted ক্যাম্পেইন"],
              icon: Share2,
              color: "text-pink-600",
              bg: "bg-pink-50"
            },
            {
              title: "Featured Promotion",
              items: ["বিশেষভাবে হাইলাইট করা পোস্ট", "গুরুত্বপূর্ণ নোটিশ"],
              icon: Star,
              color: "text-amber-600",
              bg: "bg-amber-50"
            },
          ].map((type, idx) => (
            <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${type.bg} ${type.color}`}>
                <type.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-bold text-slate-900">{type.title}</h3>
              <ul className="space-y-2">
                {type.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Who can advertise & Pricing */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
              <Briefcase className="h-6 w-6 text-slate-600" />
              কারা বিজ্ঞাপন দিতে পারবেন?
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "EdTech প্ল্যাটফর্ম",
                "কোচিং সেন্টার",
                "অনলাইন কোর্স/ট্রেনিং",
                "বই/শিক্ষা সামগ্রী",
                "স্কলারশিপ/ইভেন্ট",
                "অন্যান্য শিক্ষাসংক্রান্ত সার্ভিস"
              ].map((tag, idx) => (
                <span key={idx} className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-amber-50 p-8 ring-1 ring-amber-100">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-amber-900">
              <CreditCard className="h-6 w-6 text-amber-600" />
              বিজ্ঞাপন মূল্য (Customizable)
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3 text-amber-800">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-amber-600" />
                <span className="font-medium">আপনার প্রয়োজন অনুযায়ী আমরা কাস্টম প্যাকেজ অফার করি</span>
              </li>
              <li className="flex gap-3 text-amber-800">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-amber-600" />
                <span className="font-medium">মাসিক / সাপ্তাহিক / ক্যাম্পেইন ভিত্তিক প্ল্যান</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* How to Advertise CTA */}
      <section className="mx-auto mt-20 max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#1a1a1a] text-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16">
              <h2 className="mb-8 text-3xl font-bold">কিভাবে বিজ্ঞাপন দিবেন?</h2>
              <div className="space-y-6">
                {[
                  { num: "১", text: "আমাদের সাথে যোগাযোগ করুন" },
                  { num: "২", text: "আপনার প্রয়োজন ও বাজেট জানান" },
                  { num: "৩", text: "আমরা সেরা প্যাকেজ সাজিয়ে দিবো" },
                  { num: "৪", text: "বিজ্ঞাপন লাইভ করা হবে নির্ধারিত সময়ে" },
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
              <h3 className="mb-2 text-2xl font-bold text-white">যোগাযোগ করুন</h3>
              <p className="mb-6 text-white/90">বিজ্ঞাপন সম্পর্কিত বিস্তারিত জানতে মেইল করুন</p>
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
