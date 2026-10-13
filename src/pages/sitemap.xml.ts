import type { APIRoute } from 'astro';
import { getPosts, getTotalPostPages } from '../lib/wordpress';
import { getFolders } from '../lib/cloudinary';

export const prerender = false;

const SITE = 'https://www.cesarescalise.it';

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (c) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return entities[c];
  });
}

export const GET: APIRoute = async () => {
  try {
    const urls = new Set<string>([
      '/',
      '/blog/',
      '/gallerie/',
      '/libri/',
      '/cv/',
    ]);

    // Recupera tutti gli articoli pubblicati.
    const totalPages = await getTotalPostPages(100);

    for (let page = 1; page <= totalPages; page++) {
      const posts = await getPosts(100, page);

      for (const post of posts) {
        urls.add(`/blog/${encodeURIComponent(post.slug)}/`);
      }
    }

    // Recupera le gallerie pubbliche (cartelle Cloudinary).
    const galleries = await getFolders();

    for (const gallery of galleries) {
      urls.add(`/gallerie/${encodeURIComponent(gallery.path)}/`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
  .map((path) => `  <url>
    <loc>${escapeXml(new URL(path, SITE).href)}</loc>
  </url>`)
  .join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation failed:', error);

    return new Response('Sitemap temporarily unavailable', {
      status: 503,
    });
  }
};
