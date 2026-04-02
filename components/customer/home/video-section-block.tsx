import Image from "next/image"
import Link from "next/link"

const VIDEO_STORIES = [
  { seed: "vid1", title: "শিক্ষার্থীদের প্রতিক্রিয়া: নতুন পাঠ্যক্রম নিয়ে মতামত" },
  { seed: "vid2", title: "ঢাকা বিশ্ববিদ্যালয়ের প্রতিষ্ঠাবার্ষিকীর অনুষ্ঠান সরাসরি" },
  { seed: "vid3", title: "বৃত্তি পাওয়া শিক্ষার্থীদের সাফল্যের গল্প" },
  { seed: "vid4", title: "শিক্ষামন্ত্রীর সাথে একান্ত সাক্ষাৎকার" },
]

export function VideoSectionBlock() {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between border-b-2 border-[#c79a1d] pb-1">
        <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">ভিডিও</h2>
        <Link href="/news?category=video" className="text-xs font-semibold text-[#b38716] hover:underline">
          আরও দেখুন »
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {VIDEO_STORIES.map((video) => (
          <Link
            key={video.seed}
            href="/news?category=video"
            className="group block overflow-hidden rounded bg-white shadow-sm"
          >
            <div className="relative">
              <Image
                src={`https://picsum.photos/seed/${video.seed}/400/230`}
                alt={video.title}
                width={400}
                height={230}
                className="aspect-video w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                  ▶
                </span>
              </span>
            </div>
            <p className="p-2 text-sm font-semibold leading-tight text-slate-900 group-hover:text-[#b38716]">
              {video.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
