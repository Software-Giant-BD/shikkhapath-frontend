import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shikkhapath.com';

    try {
        const response = await fetch(`${baseUrl}/sitemap`, {
            next: { revalidate: 3600 }
        });
        const data = await response.json();

        if (!data.success) {
            return new Response('Failed to fetch sitemap data', { status: 500 });
        }

        const { daily, archives } = data.resources;

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Static Sitemaps
        xml += '<sitemap>';
        xml += `<loc>${appUrl}/sitemap/sitemap-category.xml</loc>`;
        xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
        xml += '</sitemap>';

        xml += '<sitemap>';
        xml += `<loc>${appUrl}/sitemap/sitemap-topic.xml</loc>`;
        xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
        xml += '</sitemap>';

        xml += '<sitemap>';
        xml += `<loc>${appUrl}/sitemap/sitemap-static-pages.xml</loc>`;
        xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
        xml += '</sitemap>';

        daily.forEach((date: string) => {
            xml += '<sitemap>';
            xml += `<loc>${appUrl}/sitemap/sitemap-daily-${date}.xml</loc>`;
            xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
            xml += '</sitemap>';
        });

        archives.forEach((archive: any) => {
            xml += '<sitemap>';
            xml += `<loc>${appUrl}/sitemap/sitemap-archive-${archive.year}-${archive.month}-${archive.part}.xml</loc>`;
            xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
            xml += '</sitemap>';
        });

        xml += '</sitemapindex>';

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('Sitemap error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
