import Link from "next/link"

interface Props {
  title: string
  href: string
}

export function SectionHeader({ title, href }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between border-b-2 border-slate-900 pb-1.5 pt-1">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <Link 
        href={`/category/${href}`} 
        className="text-[13px] font-bold text-[#b38716] transition-colors hover:text-slate-900"
      >
        আরও দেখুন »
      </Link>
    </div>
  )
}
