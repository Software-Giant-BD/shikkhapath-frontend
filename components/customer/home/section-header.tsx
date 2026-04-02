import Link from "next/link"

interface Props {
  title: string
  href: string
}

export function SectionHeader({ title, href }: Props) {
  return (
    <div className="mb-2 flex items-center justify-between border-b-2 border-[#c79a1d] pb-1">
      <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">{title}</h2>
      <Link href={href} className="text-xs font-semibold text-[#b38716] hover:underline">
        আরও দেখুন »
      </Link>
    </div>
  )
}
