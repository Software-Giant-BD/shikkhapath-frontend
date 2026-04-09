import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";

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
  category: "শিক্ষাঙ্গন",
  title: "এনএসপিতে রুমিন ফারহানা, জুনায়েদ-রাফিসহ অর্ধশত জুলাইয়ের পরিচিত মুখ যোগ দেওয়ার গুঞ্জন",
  excerpt:
    "জাতীয় নাগরিক পার্টিতে (এনএসপি) যোগ দেওয়ার গুঞ্জন উঠেছে স্বতন্ত্র সংসদ সদস্য রুমিন ফারহানা, ছাত্র আন্দোলনের সমন্বয়ক আলী আহসান জুনায়েদসহ অনেকে যারা জুলাই বিপ্লবে রাজপথে সাহসী ভূমিকা রেখেছিলেন।",
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
      {/* Left Column: Card-styled trend list */}
      <aside className="hidden flex-col gap-3 lg:flex">
        {leftStories.map((story, i) => (
          <article key={i} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <Link href="/news" className="flex flex-col gap-2 p-2">
              <div className="overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                <Image
                  src={story.image}
                  alt=""
                  width={240}
                  height={160}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 py-1">
                <h3 className="line-clamp-3 text-[14px] font-bold leading-snug text-slate-900 group-hover:text-[#b38716] transition-colors">
                  {story.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}

        {/* Ad Slot in Left Column */}
        <div className="mt-2 flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-inner flex flex-col items-center justify-center min-h-[180px] group transition-all hover:bg-white hover:shadow-md">
            <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-widest text-slate-300">Advertisement</span>
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                 <div className="h-6 w-6 rounded bg-slate-200 animate-pulse" />
              </div>
              <p className="text-[11px] font-bold text-slate-400">আপনার বিজ্ঞাপন এখানে দিন</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Center Column: Box-styled Highlight + Sub-grid */}
      <div className="flex flex-col gap-5">
        {/* Main Highlight Story - CENTERED & BEAUTIFIED */}
        <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl">
          <Link href="/news" className="flex flex-col">
            <div className="relative overflow-hidden">
              <Image
                src={mainStory.image}
                alt={mainStory.title}
                width={800}
                height={480}
                priority
                className="aspect-video w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
                 <span className="rounded-full bg-white/95 px-5 py-1.5 text-[13px] font-black uppercase tracking-widest text-slate-900 shadow-xl backdrop-blur-sm ring-1 ring-slate-200/50">
                    {mainStory.category}
                 </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center gap-3 p-6 lg:p-7">
              <h1 className="text-xl font-[900] leading-snug tracking-tight text-slate-900 group-hover:text-[#b38716] transition-colors md:text-2xl lg:text-[28px] px-2">
                {mainStory.title}
              </h1>
              
              {/* Decorative Separator */}
              <div className="flex items-center gap-4 justify-center">
                 <div className="h-[2px] w-6 rounded-full bg-slate-100" />
                 <div className="h-1.5 w-1.5 rounded-full bg-[#c79a1d] shadow-[0_0_8px_rgba(199,154,29,0.3)]" />
                 <div className="h-[2px] w-6 rounded-full bg-slate-100" />
              </div>

              <p className="line-clamp-3 text-[14px] md:text-[15px] leading-relaxed text-slate-600 max-w-xl font-medium">
                {mainStory.excerpt}
              </p>
              
              <div className="flex items-center gap-2 justify-center bg-slate-50 px-4 py-1.5 rounded-full ring-1 ring-slate-100">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{mainStory.time}</p>
              </div>
            </div>
          </Link>
        </article>

        {/* 2-Column Grid of Box-styled mini-stories */}
        <div className="grid gap-4 sm:grid-cols-2">
          {centerGridStories.map((story, i) => (
            <article key={i} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Link href="/news" className="flex gap-3 p-2.5">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner sm:h-20 sm:w-28">
                  <Image
                    src={story.image}
                    alt=""
                    width={150}
                    height={100}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="line-clamp-3 text-[13px] font-bold leading-tight text-slate-900 group-hover:text-[#b38716] transition-colors">
                  {story.title}
                </h4>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <aside className="flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#600000] p-4 text-white shadow-xl group">
          <div className="absolute top-0 right-0 p-1.5 bg-white/10 rounded-bl-xl text-[9px] uppercase tracking-widest font-black opacity-60">Ad</div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-black leading-tight border-b border-white/10 pb-2">৬ষ্ঠ-১০ম শ্রেণি</h4>
            <div className="space-y-1">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">প্রগ্রেসিভ ব্যাচ ২০২৬</p>
                <div className="flex h-10 items-center justify-center rounded-xl bg-white font-black text-[#600000] shadow-lg transition-transform hover:scale-[1.02]">শুরু: ১২ এপ্রিল</div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg">
           <div className="relative overflow-hidden">
             <Image 
               src="https://picsum.photos/seed/v1/400/225" 
               alt="Video thumb" 
               width={400} 
               height={225} 
               className="aspect-video w-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
              />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-white/20 transition-all group-hover:scale-110 group-hover:bg-red-700">
                 <Play className="h-7 w-7 ml-1 fill-current" />
               </div>
             </div>
           </div>
           <div className="p-4">
             <h5 className="text-[15px] font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-red-600 transition-colors">খুব খারাপ সময় পার করেছি একসময়: ঢাবি উপাচার্য</h5>
           </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-50">
           <div className="flex flex-col items-center text-center gap-4">
             <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full ring-1 ring-red-100">
               <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Live Updates</span>
             </div>
             <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">SUBSCRIBE</h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed px-4">আমাদের ইউটিউব চ্যানেলে নিয়মিত আপডেট পেতে সাবস্ক্রাইব করুন</p>
             </div>
             <button className="w-full rounded-2xl bg-red-600 py-3.5 text-sm font-black text-white shadow-xl shadow-red-200 transition-all hover:bg-red-700 hover:shadow-red-300 active:scale-95">
                Visit Channel
             </button>
           </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-44 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-3 transition-all hover:bg-white hover:shadow-md">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Sponsored</span>
              <div className="h-24 w-44 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </aside>
    </section>
  );
}
