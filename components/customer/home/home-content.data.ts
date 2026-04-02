export interface SideItem {
  image: string
  title: string
  time: string
}

export interface SectionConfig {
  title: string
  href: string
  featured: {
    image: string
    category: string
    title: string
    excerpt: string
  }
  sideItems: SideItem[]
}

export const SECTION_DATA = {
  education: {
    title: "শিক্ষাঙ্গন",
    href: "/news?category=education",
    featured: {
      image: "https://picsum.photos/seed/edu1/600/380",
      category: "শিক্ষাঙ্গন",
      title: "বিশ্ববিদ্যালয়গুলোতে নতুন শিক্ষাবর্ষে ভর্তির সংখ্যা বাড়ছে",
      excerpt: "এবার ভর্তি পরীক্ষায় অংশ নিচ্ছেন রেকর্ড সংখ্যক শিক্ষার্থী, জানাল শিক্ষা মন্ত্রণালয়।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/edu2/300/200", title: "ঢাকা বিশ্ববিদ্যালয়ে আন্তর্জাতিক সম্মেলন অনুষ্ঠিত", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/edu3/300/200", title: "শিক্ষার্থীদের জন্য বিশেষ বৃত্তি ঘোষণা দিল সরকার", time: "৩ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/edu4/300/200", title: "নতুন কারিকুলামে পাঠ্যক্রম পরিবর্তনের উদ্যোগ", time: "৫ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/edu5/300/200", title: "কলেজে ভর্তি প্রক্রিয়া ডিজিটালে রূপান্তর হচ্ছে", time: "৭ ঘণ্টা আগে" },
    ],
  },
  admission: {
    title: "ভর্তি পরীক্ষা",
    href: "/news?category=admission",
    featured: {
      image: "https://picsum.photos/seed/adm1/600/380",
      category: "ভর্তি পরীক্ষা",
      title: "মেডিকেল ভর্তি পরীক্ষার সময়সূচি প্রকাশ, পরীক্ষা ১৫ মে",
      excerpt: "স্বাস্থ্য শিক্ষা অধিদপ্তর জানিয়েছে এবার দেশের সকল সরকারি মেডিকেল কলেজে একযোগে ভর্তি পরীক্ষা হবে।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/adm2/300/200", title: "বুয়েটে ভর্তি পরীক্ষার আবেদন শুরু ১০ এপ্রিল থেকে", time: "১ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/adm3/300/200", title: "জাতীয় বিশ্ববিদ্যালয়ে অনার্স ভর্তির বিজ্ঞপ্তি", time: "৪ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/adm4/300/200", title: "ইঞ্জিনিয়ারিং ভর্তি পরীক্ষায় এবার কেন্দ্রীয় প্রশ্নপত্র", time: "৬ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/adm5/300/200", title: "কৃষি বিশ্ববিদ্যালয়ে ভর্তির নতুন নির্দেশিকা জারি", time: "৮ ঘণ্টা আগে" },
    ],
  },
  national: {
    title: "জাতীয়",
    href: "/news?category=national",
    featured: {
      image: "https://picsum.photos/seed/nat1/600/380",
      category: "জাতীয়",
      title: "সংসদে উচ্চশিক্ষা স্বায়ত্তশাসন বিল উত্থাপন, আলোচনা চলছে",
      excerpt: "উচ্চশিক্ষা প্রতিষ্ঠানগুলোকে আরও স্বাধীনতা দিতে নতুন বিল সংসদে পেশ করা হয়েছে।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/nat2/300/200", title: "প্রাথমিক শিক্ষায় সরকারের বাজেট বরাদ্দ দ্বিগুণ", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/nat3/300/200", title: "নতুন শিক্ষানীতি প্রণয়নে বিশেষজ্ঞ কমিটি গঠন", time: "৩ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/nat4/300/200", title: "মাদ্রাসা শিক্ষায় আধুনিক পদ্ধতি চালুর ঘোষণা", time: "৫ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/nat5/300/200", title: "দেশব্যাপী শিক্ষক নিবন্ধন পরীক্ষার তারিখ নির্ধারণ", time: "৬ ঘণ্টা আগে" },
    ],
  },
  sports: {
    title: "খেলাধুলা",
    href: "/news?category=sports",
    featured: {
      image: "https://picsum.photos/seed/spt1/600/380",
      category: "খেলাধুলা",
      title: "আন্তঃবিশ্ববিদ্যালয় ক্রিকেট টুর্নামেন্টে বুয়েট চ্যাম্পিয়ন",
      excerpt: "রুদ্ধশ্বাস ফাইনালে বুয়েট দল ঢাকা বিশ্ববিদ্যালয়কে হারিয়ে শিরোপা জয় করেছে।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/spt2/300/200", title: "বিশ্ববিদ্যালয় ফুটবলে নতুন মৌসুম শুরু", time: "১ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/spt3/300/200", title: "ক্যাম্পাস গেমসে সেরা অ্যাথলেটের পুরস্কার ঘোষণা", time: "৩ ঘণ্টা আগে" },
    ],
  },
  economy: {
    title: "অর্থনীতি",
    href: "/news?category=economy",
    featured: {
      image: "https://picsum.photos/seed/eco1/600/380",
      category: "অর্থনীতি",
      title: "শিক্ষা খাতে বিনিয়োগ বাড়ানোর পরামর্শ বিশেষজ্ঞদের",
      excerpt: "অর্থনীতিবিদরা বলছেন মানসম্পন্ন শিক্ষায় বিনিয়োগ বৃদ্ধি দীর্ঘমেয়াদে দেশের উন্নয়নে সহায়ক।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/eco2/300/200", title: "শিক্ষার্থীদের স্টার্টআপ ঋণ পাওয়ার সুযোগ বাড়ছে", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/eco3/300/200", title: "দক্ষ জনশক্তি তৈরিতে বাজেটে বরাদ্দ বৃদ্ধি", time: "৪ ঘণ্টা আগে" },
    ],
  },
  career: {
    title: "কর্মজীবন",
    href: "/news?category=career",
    featured: {
      image: "https://picsum.photos/seed/car1/600/380",
      category: "কর্মজীবন",
      title: "সরকারি চাকরিতে আবেদনের বয়সসীমা বাড়ানোর দাবি",
      excerpt: "বেকার তরুণদের দাবির মুখে সরকারি চাকরিতে আবেদনের বয়সসীমা পুনর্বিবেচনার আলোচনা শুরু।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/car2/300/200", title: "বিসিএস প্রস্তুতিতে নতুন সিলেবাস প্রকাশ", time: "৩ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/car3/300/200", title: "কর্পোরেট চাকরিতে ফ্রেশারদের সুযোগ বাড়ছে", time: "৫ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/car4/300/200", title: "ফ্রিল্যান্সিং খাতে তরুণদের আয় রেকর্ড পরিমাণে বেড়েছে", time: "৬ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/car5/300/200", title: "ইন্টার্নশিপ ট্র্যাকার পোর্টাল চালু করলো উচ্চশিক্ষা পরিষদ", time: "৮ ঘণ্টা আগে" },
    ],
  },
  science: {
    title: "বিজ্ঞান ও প্রযুক্তি",
    href: "/news?category=science",
    featured: {
      image: "https://picsum.photos/seed/sci1/600/380",
      category: "বিজ্ঞান",
      title: "দেশীয় বিজ্ঞানীদের গবেষণায় নতুন সাফল্য",
      excerpt: "বুয়েটের গবেষকরা নতুন ধরনের পানি পরিশোধন প্রযুক্তি উদ্ভাবন করেছেন।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/sci2/300/200", title: "AI ব্যবহার করে শিক্ষা পদ্ধতির পরিবর্তন আসছে", time: "২ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/sci3/300/200", title: "রোবোটিক্স প্রতিযোগিতায় বাংলাদেশ দলের সাফল্য", time: "৪ ঘণ্টা আগে" },
    ],
  },
  international: {
    title: "আন্তর্জাতিক",
    href: "/news?category=international",
    featured: {
      image: "https://picsum.photos/seed/int1/600/380",
      category: "আন্তর্জাতিক",
      title: "দক্ষিণ এশিয়ার শিক্ষা সম্মেলনে বাংলাদেশের প্রতিনিধি",
      excerpt: "আন্তর্জাতিক বৃত্তি ও যৌথ ডিগ্রি কার্যক্রম নিয়ে গুরুত্বপূর্ণ আলোচনা হয়েছে সম্মেলনে।",
    },
    sideItems: [
      { image: "https://picsum.photos/seed/int2/300/200", title: "বিদেশে উচ্চশিক্ষায় বাংলাদেশি শিক্ষার্থীর সংখ্যা বাড়ছে", time: "১ ঘণ্টা আগে" },
      { image: "https://picsum.photos/seed/int3/300/200", title: "ফুলব্রাইট বৃত্তিতে ১০ জন বাংলাদেশি নির্বাচিত", time: "৫ ঘণ্টা আগে" },
    ],
  },
} satisfies Record<string, SectionConfig>

export type NewsSectionKey = keyof typeof SECTION_DATA

export const VIDEO_STORIES = [
  { seed: "vid1", title: "শিক্ষার্থীদের প্রতিক্রিয়া: নতুন পাঠ্যক্রম নিয়ে মতামত" },
  { seed: "vid2", title: "ঢাকা বিশ্ববিদ্যালয়ের প্রতিষ্ঠাবার্ষিকীর অনুষ্ঠান সরাসরি" },
  { seed: "vid3", title: "বৃত্তি পাওয়া শিক্ষার্থীদের সাফল্যের গল্প" },
  { seed: "vid4", title: "শিক্ষামন্ত্রীর সাথে একান্ত সাক্ষাৎকার" },
]
