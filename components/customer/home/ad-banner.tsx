import Image from "next/image";
import Link from "next/link";
import { getCustomerAdvertisements } from "@/lib/api/advertisements";

interface Props {
  label: string
  className?: string
  heightClass?: string
  fit?: "cover" | "contain"
  category?: string
  placement?: string
}

export async function AdBanner({
  label,
  className = "my-4",
  heightClass = "h-16",
  fit = "cover",
  category,
  placement,
}: Props) {
  let ad = null;
  
  if (category && placement) {
    try {
      const { items } = await getCustomerAdvertisements({ category, placement });
      ad = items[0];
    } catch (e) {
      // ignore
    }
  }

  if (ad && ad.image) {
    const content = (
      <div
        className={`relative w-full ${heightClass} overflow-hidden rounded-xl ${
          fit === "contain" ? "bg-slate-50" : "bg-white"
        }`}
      >
        <Image
          src={ad.image}
          alt={ad.name}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          sizes="(min-width: 1024px) 300px, 100vw"
        />
        <div className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
          Ad
        </div>
      </div>
    );

    return (
      <div
        className={`${className} overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md`}
      >
        {ad.redirect_url ? (
          <Link href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className="block w-full">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  return (
    <div
      className={`${className} ${heightClass} flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center shadow-sm`}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Advertisement</span>
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </div>
  )
}
