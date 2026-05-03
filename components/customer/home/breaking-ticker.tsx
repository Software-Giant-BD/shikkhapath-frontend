import Link from "next/link"
import { getNewsUrl } from "@/lib/utils"

type BreakingNewsItem = {
  id: string
  title: string
  unique_code: string
  category_slug?: string
  sub_category_slug?: string
}

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
  const urlSlug = asString(item.unique_code ?? item.urlSlug ?? item.slug).trim()
  const title = asString(item.title).trim()

  if (!title || !urlSlug) {
    return null
  }

  return {
    id: asString(item.id, `${urlSlug}-${title}`),
    title,
    unique_code: urlSlug,
    category_slug: asString(item.category_slug ?? null),
    sub_category_slug: asString(item.sub_category_slug ?? null),
  }
}

async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    return []
  }

  try {
    const response = await fetch(`${apiBaseUrl}/breaking-news`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const payload = await response.json().catch(() => null)
    const items = extractList(payload)
      .map(normalizeBreakingNews)
      .filter((item): item is BreakingNewsItem => item !== null)

    return items
  } catch {
    return []
  }
}

export async function BreakingTicker() {
  const items = await getBreakingNews()

  if (items.length === 0) {
    return null
  }

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
              href={getNewsUrl(item)}
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
