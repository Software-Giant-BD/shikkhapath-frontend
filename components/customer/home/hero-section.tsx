import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

// Expanded sample data to match the density of a premium portal
const leftStories = [
  {
    image: "https://picsum.photos/seed/l1/200/200",
    title: "ছাত্রদল নেতাদের নেতৃত্বে ঢামেকে হামলা, যা রয়েছে সিসিটিভি ফুটেজে",
    time: "১০ মিনিট আগে",
  },
  {
    image: "https://picsum.photos/seed/l2/200/200",
    title: "স্কুল-কলেজে সাপ্তাহিক ছুটি কমছে, নতুন নির্দেশিকা জারি",
    time: "৩০ মিনিট আগে",
  },
  {
    image: "https://picsum.photos/seed/l3/200/200",
    title: "শেরপুর-৩ নির্বাচন: লক্ষাধিক ভোটে জয়ী বিএনপির প্রার্থী",
    time: "১ ঘণ্টা আগে",
  },
  {
    image: "https://picsum.photos/seed/l4/200/200",
    title: "দিনে চলবে মাত্র ১৫টি জাহাজ, হরমুজ প্রণালীতে নতুন নিয়ম আরোপ করল ইরান",
    time: "২ ঘণ্টা আগে",
  },
];

const mainStory = {
  image: "https://picsum.photos/seed/m1/800/480",
  title: "এনএসপিতে রুমিন ফারহানা, জুনায়েদ-রাফিসহ অর্ধশত জুলাইয়ের পরিচিত মুখ যোগ দেওয়ার গুঞ্জন",
  excerpt:
    "জাতীয় নাগরিক পার্টিতে (এনএসপি) যোগ দেওয়ার গুঞ্জন উঠেছে স্বতন্ত্র সংসদ সদস্য রুমিন ফারহানা, ছাত্র আন্দোলনের সমন্বয়ক আলী আহসান জুনায়েদসহ অনেকে...",
  time: "১ ঘণ্টা আগে",
};

const centerGridStories = [
  {
    image: "https://picsum.photos/seed/c1/300/200",
    title: "ঢাকা লিগে এবারও থাকছে না বিদেশি ক্রিকেটার",
  },
  {
    image: "https://picsum.photos/seed/c2/300/200",
    title: "ভুটান ব্যবসাকে কেন্দ্র করে দুই গ্রুপের সংঘর্ষে মাদরাসাছাত্র গুলিবিদ্ধ",
  },
  {
    image: "https://picsum.photos/seed/c3/300/200",
    title: "পৌর নির্বাচনে থাকছে না দলীয় প্রতীক",
  },
  {
    image: "https://picsum.photos/seed/c4/300/200",
    title: "লেবাননের সঙ্গে সরাসরি আলোচনার নির্দেশ দিলেন নেতানিয়াহু",
  },
  {
    image: "https://picsum.photos/seed/c5/300/200",
    title: "রাজধানীর যে দুই পাশে চালু হল 'কুরেল বাস'",
  },
  {
    image: "https://picsum.photos/seed/c6/300/200",
    title: "দেশের ১৯ জেলায় ঝড়ের আভাস",
  },
  {
    image: "https://picsum.photos/seed/c7/300/200",
    title: "পশ্চিম তীরে ইতিহাসে সবচেয়ে বড় বসতি স্থাপনের অনুমোদন দিল ইসরায়েল",
  },
  {
    image: "https://picsum.photos/seed/c8/300/200",
    title: "সংরক্ষিত নারী আসনে বিএনপির মনোনয়নপত্র বিক্রয় শুরু কাল",
  },
];

