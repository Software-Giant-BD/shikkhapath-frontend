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
    <section className={compact ? "mt-0" : "mt-8 mb-4 lowercaseFirst"}>
      <SectionHeader title={title} href={href} />

      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "lg:grid-cols-[1.6fr_1fr]"}`}>
        {/* Featured story */}
        <article className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition-all hover:shadow-lg">
          <Link href={href} className="flex flex-col">
            <div className="relative overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                width={800}
                height={480}
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 rounded-lg bg-[#c79a1d] px-2.5 py-1 text-xs font-bold text-white shadow-xl">
                {featured.category}
              </span>
            </div>
            <div className="p-4 md:p-5">
              <h3 className={`font-extrabold leading-snug text-slate-900 group-hover:text-[#b38716] ${compact ? "text-base" : "text-xl md:text-2xl"}`}>
                {featured.title}
              </h3>
              {!compact && (
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600 line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
            </div>
          </Link>
        </article>

        {/* Side list with clean card style */}
        <div className="flex flex-col gap-4">
          {sideItems.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Link href={href} className="flex gap-4 p-3">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                  <h4 className="text-[15px] font-bold leading-tight text-slate-900 group-hover:text-[#b38716] line-clamp-3 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.time}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
