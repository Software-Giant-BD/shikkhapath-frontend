export interface RssFeedItem {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  author: string;
  category: string;
  category_slug?: string;
  image_url?: string | null;
  pub_date: string;
}

export interface RssFeedChannel {
  title: string;
  link: string;
  description: string;
  feedUrl: string;
  items: RssFeedItem[];
}

export function generateRssXml(channel: RssFeedChannel): string {
  const { title, link, description, feedUrl, items } = channel;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:media="http://search.yahoo.com/mrss/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${link}</link>
    <description><![CDATA[${description}]]></description>
    <language>bn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${link}/logo.png</url>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
    </image>
`;

  for (const item of items) {
    const itemUrl = `${link}${item.url}`;
    const cleanTitle = (item.title || "").trim();
    const cleanExcerpt = (item.excerpt || "").trim();
    const cleanAuthor = (item.author || "শিক্ষাপথ ডেস্ক").trim();
    const cleanCategory = (item.category || "সাধারণ").trim();

    xml += `    <item>
      <title><![CDATA[${cleanTitle}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${item.pub_date}</pubDate>
      <dc:creator><![CDATA[${cleanAuthor}]]></dc:creator>
      <category><![CDATA[${cleanCategory}]]></category>
      <description><![CDATA[${cleanExcerpt}<p><a href="${itemUrl}">বিস্তারিত পড়ুন &raquo;</a></p>]]></description>
`;

    if (item.image_url) {
      xml += `      <media:content url="${item.image_url}" medium="image" />
      <enclosure url="${item.image_url}" length="0" type="image/jpeg" />
`;
    }

    xml += `    </item>
`;
  }

  xml += `  </channel>
</rss>`;

  return xml;
}