export function HeroSection() {
  return (
    <section className="mt-4 grid gap-5 lg:grid-cols-[240px_1fr_260px]">
      {/* Left Column: Vertical mini-list */}
      <aside className="hidden flex-col gap-4 lg:flex">
        {leftStories.map((story, i) => (
          <article key={i} className="group border-b border-slate-100 pb-3 last:border-0">
            <Link href="/news" className="flex flex-col gap-2">
              <div className="overflow-hidden rounded-md bg-slate-100">
                <Image
                  src={story.image}
                  alt=""
                  width={240}
                  height={160}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="line-clamp-3 text-[15px] font-bold leading-snug text-slate-900 group-hover:text-[#b38716]">
                {story.title}
              </h3>
            </Link>
          </article>
        ))}
        {/* Mock Ad placement inside left column */}
        <div className="mt-2 h-40 w-full rounded-lg bg-slate-50 flex items-center justify-center border border-dashed border-slate-200">
           <span className="text-xs text-slate-400">বিজ্ঞাপন</span>
        </div>
      </aside>

      {/* Center Column: Highlight + Sub-grid */}
      <div className="flex flex-col gap-6 border-slate-200 lg:border-x lg:px-5">
        {/* Main Highlight Story */}
        <article className="group">
          <Link href="/news" className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-200/10">
              <Image
                src={mainStory.image}
                alt={mainStory.title}
                width={800}
                height={480}
                priority
                className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-extrabold leading-tight text-slate-900 group-hover:text-[#b38716] md:text-2xl lg:text-3xl">
                {mainStory.title}
              </h1>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                {mainStory.excerpt}
              </p>
              <p className="text-xs font-semibold text-slate-400">{mainStory.time}</p>
            </div>
          </Link>
        </article>

        {/* 2-Column Grid for Sub-stories */}
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:pt-4">
          {centerGridStories.map((story, i) => (
            <article key={i} className="group flex gap-3 border-b border-slate-50 pb-4 last:border-0">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-20 sm:w-28">
                <Image
                  src={story.image}
                  alt=""
                  width={150}
                  height={100}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h4 className="line-clamp-3 text-sm font-bold leading-tight text-slate-900 group-hover:text-[#b38716]">
                {story.title}
              </h4>
            </article>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar (Ads / Video / Subscribe) */}
      <aside className="flex flex-col gap-6">
        {/* Ad Space 1 */}
        <div className="relative overflow-hidden rounded-xl bg-[#600000] p-4 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-1 bg-white/10 rounded-bl text-[9px] uppercase tracking-widest">Ad</div>
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-black leading-tight">৬ষ্ঠ-১০ম শ্রেণি</h4>
            <p className="text-xs font-bold text-amber-300">প্রগ্রেসিভ ব্যাচ ২০২৩</p>
            <div className="inline-block rounded bg-white py-1.5 text-center font-bold text-[#600000]">শুরু: ১২ এপ্রিল</div>
          </div>
        </div>

        {/* Video Player Placeholder */}
        <div className="group relative overflow-hidden rounded-xl bg-slate-100 shadow-md">
           <Image 
             src="https://picsum.photos/seed/v1/400/225" 
             alt="Video thumb" 
             width={400} 
             height={225} 
             className="aspect-video w-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
            />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl ring-4 ring-white/20 transition-transform group-hover:scale-110">
               <Play className="h-6 w-6 ml-1 fill-current" />
             </div>
           </div>
           <div className="bg-white p-3">
             <h5 className="text-sm font-bold leading-tight line-clamp-2">খুব খারাপ সময় পার করেছি একসময়: ঢাবি উপাচার্য</h5>
           </div>
        </div>

        {/* Newsletter/Subscribe Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
           <div className="flex flex-col items-center text-center gap-3">
             <div className="flex items-center gap-1 text-red-600">
               <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
             </div>
             <h4 className="text-xl font-bold text-slate-900">SUBSCRIBE</h4>
             <p className="text-xs text-slate-500">আমাদের ইউটিউব চ্যানেলে নিয়মিত আপডেট পেতে সাবস্ক্রাইব করুন</p>
             <button className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95">
                Visit Channel
             </button>
           </div>
        </div>

        {/* Bottom Small Ad */}
        <div className="h-40 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sponsered</span>
            <div className="h-24 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
      </aside>
    </section>
  );
}
