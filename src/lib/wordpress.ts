// WordPress REST API client
// Backend: WordPress su Aruba (cesarescalise.it/wordpress)

const WP_BASE = import.meta.env.PUBLIC_WP_URL ?? 'http://89.46.109.24/wordpress';
// Se PUBLIC_WP_URL è un IP, inviamo il corretto Host header ad Aruba
const WP_HOST_OVERRIDE = import.meta.env.WP_HOST_OVERRIDE as string | undefined;
const WP_API = `${WP_BASE}/wp-json/wp/v2`;
const CUSTOM_API = `${WP_BASE}/wp-json/cesarescalise/v1`;

function wpFetch(url: string): Promise<Response> {
  const headers: Record<string, string> = {};
  if (WP_HOST_OVERRIDE) headers['Host'] = WP_HOST_OVERRIDE;
  return fetch(url, { headers });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export interface Gallery {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover_url: string;
  pic_count: number;
}

export interface GalleryPic {
  id: number;
  filename: string;
  url: string;
  thumb_url: string;
  alttext: string;
  description: string;
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function getPosts(perPage = 10, page = 1): Promise<WPPost[]> {
  const res = await wpFetch(
    `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia&status=publish`
  );
  if (!res.ok) throw new Error(`WP posts fetch failed: ${res.status}`);
  return res.json();
}

export async function getPost(slug: string): Promise<WPPost | null> {
  const res = await wpFetch(`${WP_API}/posts?slug=${slug}&_embed=wp:featuredmedia&status=publish`);
  if (!res.ok) return null;
  const posts: WPPost[] = await res.json();
  return posts[0] ?? null;
}

export async function getTotalPostPages(perPage = 10): Promise<number> {
  const res = await wpFetch(`${WP_API}/posts?per_page=${perPage}&status=publish`);
  if (!res.ok) return 1;
  return parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<WPPage | null> {
  const res = await wpFetch(`${WP_API}/pages?slug=${slug}`);
  if (!res.ok) return null;
  const pages: WPPage[] = await res.json();
  return pages[0] ?? null;
}

// ─── Galleries (custom flagallery endpoint) ──────────────────────────────────

export async function getGalleries(): Promise<Gallery[]> {
  const res = await wpFetch(`${CUSTOM_API}/galleries`);
  if (!res.ok) throw new Error(`Galleries fetch failed: ${res.status}`);
  return res.json();
}

export async function getGallery(id: number): Promise<Gallery | null> {
  const res = await wpFetch(`${CUSTOM_API}/galleries/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getGalleryPics(galleryId: number): Promise<GalleryPic[]> {
  const res = await wpFetch(`${CUSTOM_API}/galleries/${galleryId}/pics`);
  if (!res.ok) return [];
  return res.json();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function getFeaturedImage(post: WPPost): string | null {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}
