# Guida Manutenzione — cesarescalise.it

## 🏗️ Architettura
| Componente | Dove |
|-----------|------|
| Frontend (Astro) | Vercel — deploy automatico da GitHub |
| Backend (WordPress + FlaGallery) | Aruba — `www.cesarescalise.it/wordpress` |
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

> ⚠️ `WP_ARUBA_IP` serve a bypassare il DNS di Vercel che altrimenti punterebbe
> su se stesso. Se Aruba cambia IP, aggiornare qui e su Vercel.

---

## 🛠️ Operazioni comuni

### Modificare contenuti (articoli, pagine, CV)
→ Accedere a WordPress Admin e modificare da lì. Nessun redeploy necessario
  (il frontend è SSR, legge WP a runtime).

### Aggiungere/modificare gallerie
→ Gestire le gallerie con FlaGallery in WordPress Admin.
   Il plugin custom `wp-plugin/cesarescalise-api.php` espone le foto via REST.

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

### Aggiornare il plugin WP
1. Modificare `wp-plugin/cesarescalise-api.php`
2. Caricare il file su Aruba via FTP o wp-admin → Plugin → Editor
   in `wp-content/plugins/cesarescalise-api/cesarescalise-api.php`

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
    index.astro        → Home
    blog/
      index.astro      → Lista articoli
      [slug].astro     → Singolo articolo
    gallerie/
      index.astro      → Lista gallerie
      [id].astro       → Singola galleria
    cv.astro           → Curriculum Vitae
  components/
    PostCard.astro
    GalleryCard.astro
  layouts/
    BaseLayout.astro
  lib/
    wordpress.ts       → Client API WordPress
wp-plugin/
  cesarescalise-api.php  → Plugin WP per gallerie
```

---

## 🚨 Troubleshooting

| Problema | Causa probabile | Soluzione |
|---------|----------------|-----------|
| Articoli non caricano | WP down o IP Aruba cambiato | Verificare `WP_ARUBA_IP` su Vercel |
| Gallerie 404 | Plugin WP non attivo | Attivare `cesarescalise-api` in WP Admin |
| Deploy fallito | Errore build Astro | Vedere log su Vercel Dashboard → Deployments |
| Immagini non si vedono | URL WP errato | Controllare `PUBLIC_WP_URL` su Vercel |
