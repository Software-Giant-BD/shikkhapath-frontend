import Link from "next/link";
import { getMenuCategories } from "@/lib/api/categories";

export function FinalCtaSection() {
  return null;
}

export async function SiteFooter({ settings }: { settings?: any }) {
  const categories = await getMenuCategories();

  // Create dynamic category links from the API
  const dynamicCategories = categories
    .sort((a, b) => Number(a.sort_order || "0") - Number(b.sort_order || "0"))
    .map((category) => ({
      label: category.title,
      href: `/${category.slug}`,
    }));

  // Fallback to static if API returns empty, otherwise use dynamic
  const baseCategories =
    dynamicCategories.length > 0
      ? dynamicCategories
      : [
          { label: "শিক্ষাঙ্গন", href: "/education" },
          { label: "উচ্ছেশিক্ষা", href: "/higher-education" },
          { label: "ভর্তি পরীক্ষা", href: "/admission" },
          { label: "কর্মজীবন", href: "/career" },
          { label: "জাতীয়", href: "/national" },
          { label: "আন্তর্জাতিক", href: "/international" },
          { label: "বিজ্ঞান ও প্রযুক্তি", href: "/science" },
          { label: "খেলাধুলা", href: "/sports" },
          { label: "অর্থনীতি", href: "/economy" },
          { label: "মুক্তমত", href: "/opinion" },
          { label: "ভিডিও", href: "/video" },
        ];

  // Divide into two columns
  const midPoint = Math.ceil(baseCategories.length / 2);
  const leftCategories = baseCategories.slice(0, midPoint);
  const rightCategories = baseCategories.slice(midPoint);

  // Add Contact link to the right column
  rightCategories.push({ label: "যোগাযোগ", href: "/contact-us" });

  const socialLinks = [
    { icon: "f", href: settings?.facebook_url || "#" },
    { icon: "▶", href: settings?.youtube_url || "#" },
    { icon: "𝕏", href: settings?.twitter_url || "#" },
    { icon: "in", href: settings?.linkedin_url || "#" },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-slate-300">
      {/* Main footer grid */}
      <div className="mx-auto w-full max-w-screen-2xl px-3 py-8 sm:px-4 lg:px-5">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <p className="text-lg font-bold text-white">{settings?.site_name || "শিক্ষাপথ"}</p>
            <div className="mt-2 text-sm leading-relaxed text-slate-400 whitespace-pre-line">
              {settings?.contact_address || "Empire Talukder Dream \n 22–23 Station Road, \n Tejgaon, Dhaka–1215"}
              {settings?.contact_phone && `\n${settings.contact_phone}`}
              {settings?.contact_email && `\n${settings.contact_email}`}
            </div>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-sm text-white transition-colors hover:bg-[#c79a1d]"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
              বিভাগসমূহ
            </p>
            <ul className="space-y-1.5">
              {leftCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-400 hover:text-[#c79a1d]"
                  >
                    › {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
              আরও
            </p>
            <ul className="space-y-1.5">
              {rightCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-400 hover:text-[#c79a1d]"
                  >
                    › {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
              প্রতিষ্ঠান
            </p>
            <ul className="space-y-1.5">
              {[
                { label: "আমাদের সম্পর্কে", href: "/about" },
                { label: "সম্পাদকীয় নীতি", href: "/editorial-policy" },
                { label: "বিজ্ঞাপন দিন", href: "/advertise" },
                { label: "লেখক হোন", href: "/careers" },
                { label: "গোপনীয়তা নীতি", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#c79a1d]"
                  >
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
          <p>{settings?.footer_text || "© ২০২৬ শিক্ষাপথ। সর্বস্বত্ব সংরক্ষিত।"}</p>
        </div>
      </div>
    </footer>
  );
}
