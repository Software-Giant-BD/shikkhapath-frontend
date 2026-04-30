import { Metadata } from "next";
import { 
  BookOpenCheck, 
  Target, 
  Scale, 
  ShieldCheck, 
  Clock, 
  FileText, 
  PenTool, 
  RefreshCw, 
  Users, 
  MessageSquare, 
  Scale as LawIcon, 
  Mail 
} from "lucide-react";

export const metadata: Metadata = {
  title: "সম্পাদকীয় নীতি | Shikkhapath",
  description: "Shikkhapath এর সম্পাদকীয় নীতি এবং গাইডলাইন সম্পর্কে বিস্তারিত জানুন।",
};

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:max-w-screen-lg lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <BookOpenCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            Shikkhapath – সম্পাদকীয় নীতি
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Shikkhapath একটি শিক্ষা-ভিত্তিক ডিজিটাল প্ল্যাটফর্ম, যার মূল লক্ষ্য হলো বাংলাদেশের শিক্ষার্থীদের কাছে নির্ভরযোগ্য, সঠিক এবং সময়োপযোগী তথ্য পৌঁছে দেওয়া। আমরা শিক্ষাবিষয়ক খবর, ভর্তি তথ্য, রেজাল্ট, ক্যারিয়ার গাইডলাইন এবং গুরুত্বপূর্ণ আপডেট প্রকাশ করি।
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-12">
          
          {/* Section 2 */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-10">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-700">২</span>
              আমাদের মূল নীতিমালা
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">নির্ভুলতা (Accuracy)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  আমরা সব ধরনের তথ্য প্রকাশের আগে যাচাই করি এবং বিশ্বাসযোগ্য উৎস থেকে সংগ্রহ করি। ভুল তথ্য প্রকাশ না করাই আমাদের প্রধান অঙ্গীকার।
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">নিরপেক্ষতা (Neutrality)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  আমরা কোনো রাজনৈতিক, ধর্মীয় বা ব্যক্তিগত পক্ষপাত ছাড়াই তথ্য প্রকাশ করি। সকল কন্টেন্ট নিরপেক্ষ ও তথ্যভিত্তিক রাখা হয়।
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">বিশ্বাসযোগ্যতা (Credibility)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  আমাদের কন্টেন্ট গবেষণালব্ধ তথ্য ও নির্ভরযোগ্য সোর্সের উপর ভিত্তি করে তৈরি করা হয়, যাতে পাঠক আস্থা রাখতে পারেন।
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">সময়োপযোগিতা (Timeliness)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  শিক্ষা সংক্রান্ত গুরুত্বপূর্ণ আপডেট (রুটিন, রেজাল্ট, ভর্তি বিজ্ঞপ্তি ইত্যাদি) দ্রুত প্রকাশ করা হয়।
                </p>
              </div>
            </div>
          </section>

          {/* Other Sections */}
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Section 3: Content Policy */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
               <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileText className="h-5 w-5" />
                </div>
                ৩. কন্টেন্ট নীতি
              </h2>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>সকল তথ্য পরিষ্কার, সহজ এবং শিক্ষার্থীবান্ধব ভাষায় উপস্থাপন করা হয়</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>ভুয়া বা বিভ্রান্তিকর তথ্য প্রকাশ করা হয় না</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>কপিরাইট আইন মেনে কন্টেন্ট প্রকাশ করা হয়</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>অন্য কোনো উৎস থেকে তথ্য নিলে যথাযথ ক্রেডিট দেওয়া হয়</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>ঘৃণামূলক, বৈষম্যমূলক বা আক্রমণাত্মক কন্টেন্ট প্রকাশ করা হয় না</span>
                </li>
              </ul>
            </section>

            {/* Section 4 & 5: Editorial Freedom & Opinion */}
            <div className="flex flex-col gap-8">
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <PenTool className="h-5 w-5" />
                  </div>
                  ৪. সম্পাদকীয় স্বাধীনতা
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Shikkha Path-এর সম্পাদকীয় টিম সম্পূর্ণ স্বাধীনভাবে কাজ করে। বিজ্ঞাপন বা স্পনসরশিপ কখনোই কন্টেন্ট বা সংবাদ নির্বাচনে প্রভাব ফেলে না।
                </p>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  ৫. মতামত ও তথ্যের পার্থক্য
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>সংবাদ ও তথ্যভিত্তিক কন্টেন্ট এবং ব্যক্তিগত মতামত আলাদা রাখা হয়</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>মতামতধর্মী লেখা হলে তা স্পষ্টভাবে উল্লেখ করা হয়</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Section 6 & 7: Corrections & Contribution */}
            <div className="flex flex-col gap-8">
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                 <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  ৬. তথ্য সংশোধন নীতি
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>কোনো ভুল তথ্য প্রকাশিত হলে তা দ্রুত সংশোধন করা হয়</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>প্রয়োজন হলে আপডেট নোট যোগ করা হয়</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>পাঠকের ফিডব্যাক গুরুত্বসহকারে বিবেচনা করা হয়</span>
                  </li>
                </ul>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Users className="h-5 w-5" />
                  </div>
                  ৭. ব্যবহারকারীর কন্ট্রিবিউশন
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>ব্যবহারকারীরা তাদের লেখা/আর্টিকেল সাবমিট করতে পারবেন</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>কন্টেন্ট প্রকাশের আগে সম্পাদকীয় টিম যাচাই করবে</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>নিম্নমানের বা নীতিমালা বিরোধী কন্টেন্ট বাতিল করা হবে</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Section 8 & 9: Guidelines & Law */}
            <div className="flex flex-col gap-8">
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                 <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Users className="h-5 w-5" />
                  </div>
                  ৮. কমেন্ট ও কমিউনিটি গাইডলাইন
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>অশালীন, স্প্যাম বা অফ-টপিক কমেন্ট অনুমোদিত নয়</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>ব্যক্তিগত আক্রমণ, ঘৃণামূলক বক্তব্য নিষিদ্ধ</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>প্রাসঙ্গিক ও গঠনমূলক আলোচনা উৎসাহিত করা হয়</span>
                  </li>
                </ul>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <LawIcon className="h-5 w-5" />
                  </div>
                  ৯. আইন ও নৈতিকতা
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  আমরা বাংলাদেশের প্রচলিত আইন ও আন্তর্জাতিক সাংবাদিকতার নীতিমালা অনুসরণ করি এবং সবসময় নৈতিক মান বজায় রাখি।
                </p>
              </section>
            </div>
            
          </div>
          
          {/* Section 10: Contact */}
          <section className="rounded-3xl bg-[#c79a1d] p-8 text-white sm:p-12 text-center">
             <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">১০. যোগাযোগ</h2>
              <p className="mb-6 text-white/90">
                সম্পাদকীয় নীতি সম্পর্কে কোনো প্রশ্ন, মতামত বা অভিযোগ থাকলে আমাদের সাথে যোগাযোগ করতে পারেন:
              </p>
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800">
                <Mail className="h-4 w-4 text-amber-400" />
                <a href="mailto:editor@shikkhapath.com">editor@shikkhapath.com</a>
              </div>
          </section>

        </div>
      </div>
    </main>
  );
}
