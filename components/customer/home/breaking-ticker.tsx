"use client"

export function BreakingTicker() {
  const items = [
    "ভর্তি পরীক্ষার গাইডেন্স পোর্টাল চালু হয়েছে — আবেদনের শেষ তারিখ ১৫ এপ্রিল",
    "মেডিকেল ভর্তি পরীক্ষা ১৫ মে অনুষ্ঠিত হবে",
    "বুয়েটে ভর্তি আবেদন শুরু ১০ এপ্রিল থেকে",
    "শিক্ষার্থীদের জন্য বিশেষ বৃত্তি ঘোষণা দিল সরকার",
    "আন্তর্জাতিক শিক্ষা সম্মেলনে বাংলাদেশের প্রতিনিধি দল রওনা",
  ]

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
            <span key={i} className="shrink-0 cursor-default hover:text-[#b38716]">
              {item}
            </span>
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
