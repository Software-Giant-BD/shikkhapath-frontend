import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shikkhapath.com';
    const appName = process.env.APP_NAME || 'শিক্ষাপথ';

    try {
        const response = await fetch(`${baseUrl}/sitemap/news-sitemap`, {
            next: { revalidate: 1800 } // Revalidate every 30 minutes
        });
        const data = await response.json();

        if (!data.success) {
            return new Response('Failed to fetch news sitemap data', { status: 500 });
        }

        const newsItems = data.resources;

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';

        newsItems.forEach((item: any) => {
            xml += '<url>';
            xml += `<loc>${appUrl}${item.url}</loc>`;
            xml += '<news:news>';
            xml += '<news:publication>';
            xml += `<news:name>${appName}</news:name>`;
            xml += '<news:language>bn</news:language>';
            xml += '</news:publication>';
            xml += `<news:publication_date>${item.updated_at}</news:publication_date>`;
            xml += `<news:title><![CDATA[${item.title}]]></news:title>`;
            xml += '</news:news>';
            xml += '</url>';
        });

        xml += '</urlset>';

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('News Sitemap error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
