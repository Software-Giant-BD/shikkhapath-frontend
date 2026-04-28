import Link from "next/link"

export function FinalCtaSection() {
  return null
}

export function SiteFooter() {
  const footerCategories = [
    { label: "শিক্ষাঙ্গন", href: "/category/education" },
    { label: "উচ্চশিক্ষা", href: "/category/higher-education" },
    { label: "ভর্তি পরীক্ষা", href: "/category/admission" },
    { label: "কর্মজীবন", href: "/category/career" },
    { label: "জাতীয়", href: "/category/national" },
    { label: "আন্তর্জাতিক", href: "/category/international" },
    { label: "বিজ্ঞান ও প্রযুক্তি", href: "/category/science" },
    { label: "খেলাধুলা", href: "/category/sports" },
    { label: "অর্থনীতি", href: "/category/economy" },
    { label: "মুক্তমত", href: "/category/opinion" },
    { label: "ভিডিও", href: "/category/video" },
    { label: "যোগাযোগ", href: "/contact-us" },
  ]

  return (
    <footer className="bg-[#1a1a1a] text-slate-300">
      {/* Main footer grid */}
      <div className="mx-auto w-full max-w-screen-2xl px-3 py-8 sm:px-4 lg:px-5">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <p className="text-lg font-bold text-white">শিক্ষাপথ</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Shikkhapath <br />
              Empire Talukder Dream <br />
              22–23 Station Road, <br />
              Tejgaon, Dhaka–1212 <br />
              01704-052374
            </p>
            <div className="mt-4 flex gap-3">
              {["f", "▶", "𝕏", "in"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-white/10 text-sm text-white transition-colors hover:bg-[#c79a1d]"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">বিভাগসমূহ</p>
            <ul className="space-y-1.5">
              {footerCategories.slice(0, 6).map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-slate-400 hover:text-[#c79a1d]">
                    › {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">আরও</p>
            <ul className="space-y-1.5">
              {footerCategories.slice(6).map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-slate-400 hover:text-[#c79a1d]">
                    › {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">প্রতিষ্ঠান</p>
            <ul className="space-y-1.5">
              {[
                { label: "আমাদের সম্পর্কে", href: "/about" },
                { label: "সম্পাদকীয় নীতি", href: "/editorial-policy" },
                { label: "বিজ্ঞাপন দিন", href: "/advertise" },
                { label: "লেখক হোন", href: "/careers" },
                { label: "গোপনীয়তা নীতি", href: "/privacy" },
                { label: "যোগাযোগ", href: "/contact-us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-[#c79a1d]">
                    › {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center gap-2 px-3 py-4 text-xs text-slate-500 sm:flex-row sm:px-4 lg:px-5">
          <p>
            © ২০২৬ শিক্ষাপথ। সর্বস্বত্ব সংরক্ষিত। Developed by{" "}
            <a
              href="https://gpit.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:text-[#c79a1d]"
            >
              GPIT
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
