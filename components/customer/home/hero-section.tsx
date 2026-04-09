import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ChevronRight } from "lucide-react";

// Expanded sample data for news stories
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

const featuredStories = [
  {
    image: "https://picsum.photos/seed/m1/800/480",
    category: "শিক্ষাঙ্গন",
    title: "এনএসপিতে রুমিন ফারহানা, জুনায়েদ-রাফিসহ অর্ধশত জুলাইয়ের পরিচিত মুখ যোগ দেওয়ার গুঞ্জন",
    excerpt: "জাতীয় নাগরিক পার্টিতে যোগ দেওয়ার গুঞ্জন উঠেছে স্বতন্ত্র সংসদ সদস্য রুমিন ফারহানা ও ছাত্রদের সমন্বয়কদের।",
    time: "১ ঘণ্টা আগে",
  },
  {
    image: "https://picsum.photos/seed/m2/800/480",
    category: "জাতীয়",
    title: "ঢাকা বিশ্ববিদ্যালয়ে আন্তর্জাতিক সম্মেলন অনুষ্ঠিত: গবেষণায় নতুন দিগন্তের উন্মোচন",
    excerpt: "বিশ্ববিদ্যালয় পর্যায়ে উচ্চতর গবেষণা ও আন্তর্জাতিক সহযোগিতা বৃদ্ধির লক্ষে এই সম্মেলনের আয়োজন করা হয়েছে।",
    time: "২ ঘণ্টা আগে",
  },
];

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

// Service Utility Hub Data
const utilitySections = [
  {
    name: "🚨 Emergency",
    color: "bg-red-50 text-red-600 border-red-100",
    links: [
      { label: "Ambulance 🚑", href: "#" },
      { label: "Police 👮", href: "#" },
      { label: "Fire 🚒", href: "#" },
      { label: "Blood 🩸", href: "#" },
      { label: "Doctor 🏥", href: "#" },
    ],
  },
  {
    name: "💳 Services",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    links: [
      { label: "Bill Pay", href: "#" },
      { label: "Mobile Recharge 📱", href: "#" },
      { label: "Train 🚆", href: "#" },
      { label: "Gold Rate", href: "#" },
      { label: "Dollar Rate 💵", href: "#" },
    ],
  },
  {
    name: "🎓 Education",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    links: [
      { label: "Campus", href: "#" },
      { label: "Jobs", href: "#" },
      { label: "SSC (রুটিন | রেজাল্ট)", href: "#" },
      { label: "HSC (রুটিন | রেজাল্ট)", href: "#" },
      { label: "Admission", href: "#" },
    ],
  },
  {
    name: "🏫 Uni & Medical",
    color: "bg-green-50 text-green-600 border-green-100",
    links: [
      { label: "University Events", href: "#" },
      { label: "Medical News", href: "#" },
    ],
  },
  {
    name: "🛠 Tools",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    links: [
      { label: "CGPA Calculator", href: "#" },
      { label: "নামাজের সময়", href: "#" },
    ],
  },
  {
    name: "📰 জাতীয় খবর",
    color: "bg-slate-50 text-slate-600 border-slate-100",
    links: [
      { label: "Breaking News", href: "#" },
      { label: "সর্বশেষ খবর", href: "#" },
      { label: "দেশের পরিস্থিতি", href: "#" },
      { label: " রাজনীতি", href: "#" },
    ],
  },
];

export function HeroSection() {
  return (
    <section className="mt-4 grid gap-5 lg:grid-cols-[240px_1fr_280px]">
      {/* Left Column: Card-styled trend list */}
      <aside className="hidden flex-col gap-3 lg:flex">
        {leftStories.map((story, i) => (
          <article key={i} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <Link href="/news/sample-slug" className="flex flex-col gap-2 p-2">
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
      </aside>

      {/* Center Column */}
      <div className="flex flex-col gap-5">
        {/* Dual Highlight Area */}
        <div className="grid gap-5 sm:grid-cols-2">
          {featuredStories.map((story, i) => (
            <article key={i} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl">
              <Link href="/news/sample-slug" className="flex flex-col h-full">
                <div className="relative overflow-hidden shrink-0">
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={500}
                    height={300}
                    priority
                    className="aspect-video w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
                     <span className="rounded-full bg-white/95 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50">
                        {story.category}
                     </span>
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col items-center text-center gap-3 p-5 lg:p-6 pb-4">
                  <h2 className="text-lg font-black leading-tight tracking-tight text-slate-900 group-hover:text-[#b38716] transition-colors md:text-xl lg:text-[22px] line-clamp-2 px-1">
                    {story.title}
                  </h2>
                  
                  <div className="flex items-center gap-3 justify-center">
                     <div className="h-[1.5px] w-5 rounded-full bg-slate-100" />
                     <div className="h-1 w-1 rounded-full bg-[#c79a1d]" />
                     <div className="h-[1.5px] w-5 rounded-full bg-slate-100" />
                  </div>

                  <p className="line-clamp-2 text-[13px] md:text-[14px] leading-relaxed text-slate-600 font-medium">
                    {story.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-1.5 justify-center bg-slate-50 px-3 py-1 rounded-full ring-1 ring-slate-100">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{story.time}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* 2-Column Grid of mini-stories */}
        <div className="grid gap-4 sm:grid-cols-2">
          {centerGridStories.map((story, i) => (
            <article key={i} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Link href="/news/sample-slug" className="flex gap-3 p-2.5">
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

      {/* Right Column: Service Utility Hub */}
      <aside className="flex flex-col gap-4">
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-50">
           {/* Hub Header */}
           <div className="bg-slate-900 px-5 py-4 text-center">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">Hub & Services</h4>
              <p className="text-[13px] font-bold text-white mt-0.5">প্রয়োজনীয় লিংক ও সেবা</p>
           </div>

           <div className="flex flex-col p-2 gap-2">
              {utilitySections.map((section, idx) => (
                 <div key={idx} className="flex flex-col gap-1.5">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${section.color} transition-all`}>
                       <span className="text-[13px] font-black tracking-tight">{section.name}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 px-1 mb-2">
                       {section.links.map((link, lIdx) => (
                          <Link 
                            key={lIdx} 
                            href={link.href}
                            className="group flex items-center justify-between px-3 py-2 rounded-lg text-[12.5px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                          >
                             <span className="line-clamp-1">{link.label}</span>
                             <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-0.5" />
                          </Link>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
           
           {/* Hub Footer */}
           <div className="border-t border-slate-50 bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400">আপডেট পেতে সাথে থাকুন</p>
           </div>
        </div>

        {/* Small Ad Slot at the bottom of Hub */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-inner flex flex-col items-center justify-center min-h-[100px] group transition-all hover:bg-white hover:shadow-md">
           <span className="absolute top-2 right-3 text-[8px] font-black uppercase tracking-widest text-slate-300">Space available</span>
           <p className="text-[10px] font-bold text-slate-400">বিজ্ঞাপন দিতে যোগাযোগ করুন</p>
        </div>
      </aside>
    </section>
  );
}
