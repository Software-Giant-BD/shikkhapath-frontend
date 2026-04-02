"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const tabs = [
  {
    label: "শিক্ষার খবর",
    stories: [
      { image: "https://picsum.photos/seed/tab1a/300/200", title: "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ডের নতুন সিলেবাস চূড়ান্ত", time: "১ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab1b/300/200", title: "মাধ্যমিক পরীক্ষায় এমসিকিউ কমানোর সুপারিশ বিশেষজ্ঞ কমিটির", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab1c/300/200", title: "পিইসি পরীক্ষা বাতিলের পর প্রাথমিক মূল্যায়ন পদ্ধতি বদলানো হচ্ছে", time: "৩ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab1d/300/200", title: "দেশের সরকারি কলেজগুলোতে মাল্টিমিডিয়া ক্লাসরুম স্থাপন হবে", time: "৪ ঘণ্টা আগে" },
    ],
  },
  {
    label: "ট্যাবলয়েড",
    stories: [
      { image: "https://picsum.photos/seed/tab2a/300/200", title: "ক্যাম্পাস তারকা: সাধারণ পরিবার থেকে গোল্ড মেডেল জয়", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab2b/300/200", title: "হলে সিট সংকট: শিক্ষার্থীরা ঘুমাচ্ছেন ক্লাসঘরে", time: "৩ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab2c/300/200", title: "ভার্সিটির ক্যান্টিনে এখন ৩০ টাকায় পুষ্টিকর লাঞ্চ", time: "৫ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab2d/300/200", title: "মার্কশিটের বদলে দক্ষতার সনদ চাইছে নিয়োগদাতারা", time: "৬ ঘণ্টা আগে" },
    ],
  },
  {
    label: "মুক্তমত",
    stories: [
      { image: "https://picsum.photos/seed/tab3a/300/200", title: "শিক্ষায় বিনিয়োগ না বাড়ালে উন্নয়ন টেকসই হবে না — ড. করিম", time: "১ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab3b/300/200", title: "মুক্তচিন্তার বিশ্ববিদ্যালয় ছাড়া জাতির মুক্তি নেই", time: "৪ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab3c/300/200", title: "পাবলিক বিশ্ববিদ্যালয়ের স্বায়ত্তশাসন কতটা নিশ্চিত?", time: "৬ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/tab3d/300/200", title: "প্রযুক্তির যুগে শিক্ষক কি শুধু সহায়ক ভূমিকায়?", time: "৮ ঘণ্টা আগে" },
    ],
  },
]

export function TabSectionBlock() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="mt-5">
      {/* Tab bar */}
      <div className="flex border-b-2 border-[#c79a1d]">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === i
                ? "bg-[#c79a1d] text-white"
                : "bg-white text-slate-700 hover:bg-amber-50 hover:text-[#b38716]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 bg-white" />
        <Link href="/news" className="flex items-center bg-white px-3 text-xs font-semibold text-[#b38716] hover:underline">
          আরও দেখুন »
        </Link>
      </div>

      {/* Tab content */}
      <div className="grid gap-3 bg-white p-3 sm:grid-cols-2 md:grid-cols-4">
        {tabs[activeTab].stories.map((story) => (
          <article key={story.title} className="group">
            <Link href="/news" className="block">
              <div className="overflow-hidden rounded">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={300}
                  height={200}
                  className="w-full aspect-3/2 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#b38716] line-clamp-2">
                {story.title}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{story.time}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
