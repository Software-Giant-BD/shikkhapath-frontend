import Image from "next/image"
import Link from "next/link"

import { VIDEO_STORIES } from "@/components/customer/home/home-content.data"
import { SectionHeader } from "@/components/customer/home/section-header"

export function VideoSectionBlock() {
  return (
    <section className="mt-5">
      <SectionHeader title="ভিডিও" href="/news?category=video" />

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
