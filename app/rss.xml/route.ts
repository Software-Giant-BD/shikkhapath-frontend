import { generateRssXml } from "@/lib/rss";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shikkhapath.com";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "শিক্ষাপথ";

  try {
    const response = await fetch(`${baseUrl}/rss`, {
      next: { revalidate: 900 }, // Revalidate every 15 minutes
    });

    if (!response.ok) {
      return new Response("Failed to fetch RSS data", { status: 500 });
    }

    const data = await response.json();
    const items = data.resources?.items || [];

    const xml = generateRssXml({
      title: `${siteName} | শীর্ষ সংবাদ`,
      link: appUrl,
      description: "শিক্ষা, ক্যাম্পাস, কর্মসংস্থান, জাতীয় ও আন্তর্জাতিক সর্বশেষ সংবাদ",
      feedUrl: `${appUrl}/rss.xml`,
      items,
    });

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("RSS feed error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
