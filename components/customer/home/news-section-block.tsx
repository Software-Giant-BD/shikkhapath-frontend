import Image from "next/image"
import Link from "next/link"

import { SECTION_DATA, type NewsSectionKey } from "@/components/customer/home/home-content.data"
import { SectionHeader } from "@/components/customer/home/section-header"

interface Props {
  section: NewsSectionKey
  compact?: boolean
}

export function NewsSectionBlock({ section, compact = false }: Props) {
  const { title, href, featured, sideItems } = SECTION_DATA[section]

  return (
    <section className={compact ? "mt-0" : "mt-5"}>
      <SectionHeader title={title} href={href} />

      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "lg:grid-cols-[1.6fr_1fr]"}`}>
        {/* Featured story */}
        <article className="group overflow-hidden rounded bg-white shadow-sm">
          <Link href={href} className="block">
            <div className="relative overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                width={600}
                height={380}
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute left-2 top-2 rounded bg-[#c79a1d] px-2 py-0.5 text-xs font-bold text-white">
                {featured.category}
              </span>
            </div>
            <div className="p-3">
              <h3 className={`font-bold leading-snug text-slate-900 group-hover:text-[#b38716] ${compact ? "text-sm md:text-base" : "text-base md:text-lg"}`}>
                {featured.title}
              </h3>
              {!compact && (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-2">{featured.excerpt}</p>
              )}
            </div>
          </Link>
        </article>

        {/* Side list */}
        <div className="flex flex-col gap-2">
          {sideItems.map((item) => (
            <article key={item.title} className="group flex gap-2 overflow-hidden rounded bg-white shadow-sm p-2">
              <Link href={href} className="flex gap-2 w-full">
                <div className="relative w-24 shrink-0 overflow-hidden rounded">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="h-16 w-24 object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#b38716] line-clamp-2">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
