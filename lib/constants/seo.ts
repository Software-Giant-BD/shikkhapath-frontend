export const SITE_KEYWORDS = [
  "শিক্ষা",
  "ভর্তি পরীক্ষা",
  "ক্যারিয়ার",
  "দেশ-বিদেশের খবর",
  "শিক্ষা সংবাদ",
  "ক্যারিয়ার গাইডলাইন",
  "ভর্তি সার্কুলার",
  "সরকারি চাকরি",
  "বাংলা নিউজ পোর্টাল",
  "Shikkhapath",
  "Shikkhapath news",
  "Shikkhapath admission",
  "Shikkhapath career",
  "Shikkhapath education",
  "Shikkhapath news today",
];

export const getNewsMediaOrganizationSchema = () => {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "শিক্ষাপথ";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shikkhapath.com";

  return {
    "@type": ["Organization", "NewsMediaOrganization"],
    name: SITE_NAME,
    alternateName: "Shikkhapath",
    foundingDate: "2026-05-01",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    image: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/shikkhapath", // Update with actual links
      "https://x.com/shikkhapath",
      "https://www.youtube.com/@shikkhapath",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801704-052374",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["bn", "en"],
        email: "support@shikkhapath.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "editor@shikkhapath.com",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Empire Talukder Dream,22–23 Station Road",
      addressLocality: "Tejgaon",
      addressRegion: "Dhaka",
      postalCode: "1215",
      addressCountry: "BD",
    },
    employee: {
      "@type": "Person",
      name: "Nafis Chonchol",
      jobTitle: "Developer",
      sameAs: ["https://www.facebook.com/nafis.chonchol"],
    },
    publishingPrinciples: [
      `${SITE_URL}/about`,
      `${SITE_URL}/editorial-policy`,
      `${SITE_URL}/privacy`,
    ],
  };
};

export const getWebSiteSchema = (menuCategories: any[] = []) => {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "শিক্ষাপথ";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shikkhapath.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    interactivityType: "mixed",
    name: SITE_NAME,
    headline: `${SITE_NAME} |শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ`,
    keywords: SITE_KEYWORDS.join(", "),
    url: SITE_URL,
    copyrightHolder: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL,
    },
    ...(menuCategories.length > 0 && {
      hasPart: menuCategories.map((category) => ({
        "@type": "WebPage",
        name: category.title,
        url: `${SITE_URL}/${category.slug}`,
      })),
    }),
  };
};
