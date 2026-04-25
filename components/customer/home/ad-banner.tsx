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
  variant?: "default" | "leaderboard"
}

export async function AdBanner({
  label,
  className = "my-4",
  heightClass = "h-16",
  fit = "cover",
  category,
  placement,
  variant = "default",
}: Props) {
  let ad = null;
  
  if (category && placement) {
    try {
      // Fetch all ads for this category. 
      // Next.js will deduplicate this call if multiple AdBanners use the same category.
      const { items } = await getCustomerAdvertisements({ category });
      ad = items.find((item: any) => item.placement === placement) || null;
    } catch (e) {
      // ignore
    }
  }

  if (ad && ad.image) {
    const isLeaderboard = variant === "leaderboard";
    const content = (
      <div
        className={[
          "relative w-full overflow-hidden",
          heightClass,
          isLeaderboard ? "rounded-2xl" : "rounded-xl",
          fit === "contain" ? "bg-slate-50" : "bg-white",
        ].join(" ")}
      >
        <Image
          src={ad.image}
          alt={ad.name}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          sizes="(min-width: 1024px) 300px, 100vw"
        />
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/25 to-transparent" />
        <div
          className={[
            "absolute left-3 top-3 inline-flex items-center gap-2",
            "rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700",
            "backdrop-blur-sm ring-1 ring-black/5",
          ].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Sponsored
        </div>
      </div>
    );

    return (
      <div
        className={[
          className,
          "overflow-hidden border bg-white shadow-sm transition-all hover:shadow-md",
          variant === "leaderboard" ? "rounded-2xl border-slate-200/80" : "rounded-xl border-slate-100",
        ].join(" ")}
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
      className={[
        className,
        heightClass,
        "relative flex flex-col items-center justify-center gap-2 overflow-hidden text-center shadow-sm",
        variant === "leaderboard" ? "rounded-2xl border border-slate-200/80 bg-white" : "rounded-xl border-2 border-dashed border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      {variant === "leaderboard" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-24 -top-20 h-44 w-44 rounded-full bg-slate-100 blur-2xl" />
          <div className="absolute -left-24 -bottom-20 h-44 w-44 rounded-full bg-slate-100 blur-2xl" />
          <div className="relative flex flex-col items-center justify-center gap-2 px-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sponsored space
            </span>
            <span className="text-sm font-bold text-slate-600">{label}</span>
            <span className="text-[11px] font-semibold text-slate-400">আপনার বিজ্ঞাপন এখানে দিতে যোগাযোগ করুন</span>
          </div>
        </>
      ) : (
        <>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Advertisement</span>
          <span className="text-xs font-semibold text-slate-500">{label}</span>
        </>
      )}
    </div>
  )
}
