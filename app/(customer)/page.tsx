import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { SiteFooter } from "@/components/customer/common/footer-sections"
import { SiteHeader } from "@/components/customer/common/site-header"
import { BreakingTicker } from "@/components/customer/home/breaking-ticker"
import { HeroSection } from "@/components/customer/home/hero-section"
import { NewsSectionBlock } from "@/components/customer/home/news-section-block"
import { TabSectionBlock } from "@/components/customer/home/tab-section-block"
import { NewsletterSection } from "@/components/customer/home/newsletter-section"

export const metadata: Metadata = {
  title: "শিক্ষাপথ | শিক্ষা, ক্যাম্পাস ও জাতীয় সংবাদ",
  description:
    "শিক্ষাপথ — শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ পড়ুন।",
  alternates: { canonical: "/" },
  openGraph: {
    title: "শিক্ষাপথ",
    description: "বিশ্বস্ত শিক্ষা ও ক্যাম্পাস সংবাদ পোর্টাল।",
    type: "website",
    url: "/",
    siteName: "শিক্ষাপথ",
  },
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "শিক্ষাপথ",
    url: "https://shikkhapath.news",
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <BreakingTicker />

      <main className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-5">
        {/* Banner ad slot */}
        <div className="my-3 flex h-20 items-center justify-center overflow-hidden rounded bg-[#e8e8e8]">
          <span className="text-sm text-slate-400">[ বিজ্ঞাপন — ৯৭০×৯০ ]</span>
        </div>

        <HeroSection />

        {/* শিক্ষাঙ্গন section */}
        <NewsSectionBlock
          title="শিক্ষাঙ্গন"
          href="/news?category=education"
          featured={{
            image: "https://picsum.photos/seed/edu1/600/380",
            category: "শিক্ষাঙ্গন",
            title: "বিশ্ববিদ্যালয়গুলোতে নতুন শিক্ষাবর্ষে ভর্তির সংখ্যা বাড়ছে",
            excerpt: "এবার ভর্তি পরীক্ষায় অংশ নিচ্ছেন রেকর্ড সংখ্যক শিক্ষার্থী, জানাল শিক্ষা মন্ত্রণালয়।",
          }}
          sideItems={[
            { image: "https://picsum.photos/seed/edu2/300/200", title: "ঢাকা বিশ্ববিদ্যালয়ে আন্তর্জাতিক সম্মেলন অনুষ্ঠিত", time: "২ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/edu3/300/200", title: "শিক্ষার্থীদের জন্য বিশেষ বৃত্তি ঘোষণা দিল সরকার", time: "৩ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/edu4/300/200", title: "নতুন কারিকুলামে পাঠ্যক্রম পরিবর্তনের উদ্যোগ", time: "৫ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/edu5/300/200", title: "কলেজে ভর্তি প্রক্রিয়া ডিজিটালে রূপান্তর হচ্ছে", time: "৭ ঘণ্টা আগে" },
          ]}
        />

        {/* ভর্তি পরীক্ষা section */}
        <NewsSectionBlock
          title="ভর্তি পরীক্ষা"
          href="/news?category=admission"
          featured={{
            image: "https://picsum.photos/seed/adm1/600/380",
            category: "ভর্তি পরীক্ষা",
            title: "মেডিকেল ভর্তি পরীক্ষার সময়সূচি প্রকাশ, পরীক্ষা ১৫ মে",
            excerpt: "স্বাস্থ্য শিক্ষা অধিদপ্তর জানিয়েছে এবার দেশের সকল সরকারি মেডিকেল কলেজে একযোগে ভর্তি পরীক্ষা হবে।",
          }}
          sideItems={[
            { image: "https://picsum.photos/seed/adm2/300/200", title: "বুয়েটে ভর্তি পরীক্ষার আবেদন শুরু ১০ এপ্রিল থেকে", time: "১ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/adm3/300/200", title: "জাতীয় বিশ্ববিদ্যালয়ে অনার্স ভর্তির বিজ্ঞপ্তি", time: "৪ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/adm4/300/200", title: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষায় এবার কেন্দ্রীয় প্রশ্নপত্র", time: "৬ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/adm5/300/200", title: "কৃষি বিশ্ববিদ্যালয়ে ভর্তির নতুন নির্দেশিকা জারি", time: "৮ ঘণ্টা আগে" },
          ]}
        />

        {/* ভিডিও section */}
        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between border-b-2 border-[#c79a1d] pb-1">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">ভিডিও</h2>
            <Link href="/news?category=video" className="text-xs font-semibold text-[#b38716] hover:underline">আরও দেখুন »</Link>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {[
              { seed: "vid1", title: "শিক্ষার্থীদের প্রতিক্রিয়া: নতুন পাঠ্যক্রম নিয়ে মতামত" },
              { seed: "vid2", title: "ঢাকা বিশ্ববিদ্যালয়ের প্রতিষ্ঠাবার্ষিকীর অনুষ্ঠান সরাসরি" },
              { seed: "vid3", title: "বৃত্তি পাওয়া শিক্ষার্থীদের সাফল্যের গল্প" },
              { seed: "vid4", title: "শিক্ষামন্ত্রীর সাথে একান্ত সাক্ষাৎকার" },
            ].map((v) => (
              <Link key={v.seed} href="/news?category=video" className="group block overflow-hidden rounded bg-white shadow-sm">
                <div className="relative">
                  <Image src={`https://picsum.photos/seed/${v.seed}/400/230`} alt={v.title} width={400} height={230} className="w-full object-cover aspect-video" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">▶</span>
                  </span>
                </div>
                <p className="p-2 text-sm font-semibold leading-tight text-slate-900 group-hover:text-[#b38716]">{v.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* জাতীয় section */}
        <NewsSectionBlock
          title="জাতীয়"
          href="/news?category=national"
          featured={{
            image: "https://picsum.photos/seed/nat1/600/380",
            category: "জাতীয়",
            title: "সংসদে উচ্চশিক্ষা স্বায়ত্তশাসন বিল উত্থাপন, আলোচনা চলছে",
            excerpt: "উচ্চশিক্ষা প্রতিষ্ঠানগুলোকে আরও স্বাধীনতা দিতে নতুন বিল সংসদে পেশ করা হয়েছে।",
          }}
          sideItems={[
            { image: "https://picsum.photos/seed/nat2/300/200", title: "প্রাথমিক শিক্ষায় সরকারের বাজেট বরাদ্দ দ্বিগুণ", time: "২ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/nat3/300/200", title: "নতুন শিক্ষানীতি প্রণয়নে বিশেষজ্ঞ কমিটি গঠন", time: "৩ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/nat4/300/200", title: "মাদ্রাসা শিক্ষায় আধুনিক পদ্ধতি চালুর ঘোষণা", time: "৫ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/nat5/300/200", title: "দেশব্যাপী শিক্ষক নিবন্ধন পরীক্ষার তারিখ নির্ধারণ", time: "৬ ঘণ্টা আগে" },
          ]}
        />

        {/* খেলাধুলা + অর্থনীতি side-by-side */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <NewsSectionBlock
            title="খেলাধুলা"
            href="/news?category=sports"
            compact
            featured={{
              image: "https://picsum.photos/seed/spt1/600/380",
              category: "খেলাধুলা",
              title: "আন্তঃবিশ্ববিদ্যালয় ক্রিকেট টুর্নামেন্টে বুয়েট চ্যাম্পিয়ন",
              excerpt: "রুদ্ধশ্বাস ফাইনালে বুয়েট দল ঢাকা বিশ্ববিদ্যালয়কে হারিয়ে শিরোপা জয় করেছে।",
            }}
            sideItems={[
              { image: "https://picsum.photos/seed/spt2/300/200", title: "বিশ্ববিদ্যালয় ফুটবলে নতুন মৌসুম শুরু", time: "১ ঘণ্টা আগে" },
              { image: "https://picsum.photos/seed/spt3/300/200", title: "ক্যাম্পাস গেমসে সেরা অ্যাথলেটের পুরস্কার ঘোষণা", time: "৩ ঘণ্টা আগে" },
            ]}
          />
          <NewsSectionBlock
            title="অর্থনীতি"
            href="/news?category=economy"
            compact
            featured={{
              image: "https://picsum.photos/seed/eco1/600/380",
              category: "অর্থনীতি",
              title: "শিক্ষা খাতে বিনিয়োগ বাড়ানোর পরামর্শ বিশেষজ্ঞদের",
              excerpt: "অর্থনীতিবিদরা বলছেন মানসম্পন্ন শিক্ষায় বিনিয়োগ বৃদ্ধি দীর্ঘমেয়াদে দেশের উন্নয়নে সহায়ক।",
            }}
            sideItems={[
              { image: "https://picsum.photos/seed/eco2/300/200", title: "শিক্ষার্থীদের স্টার্টআপ ঋণ পাওয়ার সুযোগ বাড়ছে", time: "২ ঘণ্টা আগে" },
              { image: "https://picsum.photos/seed/eco3/300/200", title: "দক্ষ জনশক্তি তৈরিতে বাজেটে বরাদ্দ বৃদ্ধি", time: "৪ ঘণ্টা আগে" },
            ]}
          />
        </div>

        {/* Ad banner */}
        <div className="my-4 flex h-16 items-center justify-center overflow-hidden rounded bg-[#e8e8e8]">
          <span className="text-sm text-slate-400">[ বিজ্ঞাপন — ৯৭০×৬০ ]</span>
        </div>

        {/* Tab section: শিক্ষার খবর / ট্যাবলয়েড / মুক্তমত */}
        <TabSectionBlock />

        {/* কর্মজীবন section */}
        <NewsSectionBlock
          title="কর্মজীবন"
          href="/news?category=career"
          featured={{
            image: "https://picsum.photos/seed/car1/600/380",
            category: "কর্মজীবন",
            title: "সরকারি চাকরিতে আবেদনের বয়সসীমা বাড়ানোর দাবি",
            excerpt: "বেকার তরুণদের দাবির মুখে সরকারি চাকরিতে আবেদনের বয়সসীমা পুনর্বিবেচনার আলোচনা শুরু।",
          }}
          sideItems={[
            { image: "https://picsum.photos/seed/car2/300/200", title: "বিসিএস প্রস্তুতিতে নতুন সিলেবাস প্রকাশ", time: "৩ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/car3/300/200", title: "কর্পোরেট চাকরিতে ফ্রেশারদের সুযোগ বাড়ছে", time: "৫ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/car4/300/200", title: "ফ্রিল্যান্সিং খাতে তরুণদের আয় রেকর্ড পরিমাণে বেড়েছে", time: "৬ ঘণ্টা আগে" },
            { image: "https://picsum.photos/seed/car5/300/200", title: "ইন্টার্নশিপ ট্র্যাকার পোর্টাল চালু করলো উচ্চশিক্ষা পরিষদ", time: "৮ ঘণ্টা আগে" },
          ]}
        />

        {/* মাধ্যম ও বিজ্ঞান + আন্তর্জাতিক side-by-side */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <NewsSectionBlock
            title="বিজ্ঞান ও প্রযুক্তি"
            href="/news?category=science"
            compact
            featured={{
              image: "https://picsum.photos/seed/sci1/600/380",
              category: "বিজ্ঞান",
              title: "দেশীয় বিজ্ঞানীদের গবেষণায় নতুন সাফল্য",
              excerpt: "বুয়েটের গবেষকরা নতুন ধরনের পানি পরিশোধন প্রযুক্তি উদ্ভাবন করেছেন।",
            }}
            sideItems={[
              { image: "https://picsum.photos/seed/sci2/300/200", title: "AI ব্যবহার করে শিক্ষা পদ্ধতির পরিবর্তন আসছে", time: "২ ঘণ্টা আগে" },
              { image: "https://picsum.photos/seed/sci3/300/200", title: "রোবোটিক্স প্রতিযোগিতায় বাংলাদেশ দলের সাফল্য", time: "৪ ঘণ্টা আগে" },
            ]}
          />
          <NewsSectionBlock
            title="আন্তর্জাতিক"
            href="/news?category=international"
            compact
            featured={{
              image: "https://picsum.photos/seed/int1/600/380",
              category: "আন্তর্জাতিক",
              title: "দক্ষিণ এশিয়ার শিক্ষা সম্মেলনে বাংলাদেশের প্রতিনিধি",
              excerpt: "আন্তর্জাতিক বৃত্তি ও যৌথ ডিগ্রি কার্যক্রম নিয়ে গুরুত্বপূর্ণ আলোচনা হয়েছে সম্মেলনে।",
            }}
            sideItems={[
              { image: "https://picsum.photos/seed/int2/300/200", title: "বিদেশে উচ্চশিক্ষায় বাংলাদেশি শিক্ষার্থীর সংখ্যা বাড়ছে", time: "১ ঘণ্টা আগে" },
              { image: "https://picsum.photos/seed/int3/300/200", title: "ফুলব্রাইট বৃত্তিতে ১০ জন বাংলাদেশি নির্বাচিত", time: "৫ ঘণ্টা আগে" },
            ]}
          />
        </div>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
