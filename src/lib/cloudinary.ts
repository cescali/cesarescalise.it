// Cloudinary Admin API client
// Gallery = folder nel cloud "deht6x3fy"
// Credenziali lette a runtime (non a livello modulo) per compatibilità SSR

const CLOUD_NAME = () => (import.meta.env.CLOUDINARY_CLOUD_NAME as string) ?? 'deht6x3fy';
const DELIVERY_BASE = () => `https://res.cloudinary.com/${CLOUD_NAME()}/image/upload`;
const ADMIN_BASE    = () => `https://api.cloudinary.com/v1_1/${CLOUD_NAME()}`;

function authHeader(): string {
  const key    = import.meta.env.CLOUDINARY_API_KEY    as string ?? '';
  const secret = import.meta.env.CLOUDINARY_API_SECRET as string ?? '';
  // btoa è disponibile in Node.js 16+ e browser — evita dipendenza da Buffer
  return 'Basic ' + btoa(`${key}:${secret}`);
}

async function cldFetch(url: string): Promise<Response> {
  return fetch(url, { headers: { Authorization: authHeader() } });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CldFolder {
  name: string;
  path: string;
  coverUrl: string;
}

export interface CldImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

export function thumbUrl(publicId: string, w = 600, h = 450): string {
  return `${DELIVERY_BASE()}/c_fill,w_${w},h_${h},q_auto,f_auto/${publicId}`;
}

export function fullUrl(publicId: string): string {
  return `${DELIVERY_BASE()}/q_auto,f_auto/${publicId}`;
}

// ─── Folders (= gallerie) ─────────────────────────────────────────────────────

export async function getFolders(): Promise<CldFolder[]> {
  try {
    const res = await cldFetch(`${ADMIN_BASE()}/folders`);
    if (!res.ok) {
      console.error(`[Cloudinary] /folders error: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json() as { folders: Array<{ name: string; path: string }> };
    const folders = (data.folders ?? []).sort((a, b) => a.name.localeCompare(b.name));

    return Promise.all(
      folders.map(async (f) => {
        const cover = await getFolderFirstImage(f.path);
        return {
          name: f.name,
          path: f.path,
          coverUrl: cover ? thumbUrl(cover.public_id, 800, 600) : '',
        };
      })
    );
  } catch (err) {
    console.error('[Cloudinary] getFolders exception:', err);
    return [];
  }
}

async function getFolderFirstImage(folderPath: string): Promise<CldImage | null> {
  try {
    const url = `${ADMIN_BASE()}/resources/image?type=upload&prefix=${encodeURIComponent(folderPath + '/')}&max_results=1`;
    const res = await cldFetch(url);
    if (!res.ok) return null;
    const data = await res.json() as { resources: CldImage[] };
    return data.resources?.[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Immagini in una cartella (con paginazione automatica) ────────────────────

export async function getFolderImages(folderPath: string): Promise<CldImage[]> {
  const all: CldImage[] = [];
  let nextCursor: string | undefined;

  try {
    do {
      const cursorParam = nextCursor ? `&next_cursor=${nextCursor}` : '';
      const url = `${ADMIN_BASE()}/resources/image?type=upload&prefix=${encodeURIComponent(folderPath + '/')}&max_results=100${cursorParam}`;
      const res = await cldFetch(url);
      if (!res.ok) {
        console.error(`[Cloudinary] /resources error: ${res.status} ${res.statusText}`);
        break;
      }
      const data = await res.json() as { resources: CldImage[]; next_cursor?: string };
      all.push(...(data.resources ?? []));
      nextCursor = data.next_cursor;
    } while (nextCursor);
  } catch (err) {
    console.error('[Cloudinary] getFolderImages exception:', err);
  }

  return all;
}
