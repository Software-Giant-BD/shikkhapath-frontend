export type InstitutionType = "University" | "College" | "School";

export interface CampusNews {
  id: number;
  slug: string;
  title: string;
  description: string;
  institution_name: string;
  institution_type: InstitutionType;
  location: string;
  image: string;
  publish_date: string;
  author: string;
  status: "Published" | "Draft";
  images?: string[];
}

const CAMPUS_NEWS_MOCK: CampusNews[] = [
  {
    id: 1,
    slug: "du-admission-circular-2026",
    title: "DU Admission Circular 2026 Published",
    description: "<p>Dhaka University admission circular has been published for the academic year 2025-26. Interested students can apply online from next Monday. The university has introduced several changes in the examination pattern this year.</p><p>According to the Dean's office, the exams will be held in four units. Mobile phones and electronic devices are strictly prohibited in the exam halls.</p>",
    institution_name: "Dhaka University",
    institution_type: "University",
    location: "Dhaka",
    image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=80&w=800",
    publish_date: "2026-04-14",
    author: "Admin",
    status: "Published",
  },
  {
    id: 2,
    slug: "rajshahi-college-anniversary-celebration",
    title: "Rajshahi College Anniversary Celebration Next Week",
    description: "<p>Rajshahi College is set to celebrate its 153rd anniversary next week. The college administration has planned a three-day long program including cultural events and reunion of former students.</p><p>Local dignitaries and academics are expected to attend the opening ceremony.</p>",
    institution_name: "Rajshahi College",
    institution_type: "College",
    location: "Rajshahi",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80&w=800",
    publish_date: "2026-04-12",
    author: "Zaman Khan",
    status: "Published",
  },
  {
    id: 3,
    slug: "viqarunnisa-school-annual-sports-meet",
    title: "Viqarunnisa Noon School Annual Sports Meet Begins",
    description: "<p>The annual sports meet of Viqarunnisa Noon School and College has started today at the school premises. Students from different branches are participating in various athletic competitions.</p>",
    institution_name: "Viqarunnisa Noon School",
    institution_type: "School",
    location: "Dhaka",
    image: "https://images.unsplash.com/photo-1503945438517-f65904a52ce6?auto=format&fit=crop&q=80&w=800",
    publish_date: "2026-04-13",
    author: "Digital Desk",
    status: "Published",
  },
  {
    id: 4,
    slug: "buet-research-grant-announcement",
    title: "BUET Announces New Research Grants for Students",
    description: "<p>Bangladesh University of Engineering and Technology (BUET) has announced a new series of research grants aimed at undergraduate students. The goal is to foster innovation and practical research at an early stage.</p>",
    institution_name: "BUET",
    institution_type: "University",
    location: "Dhaka",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800",
    publish_date: "2026-04-10",
    author: "Tech Reporter",
    status: "Published",
  },
];

export interface SearchParams {
  type?: string;
  location?: string;
  query?: string;
}

export async function getCampusNews(filters: SearchParams = {}): Promise<CampusNews[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...CAMPUS_NEWS_MOCK];

  if (filters.type && filters.type !== "All") {
    filtered = filtered.filter((n) => n.institution_type === filters.type);
  }

  if (filters.location && filters.location !== "All") {
    filtered = filtered.filter((n) => n.location === filters.location);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.institution_name.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }

  // Descending order sort (latest first)
  return filtered.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
}

export async function getCampusNewsBySlug(slug: string): Promise<CampusNews | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return CAMPUS_NEWS_MOCK.find((n) => n.slug === slug);
}
