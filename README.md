# cesarescalise.it — Frontend Astro

Sito personale di Cesare Scalise. Frontend moderno in **Astro 4** con **Tailwind CSS**,
collegato a WordPress su Aruba come headless CMS.

## Stack
- **Frontend**: Astro 4 + Tailwind CSS + GLightbox
- **Backend**: WordPress su Aruba (REST API)
- **Deploy**: Vercel (gratuito)
- **Gallerie**: plugin WordPress custom (`wp-plugin/cesarescalise-api.php`)

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
  lib/wordpress.ts     # Client API WordPress
  layouts/
    BaseLayout.astro   # Layout comune (header + footer)
  components/
    PostCard.astro     # Card articolo blog
    GalleryCard.astro  # Card galleria con copertina
  pages/
    index.astro        # Homepage
    blog/index.astro   # Lista articoli
    blog/[slug].astro  # Post singolo
    gallerie/index.astro     # Lista gallerie
    gallerie/[id].astro      # Galleria con Masonry + Lightbox
    cv.astro           # Curriculum Vitae
  styles/
    global.css         # Stili globali + Tailwind

wp-plugin/
  cesarescalise-api.php  # Plugin WP per esporre flagallery via REST API
```
