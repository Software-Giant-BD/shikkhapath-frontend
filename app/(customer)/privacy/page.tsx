import { Metadata } from "next";
import { 
  ShieldCheck, 
  Database, 
  Target, 
  Cookie, 
  Globe, 
  Lock, 
  Baby, 
  UserCog, 
  RefreshCw, 
  Mail,
  CheckCircle2,
  FileCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | Shikkhapath",
  description: "Shikkhapath এর গোপনীয়তা নীতি সম্পর্কে বিস্তারিত জানুন।",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:max-w-screen-lg lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            🔐 Shikkha Path – গোপনীয়তা নীতি
          </h1>
        </div>

        {/* Introduction */}
        <section className="mb-12 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900">১. ভূমিকা</h2>
          <p className="text-slate-600 leading-relaxed">
            Shikkha Path আপনার গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে, আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Section 2: Data Collection */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Database className="h-5 w-5" />
              </div>
              ২. আমরা কী তথ্য সংগ্রহ করি
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-bold text-slate-800">📌 ব্যক্তিগত তথ্য</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {["নাম", "ইমেইল ঠিকানা", "ফোন নম্বর (যদি প্রদান করা হয়)"].map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-bold text-slate-800">📌 অ-ব্যক্তিগত তথ্য</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {["ব্রাউজার টাইপ", "ডিভাইস তথ্য", "IP ঠিকানা", "ভিজিটের সময় ও পেজ ভিউ"].map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Data Usage */}
          <section className="rounded-3xl bg-slate-900 p-6 shadow-lg sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                <Target className="h-5 w-5" />
              </div>
              ৩. তথ্য ব্যবহারের উদ্দেশ্য
            </h2>
            <p className="mb-4 text-sm text-slate-400">আমরা আপনার তথ্য ব্যবহার করি—</p>
            <ul className="space-y-3">
              {[
                "সাইটের সেবা উন্নত করতে",
                "আপনার সাথে যোগাযোগ করতে",
                "নতুন আপডেট ও নোটিফিকেশন দিতে",
                "নিরাপত্তা ও প্রতারণা প্রতিরোধ করতে"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4: Cookies */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Cookie className="h-5 w-5" />
              </div>
              ৪. Cookies ব্যবহার
            </h2>
            <p className="mb-4 text-sm text-slate-600">Shikkha Path Cookies ব্যবহার করে যাতে—</p>
            <ul className="mb-6 space-y-2 text-sm text-slate-600">
              {["আপনার অভিজ্ঞতা আরও উন্নত হয়", "দ্রুত সাইট লোড হয়", "আপনার পছন্দ সংরক্ষণ করা যায়"].map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-800">
              👉 আপনি চাইলে ব্রাউজার থেকে Cookies বন্ধ করতে পারবেন
            </div>
          </section>

          {/* Section 5: Third-party Services */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Globe className="h-5 w-5" />
              </div>
              ৫. তৃতীয় পক্ষের সেবা
            </h2>
            <p className="mb-4 text-sm text-slate-600">আমরা কিছু তৃতীয় পক্ষের সেবা ব্যবহার করতে পারি, যেমন—</p>
            <ul className="mb-4 space-y-2 text-sm font-semibold text-slate-800">
              <li className="flex gap-2">• Analytics tools</li>
              <li className="flex gap-2">• Advertisement services</li>
            </ul>
            <p className="text-sm text-slate-500 italic">
              এই সেবাগুলো তাদের নিজস্ব গোপনীয়তা নীতির আওতায় তথ্য সংগ্রহ করতে পারে।
            </p>
          </section>

          {/* Small Sections Grid */}
          <div className="col-span-1 lg:col-span-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Section 6: Security */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mb-3 font-bold text-slate-900">৬. তথ্য সুরক্ষা</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                আমরা আপনার তথ্য নিরাপদ রাখতে উপযুক্ত নিরাপত্তা ব্যবস্থা গ্রহণ করি। তবে ইন্টারনেটে ১০০% নিরাপত্তা নিশ্চিত করা সম্ভব নয়।
              </p>
            </section>

            {/* Section 7: Children */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Baby className="h-6 w-6" />
              </div>
              <h2 className="mb-3 font-bold text-slate-900">৭. শিশুদের তথ্য</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Shikkha Path সচেতনভাবে ১৩ বছরের নিচের শিশুদের ব্যক্তিগত তথ্য সংগ্রহ করে পণ্ডিতদের না।
              </p>
            </section>

            {/* Section 9: Policy Changes */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h2 className="mb-3 font-bold text-slate-900">৯. নীতির পরিবর্তন</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                আমরা প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি আপডেট করতে পারি। পরিবর্তন হলে এই পেজে জানানো হবে।
              </p>
            </section>
          </div>

          {/* Section 8: User Rights */}
          <section className="col-span-1 lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <UserCog className="h-5 w-5" />
              </div>
              ৮. ব্যবহারকারীর অধিকার
            </h2>
            <p className="mb-4 text-sm text-slate-600">আপনি চাইলে—</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "আপনার তথ্য দেখতে পারবেন",
                "তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে পারবেন",
                "আমাদের থেকে যোগাযোগ বন্ধ করতে পারবেন"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10 & Consent */}
          <section className="col-span-1 lg:col-span-2 rounded-3xl bg-[#c79a1d] p-8 text-white sm:p-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
              {/* Contact */}
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">১০. যোগাযোগ</h2>
                <p className="mb-6 text-white/90">
                  গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন—
                </p>
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800">
                  <Mail className="h-4 w-4 text-amber-400" />
                  <a href="mailto:support@shikkhapath.com">support@shikkhapath.com</a>
                </div>
              </div>
              
              {/* Consent */}
              <div className="flex flex-col justify-center border-t border-white/20 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">📢 সম্মতি</h2>
                <p className="text-lg font-medium text-white/90 leading-relaxed">
                  Shikkha Path ব্যবহার করার মাধ্যমে আপনি এই গোপনীয়তা নীতিতে সম্মতি প্রদান করছেন।
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
