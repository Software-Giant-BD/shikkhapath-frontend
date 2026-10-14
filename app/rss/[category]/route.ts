import { generateRssXml } from "@/lib/rss";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  let { category } = await params;
  category = category.replace(/\.xml$/, "");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";

  try {
    const response = await fetch(`${baseUrl}/rss/${category}`, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return new Response("Failed to fetch RSS data", { status: 500 });
    }

    const data = await response.json();
    const items = data.resources?.items || [];
    const categoryInfo = data.resources?.category;
    const categoryTitle = categoryInfo?.title || category;

    const xml = generateRssXml({
      title: `${siteName} | ${categoryTitle}`,
      link: `${appUrl}/${category}`,
      description: `${categoryTitle} বিভাগের সর্বশেষ সংবাদ`,
      feedUrl: `${appUrl}/rss/${category}.xml`,
      items,
    });

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Category RSS feed error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
