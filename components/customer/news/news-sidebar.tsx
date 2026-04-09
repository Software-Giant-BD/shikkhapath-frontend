import Image from "next/image";
import Link from "next/link";

const sidebarNews = [
  {
    image: "https://picsum.photos/seed/s1/150/100",
    title: "আইপিএলকে বিদায় বলতে পারেন মহেন্দ্র সিং ধোনি: গুঞ্জন তুঙ্গে",
    time: "১০ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/s2/150/100",
    title: "গুচ্ছভুক্ত ২২ বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষা শুরু হচ্ছে কাল",
    time: "০৯ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/s3/150/100",
    title: "লেবানন পরিস্থিতি নিয়ে জরুরি বৈঠকে বসছে জাতিসংঘ",
    time: "০৯ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/s4/150/100",
    title: "মেট্রোরেলের সময়সূচিতে বড় পরিবর্তনের আভাস",
    time: "০৮ এপ্রিল ২০২৬",
  },
  {
    image: "https://picsum.photos/seed/s5/150/100",
    title: "দেশে নতুন প্রজাতির মাছের সন্ধান পেলেন কৃষি গবেষকরা",
    time: "০৮ এপ্রিল ২০২৬",
  },
];

export function NewsSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      {/* Sidebar Ad 1 */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md">
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src="https://picsum.photos/seed/ad1/400/600"
            alt="Advertisement"
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute top-0 right-0 p-1.5 bg-black/40 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">Ad</div>
        </div>
      </div>

      {/* Standard Sidebar List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">আরও পড়ুন</h3>
        </div>
        <div className="flex flex-col gap-3">
          {sidebarNews.map((news, i) => (
            <article key={i} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Link href="/news/slug" className="flex gap-3 p-2.5">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <Image
                    src={news.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <h4 className="line-clamp-2 text-[13px] font-bold leading-tight text-slate-800 group-hover:text-[#b38716] transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400">{news.time}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Sidebar Ad 2 */}
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:bg-slate-100/50">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sponsored Content</span>
            <div className="h-40 w-full bg-slate-200 rounded-xl animate-pulse" />
            <p className="text-xs font-bold text-slate-500">বিজ্ঞাপনের জন্য যোগাযোগ করুন</p>
        </div>
      </div>
    </aside>
  );
}
