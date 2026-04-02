interface Props {
  label: string
  className?: string
  heightClass?: string
}

export function AdBanner({ label, className = "my-4", heightClass = "h-16" }: Props) {
  return (
    <div className={`${className} ${heightClass} flex items-center justify-center overflow-hidden rounded bg-[#e8e8e8]`}>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  )
}
