import Link from "next/link"

import type { HomePageCategoryNewsSection } from "@/lib/api/home-page-category-news"
import { SectionHeader } from "@/components/customer/home/section-header"

interface Props {
  sectionData: HomePageCategoryNewsSection
  compact?: boolean
}

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]

function toBanglaNumber(value: number) {
  return String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)] ?? digit)
}

function formatRelativePublishTime(publishAt: string): string {
  const value = publishAt.trim()
  if (!value) return ""

  const publishedAt = new Date(value)
  if (Number.isNaN(publishedAt.getTime())) return ""

  const diffMs = Date.now() - publishedAt.getTime()
  const isFuture = diffMs < 0
  const totalMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60))

  if (totalMinutes < 1) {
    return isFuture ? "কিছুক্ষণ পর" : "এইমাত্র"
  }

  if (totalMinutes < 60) {
    const amount = toBanglaNumber(totalMinutes)
    return isFuture ? `${amount} মিনিট পর` : `${amount} মিনিট আগে`
  }

  const totalHours = Math.floor(totalMinutes / 60)
  if (totalHours < 24) {
    const amount = toBanglaNumber(totalHours)
    return isFuture ? `${amount} ঘণ্টা পর` : `${amount} ঘণ্টা আগে`
  }

  const totalDays = Math.floor(totalHours / 24)
  if (totalDays < 30) {
    const amount = toBanglaNumber(totalDays)
    return isFuture ? `${amount} দিন পর` : `${amount} দিন আগে`
  }

  const totalMonths = Math.floor(totalDays / 30)
  if (totalMonths < 12) {
    const amount = toBanglaNumber(totalMonths)
    return isFuture ? `${amount} মাস পর` : `${amount} মাস আগে`
  }

  const totalYears = Math.floor(totalDays / 365)
  const amount = toBanglaNumber(totalYears)
  return isFuture ? `${amount} বছর পর` : `${amount} বছর আগে`
}

function getImageUrl(src: string) {
  const value = src.trim()
  if (value) return value
  return "/No_Image_Available.jpg"
}

export function NewsSectionBlock({ sectionData, compact = false }: Props) {
  const featured = sectionData.news[0]

  if (!featured) {
    return null
  }

  const sideItems = sectionData.news.slice(1)
  const sectionHref = `/${encodeURIComponent(sectionData.category.slug)}`

  return (
    <section className={compact ? "mt-0" : "mt-8 mb-4 lowercaseFirst"}>
      <SectionHeader title={sectionData.category.title} href={sectionHref} />

      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "lg:grid-cols-[1.6fr_1fr]"}`}>
        {/* Featured story */}
        <article className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition-all hover:shadow-lg">
          <Link href={`/news/${encodeURIComponent(featured.unique_code)}`} className="flex flex-col">
            <div className="relative overflow-hidden">
              <img
                src={getImageUrl(featured.feature_image_url)}
                alt={featured.title}
                className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-lg bg-[#c79a1d] px-2.5 py-1 text-xs font-bold text-white shadow-xl">
                {sectionData.category.title}
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
            <article key={item.id} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Link href={`/news/${encodeURIComponent(item.unique_code)}`} className="flex gap-4 p-3">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <img
                    src={getImageUrl(item.feature_image_url)}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                  <h4 className="text-[15px] font-bold leading-tight text-slate-900 group-hover:text-[#b38716] line-clamp-3 transition-colors">
                    {item.title}
                  </h4>
                  {item.publish_at ? (
                    <p className="text-[11px] font-bold text-slate-400 tracking-wider">
                      {formatRelativePublishTime(item.publish_at)}
                    </p>
                  ) : null}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
