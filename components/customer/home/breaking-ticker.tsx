import Link from "next/link"

type BreakingNewsItem = {
  id: string
  title: string
  url_slug: string
}

const FALLBACK_ITEMS: BreakingNewsItem[] = [
  {
    id: "fallback-1",
    title: "ভর্তি পরীক্ষার গাইডেন্স পোর্টাল চালু হয়েছে — আবেদনের শেষ তারিখ ১৫ এপ্রিল",
    url_slug: "sample-slug",
  },
  {
    id: "fallback-2",
    title: "মেডিকেল ভর্তি পরীক্ষা ১৫ মে অনুষ্ঠিত হবে",
    url_slug: "sample-slug",
  },
  {
    id: "fallback-3",
    title: "বুয়েটে ভর্তি আবেদন শুরু ১০ এপ্রিল থেকে",
    url_slug: "sample-slug",
  },
]

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  return fallback
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload

  const root = asObject(payload)
  if (Array.isArray(root.resources)) return root.resources

  const resources = asObject(root.resources)
  const candidates = [
    resources.breaking_news,
    resources.breakingNews,
    resources.news,
    resources.items,
    resources.data,
    root.data,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

function normalizeBreakingNews(value: unknown): BreakingNewsItem | null {
  const item = asObject(value)
  const urlSlug = asString(item.url_slug ?? item.urlSlug ?? item.slug).trim()
  const title = asString(item.title).trim()

  if (!title || !urlSlug) {
    return null
  }

  return {
    id: asString(item.id, `${urlSlug}-${title}`),
    title,
    url_slug: urlSlug,
  }
}

async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    return FALLBACK_ITEMS
  }

  try {
    const response = await fetch(`${apiBaseUrl}/breaking-news`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return FALLBACK_ITEMS
    }

    const payload = await response.json().catch(() => null)
    const items = extractList(payload)
      .map(normalizeBreakingNews)
      .filter((item): item is BreakingNewsItem => item !== null)

    return items.length > 0 ? items : FALLBACK_ITEMS
  } catch {
    return FALLBACK_ITEMS
  }
}

export async function BreakingTicker() {
  const items = await getBreakingNews()

  return (
    <div className="flex items-center border-b border-[#e0b22f] bg-white">
      <span className="shrink-0 bg-[#c79a1d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
        সর্বশেষ
      </span>
      <div className="overflow-hidden flex-1 py-1.5 px-3">
        <div
          className="flex gap-12 whitespace-nowrap text-sm text-slate-800 animate-[marquee_30s_linear_infinite]"
          aria-live="polite"
        >
          {[...items, ...items].map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={`/news/${encodeURIComponent(item.url_slug)}`}
              className="shrink-0 hover:text-[#b38716]"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
