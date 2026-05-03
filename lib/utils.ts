import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNewsUrl(news: {
  unique_code: string;
  category_slug?: string;
  sub_category_slug?: string;
}) {
  const segments = [];
  if (news.category_slug) {
    segments.push(news.category_slug);
    if (news.sub_category_slug) {
      segments.push(news.sub_category_slug);
    }
  } else {
    segments.push("news");
  }
  segments.push(news.unique_code);
  return `/${segments.join("/")}`;
}

export function getCategoryUrl(category: { slug: string }) {
  return `/${category.slug}`;
}
