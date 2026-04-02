import Image from "next/image"
import Link from "next/link"

const mainStory = {
  image: "https://picsum.photos/seed/hero1/800/480",
  category: "শিক্ষাঙ্গন",
  title: "শিক্ষা বাজেট ২০২৬: সরকারি বিশ্ববিদ্যালয়ে গবেষণা ও বৃত্তিতে বরাদ্দ দ্বিগুণ",
  excerpt:
    "নতুন বাজেট কাঠামোতে সরকারি বিশ্ববিদ্যালয়গুলোর জন্য বৃহত্তর অনুদান তহবিল, ডিজিটাল ক্লাসরুম সম্প্রসারণ এবং প্রত্যন্ত অঞ্চলের শিক্ষার্থীদের জন্য কর্মক্ষমতা ভিত্তিক বৃত্তি চালুর প্রস্তাব করা হয়েছে।",
  time: "১ ঘণ্টা আগে",
}

const secondaryStories = [
  {
    image: "https://picsum.photos/seed/hero2/500/320",
    category: "ভর্তি পরীক্ষা",
    title: "জাতীয় বিশ্ববিদ্যালয়ে অনার্স ভর্তির বিজ্ঞপ্তি প্রকাশিত হয়েছে",
    time: "২ ঘণ্টা আগে",
  },
  {
    image: "https://picsum.photos/seed/hero3/500/320",
    category: "কর্মজীবন",
    title: "বিসিএস প্রিলি পরীক্ষার নতুন সিলেবাস ও নম্বরবণ্টন প্রকাশ",
    time: "৩ ঘণ্টা আগে",
  },
]

const sidebarLatest = [
  { title: "ঢাকা বিশ্ববিদ্যালয়ে প্রতিষ্ঠাবার্ষিকীর অনুষ্ঠান শুরু", time: "৩০ মিনিট আগে" },
  { title: "মাধ্যমিক পর্যায়ে বিনামূল্যে ডিজিটাল বই বিতরণ", time: "১ ঘণ্টা আগে" },
  { title: "বেসরকারি বিশ্ববিদ্যালয়ের টিউশন ফি নিয়ন্ত্রণে নতুন আইন", time: "২ ঘণ্টা আগে" },
  { title: "আন্তর্জাতিক বৃত্তির জন্য আবেদন শুরু ৫ এপ্রিল", time: "৩ ঘণ্টা আগে" },
  { title: "প্রাথমিক বিদ্যালয়ে শিক্ষক সংকট নিরসনে পদক্ষেপ নিচ্ছে সরকার", time: "৪ ঘণ্টা আগে" },
  { title: "শিক্ষার্থীদের মানসিক স্বাস্থ্য সুরক্ষায় নতুন প্রকল্প চালু", time: "৫ ঘণ্টা আগে" },
]

export function HeroSection() {
  return (
    <section className="mt-3 grid gap-3 lg:grid-cols-[1fr_260px]">
      {/* Left: main big story + two secondary */}
      <div className="grid gap-3">
        {/* Main featured */}
        <article className="group overflow-hidden rounded bg-white shadow-sm">
          <Link href="/news/education-budget-2026" className="block">
            <div className="relative overflow-hidden">
              <Image
                src={mainStory.image}
                alt={mainStory.title}
                width={800}
                height={480}
                priority
                className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded bg-[#c79a1d] px-2 py-0.5 text-xs font-bold text-white">
                {mainStory.category}
              </span>
            </div>
            <div className="p-3">
              <h1 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-[#b38716] md:text-2xl">
                {mainStory.title}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-2">{mainStory.excerpt}</p>
              <p className="mt-2 text-xs text-slate-400">{mainStory.time}</p>
            </div>
          </Link>
        </article>

        {/* Two secondary stories */}
        <div className="grid gap-3 sm:grid-cols-2">
          {secondaryStories.map((story) => (
            <article key={story.title} className="group overflow-hidden rounded bg-white shadow-sm">
              <Link href="/news" className="block">
                <div className="relative overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={500}
                    height={320}
                    className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-2 top-2 rounded bg-[#c79a1d] px-2 py-0.5 text-xs font-bold text-white">
                    {story.category}
                  </span>
                </div>
                <div className="p-2.5">
                  <h2 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-[#b38716] md:text-base">
                    {story.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{story.time}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="flex flex-col gap-3">
        {/* Latest news list */}
        <div className="rounded bg-white shadow-sm">
          <div className="border-b-2 border-[#c79a1d] px-3 py-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">সর্বশেষ সংবাদ</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {sidebarLatest.map((item) => (
              <li key={item.title}>
                <Link href="/news" className="group flex gap-2 p-3 hover:bg-slate-50">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c79a1d]" />
                  <div>
                    <p className="text-sm leading-snug text-slate-800 group-hover:text-[#b38716]">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social subscribe box */}
        <div className="rounded bg-[#1f1f1f] p-3 text-white">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300">আমাদের অনুসরণ করুন</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Facebook", bg: "bg-[#1877f2]", icon: "f" },
              { label: "YouTube", bg: "bg-[#ff0000]", icon: "▶" },
              { label: "Twitter / X", bg: "bg-black", icon: "𝕏" },
              { label: "Instagram", bg: "bg-[#e1306c]", icon: "📷" },
            ].map((s) => (
              <button key={s.label} className={`${s.bg} flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-semibold text-white`}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </section>
  )
}
