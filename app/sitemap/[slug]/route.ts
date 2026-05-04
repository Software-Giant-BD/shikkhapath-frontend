export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shikkhapath.com';

    let apiUrl = '';

    if (slug === 'sitemap-static-pages.xml') {
        const staticPages = [
            '/',
            '/about',
            '/contact-us',
            '/privacy',
            '/editorial-policy',
            '/advertise',
            '/submit-article',
            '/careers',
            '/admission',
            '/ambulance',
            '/blood-donation',
            '/cgpa-calculator',
            '/doctors',
            '/fire-service',
            '/jobs',
            '/namaz-time',
            '/police',
            '/ssc-hsc',
            '/trains',
            '/university-events',
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        staticPages.forEach((page) => {
            xml += '<url>';
            xml += `<loc>${appUrl}${page}</loc>`;
            xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
            xml += '<changefreq>monthly</changefreq>';
            xml += '<priority>0.5</priority>';
            xml += '</url>';
        });

        xml += '</urlset>';

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }

    if (slug === 'sitemap-category.xml') {
        apiUrl = `${baseUrl}/sitemap/categories`;
    } else if (slug === 'sitemap-topic.xml') {
        apiUrl = `${baseUrl}/sitemap/topics`;
    } else if (slug.startsWith('sitemap-daily-')) {
        const date = slug.replace('sitemap-daily-', '').replace('.xml', '');
        apiUrl = `${baseUrl}/sitemap/daily/${date}`;
    } else if (slug.startsWith('sitemap-archive-')) {
        const parts = slug.replace('sitemap-archive-', '').replace('.xml', '').split('-');
        if (parts.length >= 3) {
            apiUrl = `${baseUrl}/sitemap/archive/${parts[0]}/${parts[1]}/${parts[2]}`;
        }
    }

    if (!apiUrl) {
        return new Response('Not Found', { status: 404 });
    }

    try {
        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 }
        });
        const data = await response.json();

        if (!data.success) {
            return new Response('Failed to fetch sitemap data', { status: 500 });
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        if (slug === 'sitemap-category.xml') {
            data.resources.forEach((category: any) => {
                xml += '<url>';
                xml += `<loc>${appUrl}/${category.slug}</loc>`;
                xml += `<lastmod>${category.updated_at || new Date().toISOString()}</lastmod>`;
                xml += '<changefreq>weekly</changefreq>';
                xml += '<priority>0.9</priority>';
                xml += '</url>';
            });
        } else if (slug === 'sitemap-topic.xml') {
            data.resources.forEach((tag: string) => {
                xml += '<url>';
                xml += `<loc>${appUrl}/topic/${encodeURIComponent(tag.replace(/\s+/g, '-'))}</loc>`;
                xml += `<lastmod>${new Date().toISOString()}</lastmod>`;
                xml += '<changefreq>weekly</changefreq>';
                xml += '<priority>0.7</priority>';
                xml += '</url>';
            });
        } else {
            const newsItems = data.resources;
            newsItems.forEach((item: any) => {
                xml += '<url>';
                xml += `<loc>${appUrl}${item.url}</loc>`;
                xml += `<lastmod>${item.updated_at}</lastmod>`;
                xml += '<changefreq>daily</changefreq>';
                xml += '<priority>0.8</priority>';
                xml += '</url>';
            });
        }

        xml += '</urlset>';

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (error) {
        console.error('Sitemap part error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
