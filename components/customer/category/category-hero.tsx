import Image from "next/image";
import Link from "next/link";

const heroStories = [
  {
    image: "https://picsum.photos/seed/cat1/800/600",
    title: "পরপরের সঙ্গে ব্রিলিয়ান্ট স্মৃতির সম্পর্ক নিয়ে নতুন গুঞ্জন",
    time: "৫২ মিনিট আগে",
    isLarge: true,
  },
  {
    image: "https://picsum.photos/seed/cat2/400/300",
    title: "অক্ষয় 'টয়লেট ২' নিয়ে আশাবাদী: প্রীতি জিনতার সাথে দীর্ঘ দিন পর ফিরছেন",
    excerpt: "তৈরি হতে চলছে 'টয়লেট: এক প্রেম কথা'র সিক্যুয়েল। অনেক দিন পরে পর্দায় ফিরতে পারেন বলিউডের এই সুপারহিট জুটি।",
    time: "১ ঘণ্টা আগে",
  },
];

const smallGridStories = [
  {
    image: "https://picsum.photos/seed/cs1/300/200",
    title: "একটি যুদ্ধ আমাদের এক একর করে দিয়েছে",
    time: "৩ ঘণ্টা আগে",
  },
  {
    image: "https://picsum.photos/seed/cs2/300/200",
    title: "মৌসুমী- ওমর সানির প্রেম আজও অম্লান: ৩০ বছর আগের অপ্রকাশিত ছবি",
    time: "৫ ঘণ্টা আগে",
  },
  {
    image: "https://picsum.photos/seed/cs3/300/200",
    title: "এক বছরের ছোট গায়িকা মাহিনের সাথে প্রেম করছেন গায়ক মাঈনুল",
    time: "৬ ঘণ্টা আগে",
  },
];

export function CategoryHero() {
  const main = heroStories[0];
  const secondary = heroStories[1];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Left Highlight */}
      <div className="flex flex-col gap-6">
        <article className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg">
          <Link href="/news/sample-slug" className="flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={main.image}
                alt={main.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h2 className="text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl group-hover:text-amber-400 transition-colors">
                  {main.title}
                </h2>
                <p className="mt-2 text-xs font-bold text-white/70 uppercase tracking-widest">{main.time}</p>
              </div>
            </div>
          </Link>
        </article>

        <div className="grid gap-6 sm:grid-cols-2">
           {smallGridStories.slice(0, 2).map((item, i) => (
             <article key={i} className="group flex flex-col gap-3">
               <Link href="/news/sample-slug" className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-100">
                  <Image fill src={item.image} alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" />
               </Link>
               <div>
                  <h3 className="text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-[#c00000] transition-colors">{item.title}</h3>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">{item.time}</p>
               </div>
             </article>
           ))}
        </div>
      </div>

      {/* Right List Area */}
      <div className="flex flex-col gap-6">
        <article className="group flex flex-col gap-4 border-b border-slate-100 pb-6">
          <Link href="/news/sample-slug" className="relative aspect-video overflow-hidden rounded-xl">
             <Image fill src={secondary.image} alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </Link>
          <div className="space-y-2">
            <h3 className="text-lg font-bold leading-tight group-hover:text-[#c00000] transition-colors">{secondary.title}</h3>
            <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2">{secondary.excerpt}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{secondary.time}</p>
          </div>
        </article>
        
        <div className="flex flex-col gap-4">
           {smallGridStories.slice(2).map((item, i) => (
             <article key={i} className="group flex gap-3 items-center">
               <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image fill src={item.image} alt="" className="object-cover" />
               </div>
               <div>
                  <h4 className="text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-[#c00000]">{item.title}</h4>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">{item.time}</p>
               </div>
             </article>
           ))}
        </div>
      </div>
    </div>
  );
}
