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

// Cloudinary supporta due modalità: "Fixed Folder" (public_id con prefisso) e
// "Dynamic Folder" (asset_folder separato). Usiamo la Search API che funziona in entrambi i casi.
async function searchByFolder(folderPath: string, maxResults = 100, nextCursor?: string): Promise<{ resources: CldImage[]; next_cursor?: string }> {
  const params = new URLSearchParams({
    expression: `asset_folder="${folderPath}"`,
    max_results: String(maxResults),
  });
  if (nextCursor) params.set('next_cursor', nextCursor);
  const url = `${ADMIN_BASE()}/resources/search?${params.toString()}`;
  const res = await cldFetch(url);
  if (!res.ok) {
    console.error(`[Cloudinary] /resources/search error: ${res.status} ${res.statusText}`);
    return { resources: [] };
  }
  return res.json() as Promise<{ resources: CldImage[]; next_cursor?: string }>;
}

async function getFolderFirstImage(folderPath: string): Promise<CldImage | null> {
  try {
    const data = await searchByFolder(folderPath, 1);
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
      const data = await searchByFolder(folderPath, 100, nextCursor);
      all.push(...(data.resources ?? []));
      nextCursor = data.next_cursor;
    } while (nextCursor);
  } catch (err) {
    console.error('[Cloudinary] getFolderImages exception:', err);
  }

  return all;
}
