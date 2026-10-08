# Guida Manutenzione — cesarescalise.it

## 🏗️ Architettura
| Componente | Dove |
|-----------|------|
| Frontend (Astro 5 SSR) | Vercel — deploy automatico da GitHub |
| Contenuti Blog/CV/Libri (WordPress) | Aruba — `www.cesarescalise.it/wordpress` |
| Gallerie foto | Cloudinary (cartelle = gallerie) |
| Repository GitHub | `github.com/cescali/cesarescalise.it` (branch: `main`) |

---

## 🔗 Come collegarsi

### GitHub
- URL repo: https://github.com/cescali/cesarescalise.it
- Utente: `cescali`
- Branch principale: `main`
- Token PAT salvato nel remote git locale (in `.git/config`)

### Vercel
- Dashboard: https://vercel.com/dashboard
- Login: con account GitHub `cescali`
- Il progetto si chiama (verifica su dashboard): `cesarescalise-it` o simile
- Ogni push su `main` → deploy automatico

### WordPress (Aruba)
- Admin WP: https://www.cesarescalise.it/wordpress/wp-admin
- REST API base: `https://www.cesarescalise.it/wordpress/wp-json/wp/v2`
- API custom gallerie: `https://www.cesarescalise.it/wordpress/wp-json/cesarescalise/v1`

---

## ⚙️ Variabili d'ambiente (Vercel)
Configurate nella dashboard Vercel → Settings → Environment Variables:

| Variabile | Valore |
|-----------|--------|
| `PUBLIC_WP_URL` | `https://www.cesarescalise.it/wordpress` |
| `WP_ARUBA_IP` | `89.46.109.24` (IP fisso Aruba — NON cambiare senza verificare) |
| `CLOUDINARY_CLOUD_NAME` | nome account Cloudinary (gallerie foto) |
| `CLOUDINARY_API_KEY` | chiave API Cloudinary |
| `CLOUDINARY_API_SECRET` | secret API Cloudinary |

> ⚠️ `WP_ARUBA_IP` serve a bypassare il DNS di Vercel che altrimenti punterebbe
> su se stesso. Se Aruba cambia IP, aggiornare qui e su Vercel.

> ⚠️ `astro.config.mjs` ha `security: { checkOrigin: false }`. Astro 5 abilita
> di default un controllo CSRF sull'header Origin per le route SSR, che blocca
> il reverse-proxy verso WP Admin (`src/pages/wordpress/[...path].ts`) usato
> per login e upload da `wp-admin`. NON rimuovere questa opzione, altrimenti
> torna l'errore "Cross-site POST form submissions are forbidden" in fase di
> login/upload su WordPress.

---

## 🛠️ Operazioni comuni

### Modificare contenuti (articoli, pagine, CV)
→ Accedere a WordPress Admin e modificare da lì. Nessun redeploy necessario
  (il frontend è SSR, legge WP a runtime).

### Aggiungere/modificare gallerie
→ Le gallerie sono cartelle su Cloudinary (non più WordPress/FlaGallery).
   Nome cartella in formato "Nome AAAA" (es. "Sicilia 2025"); l'ordine in
   homepage e nella pagina Gallerie è automatico, per anno discendente
   (`getFolders()` in `src/lib/cloudinary.ts`).

### Modificare la pagina Libri
→ Il contenuto (titolo, tagline, copertina, descrizione, link Amazon) viene
   letto dalla pagina WordPress "libri" e parsato in `src/pages/libri.astro`
   (funzione `extractBooks()`, basata su regex sul blocco Gutenberg
   `wp-block-media-text`). Se cambia la struttura del contenuto in WP admin,
   verificare che il parsing regex continui a funzionare.

### Modifica al frontend (layout, stile, pagine)
1. Aprire la cartella `C:\CESARE_DOC_PERSONALI\cesarescalise-new`
2. Modificare i file in `src/`
3. Testare in locale:
   ```
   npm run dev
   ```
4. Commit e push:
   ```
   git add .
   git commit -m "descrizione modifica"
   git push origin main
   ```
5. Vercel fa il deploy automaticamente (1-2 minuti).

### Aggiornare il plugin WP (legacy, non più usato per le gallerie)
Il plugin `wp-plugin/cesarescalise-api.php` non è più richiamato dal frontend
(le gallerie ora sono su Cloudinary). Mantenerlo solo se serve per altri usi;
altrimenti può essere disattivato in WP Admin → Plugin senza impatti sul sito.

### Build locale (verifica prima del push)
```
npm run build
npm run preview
```

### Aggiornare dipendenze npm
```
npm update
npm run build   # verificare che non ci siano errori
```

---

## 📁 Struttura sorgente
```
src/
  pages/
    index.astro        → Home (hero, social, box News, ultimi articoli, gallerie)
    blog/
      index.astro      → Lista articoli
      [slug].astro     → Singolo articolo
    gallerie/
      index.astro      → Lista gallerie (da Cloudinary)
      [id].astro       → Singola galleria
    libri.astro         → Pagina Libri (layout cover + descrizione)
    cv.astro           → Curriculum Vitae
    wordpress/[...path].ts  → Reverse-proxy verso WP Admin (login/upload)
  components/
    PostCard.astro
    GalleryCard.astro
  layouts/
    BaseLayout.astro    → Header con menu desktop + hamburger mobile
  lib/
    wordpress.ts        → Client API WordPress (post, CV, pagina Libri)
    cloudinary.ts        → Client Cloudinary (gallerie, ordinate per anno)
wp-plugin/
  cesarescalise-api.php  → Plugin WP legacy, non più usato dal frontend
```

---

## 🚨 Troubleshooting

| Problema | Causa probabile | Soluzione |
|---------|----------------|-----------|
| Articoli non caricano | WP down o IP Aruba cambiato | Verificare `WP_ARUBA_IP` su Vercel |
| Gallerie 404 | Plugin WP non attivo | Attivare `cesarescalise-api` in WP Admin |
| Deploy fallito | Errore build Astro | Vedere log su Vercel Dashboard → Deployments |
| Immagini non si vedono | URL WP errato | Controllare `PUBLIC_WP_URL` su Vercel |
| "Cross-site POST form submissions are forbidden" al login/upload WP | `security.checkOrigin` di Astro 5 blocca il proxy | Verificare che `astro.config.mjs` abbia `security: { checkOrigin: false }` |
| Gallerie non aggiornate / ordine sbagliato | Nome cartella Cloudinary non in formato "Nome AAAA" | Rinominare la cartella su Cloudinary con l'anno in fondo |
