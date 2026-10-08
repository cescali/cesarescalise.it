# cesarescalise.it — Frontend Astro

Sito personale di Cesare Scalise. Frontend moderno in **Astro 5** con **Tailwind CSS**,
collegato a WordPress su Aruba come headless CMS per Blog/CV/Libri, e a **Cloudinary**
per le gallerie fotografiche.

## Stack
- **Frontend**: Astro 5 (SSR) + Tailwind CSS + GLightbox
- **Backend contenuti**: WordPress su Aruba (REST API) — Blog, CV, pagina Libri
- **Gallerie foto**: Cloudinary (cartelle = gallerie, ordinate per anno discendente)
- **Deploy**: Vercel (adapter `@astrojs/vercel`), deploy automatico da `main`
- **Proxy admin WP**: `src/pages/wordpress/[...path].ts` inoltra le richieste
  (incluso login/upload) verso Aruba; richiede `security.checkOrigin: false`
  in `astro.config.mjs` (Astro 5 abilita di default un controllo CSRF che
  blocca questo reverse-proxy)

## Setup locale

```bash
cp .env.example .env
npm install
npm run dev
```

Apri http://localhost:4321

## Deploy su Vercel

1. Crea repo su GitHub e fai push del codice
2. Vai su [vercel.com](https://vercel.com) → "New Project" → importa il repo
3. Aggiungi variabile d ambiente: `PUBLIC_WP_URL=https://www.cesarescalise.it/wordpress`
4. Deploy!

## Installare il plugin WordPress (NECESSARIO per le gallerie)

1. Copia `wp-plugin/cesarescalise-api.php` nella cartella
   `wp-content/plugins/cesarescalise-api/` su Aruba (via FTP)
2. Attiva il plugin dalla Dashboard WordPress → Plugin
3. Verifica: `https://www.cesarescalise.it/wordpress/wp-json/cesarescalise/v1/galleries`

## Cambiare il dominio (dopo deploy Vercel)

1. Su Vercel → Settings → Domains → aggiungi `cesarescalise.it`
2. Su Aruba → pannello DNS → modifica record A puntando all IP Vercel

## Struttura progetto

```
src/
  lib/
    wordpress.ts        # Client API WordPress (post, CV, pagina Libri)
    cloudinary.ts        # Client Cloudinary (gallerie, ordinate per anno)
  layouts/
    BaseLayout.astro    # Layout comune (header + nav mobile hamburger + footer)
  components/
    PostCard.astro      # Card articolo blog
    GalleryCard.astro   # Card galleria con copertina
  pages/
    index.astro         # Homepage (hero, social, News, ultimi articoli, gallerie)
    blog/index.astro    # Lista articoli
    blog/[slug].astro   # Post singolo
    gallerie/index.astro     # Lista gallerie
    gallerie/[id].astro      # Galleria con Masonry + Lightbox
    libri.astro          # Pagina Libri (layout a due colonne, cover + descrizione)
    cv.astro             # Curriculum Vitae
    wordpress/[...path].ts  # Reverse-proxy verso WP Admin su Aruba
  styles/
    global.css           # Stili globali + Tailwind
```

Nota: le gallerie non usano più il plugin WordPress `cesarescalise-api.php` /
FlaGallery: sono gestite interamente su Cloudinary (una cartella = una galleria,
nome cartella in formato "Nome AAAA", es. "Sicilia 2025").

