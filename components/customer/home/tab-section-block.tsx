"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { TabNewsResponse } from "@/lib/api/news";

interface TabSectionBlockProps {
  data?: TabNewsResponse;
}

export function TabSectionBlock({ data }: TabSectionBlockProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Group stories by category title
  const groupedData = (data || []).reduce(
    (acc, item) => {
      const categoryTitle = item.category?.title || "অন্যান্য";
      const categorySlug = item.category?.slug || "";

      if (!acc[categoryTitle]) {
        acc[categoryTitle] = {
          slug: categorySlug,
          stories: [],
        };
      }
      acc[categoryTitle].stories.push({
        image: item.feature_image_url,
        title: item.title,
        time: "", // Keeping this empty as before
        unique_code: item.unique_code,
      });
      return acc;
    },
    {} as Record<string, { slug: string; stories: any[] }>,
  );

  const tabsToRender = Object.entries(groupedData).map(([label, info]) => ({
    label,
    slug: info.slug,
    stories: info.stories,
  }));

  if (tabsToRender.length === 0) return null;

  return (
    <section className="mt-5">
      {/* Tab bar */}
      <div className="flex border-b-2 border-[#c79a1d]">
        {tabsToRender.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeTab === i
                ? "bg-[#c79a1d] text-white"
                : "bg-white text-slate-700 hover:bg-amber-50 hover:text-[#b38716]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 bg-white" />
        <Link
          href={`/${tabsToRender[activeTab].slug}`}
          className="flex items-center bg-white px-3 text-xs font-semibold text-[#b38716] hover:underline"
        >
          আরও দেখুন »
        </Link>
      </div>

      {/* Tab content */}
      <div className="grid gap-3 bg-white p-3 sm:grid-cols-2 md:grid-cols-4">
        {tabsToRender[activeTab].stories.map((story) => (
          <article key={story.title} className="group">
            <Link href={`/${tabsToRender[activeTab].slug}/${story.unique_code}`} className="block">
              <div className="overflow-hidden rounded">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={300}
                  height={200}
                  className="w-full aspect-3/2 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#b38716] line-clamp-2">
                {story.title}
              </p>
              {story.time && (
                <p className="mt-1 text-[11px] text-slate-400">{story.time}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
