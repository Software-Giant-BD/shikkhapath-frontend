import Image from "next/image"
import Link from "next/link"

import { type HeroNewsItem } from "@/lib/api/news"
import { SectionHeader } from "@/components/customer/home/section-header"

interface VideoSectionBlockProps {
  data: HeroNewsItem[]
}

export function VideoSectionBlock({ data }: VideoSectionBlockProps) {
  if (!data || data.length === 0) return null

  return (
    <section className="mt-5">
      <SectionHeader title="ভিডিও" href="/news?category=video" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {data.map((video) => (
          <Link
            key={video.id}
            href={`/news/${video.url_slug}`}
            className="group block overflow-hidden rounded bg-white shadow-sm"
          >
            <div className="relative">
              <Image
                src={video.youtube_thumbnail_url || video.feature_image_url || "/placeholder-news.jpg"}
                alt={video.title}
                width={400}
                height={230}
                className="aspect-video w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-transform group-hover:scale-110">
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
