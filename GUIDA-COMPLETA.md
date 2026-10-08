# 📘 Guida completa al sito cesarescalise.it
### (spiegata semplice, passo per passo, anche se non sei un tecnico)

Questo documento spiega **tutto quello che serve per gestire il sito**, dal
cambiare un testo fino a modificare la grafica. Non serve sapere programmare:
dove serve scrivere comandi, sono riportati **esattamente** così come sono,
copia e incolla.

---

## 1. Come è fatto il sito (in parole semplici)

Il sito non è "un unico blocco": è composto da 4 pezzi che lavorano insieme.

| Pezzo | A cosa serve | Dove si trova |
|---|---|---|
| **Astro** (il "motore" del sito) | Decide com'è fatta graficamente ogni pagina (colori, bottoni, impaginazione) | Scritto nel codice, su **GitHub** |
| **Vercel** | Prende il codice da GitHub e lo pubblica online, lo tiene "acceso" 24 ore su 24 | vercel.com |
| **WordPress** (su Aruba) | Contiene i TESTI: articoli del blog, CV, pagina Libri | www.cesarescalise.it/wordpress/wp-admin |
| **Cloudinary** | Contiene le FOTO delle gallerie | cloudinary.com |

**Regola pratica**:
- Se devi cambiare un **testo** (articolo, CV, descrizione libro) → vai su **WordPress**.
- Se devi cambiare delle **foto di una galleria** → vai su **Cloudinary**.
- Se devi cambiare la **grafica/layout** (colori, dimensioni, posizione delle cose) → si modifica il **codice Astro** e si pubblica su **GitHub**, che fa aggiornare **Vercel** da solo.

Quasi tutte le richieste che mi hai fatto finora ("il bottone è troppo grande",
"sposta questo più in alto", "aggiungi un box News") rientrano nell'ultimo
caso: si modifica il codice.

---

## 2. Dove accedere alle varie piattaforme

### 🐙 GitHub (il codice del sito)
- Indirizzo: https://github.com/cescali/cesarescalise.it
- Serve solo per vedere la cronologia delle modifiche; normalmente non devi
  mai toccarlo a mano, perché ci penso io tramite i comandi git (vedi sez. 6).

### ▲ Vercel (dove "vive" il sito online)
- Indirizzo: https://vercel.com/dashboard
- Login: con l'account GitHub `cescali`
- Qui puoi vedere:
  - lo stato dei **deploy** (pubblicazioni), con data/ora ed esito (verde = ok)
  - i **log** in caso di errore
  - le **variabili d'ambiente** (impostazioni segrete tipo password/chiavi)

### 📝 WordPress Admin (testi: blog, CV, Libri)
- Indirizzo: https://www.cesarescalise.it/wordpress/wp-admin
- Qui dentro:
  - **Articoli** → Blog del sito
  - **Pagine** → CV e pagina Libri (il testo dei libri si modifica qui)
  - **Media** → immagini in evidenza degli articoli

### ☁️ Cloudinary (foto delle gallerie)
- Indirizzo: https://cloudinary.com/console (fai login con l'account usato per il sito)
- Qui dentro ci sono delle **cartelle** (folder), una per ogni galleria.

---

## 3. Come modificare un articolo del blog

1. Vai su https://www.cesarescalise.it/wordpress/wp-admin
2. Accedi con utente e password
3. Nel menu a sinistra clicca **Articoli**
4. Clicca sull'articolo da modificare (o **Aggiungi nuovo** per crearne uno)
5. Modifica testo/titolo/immagine in evidenza
6. Clicca **Aggiorna** (o **Pubblica** se è nuovo)
7. **Non serve pubblicare nulla su Vercel**: il sito legge WordPress "al volo",
   quindi la modifica è visibile da subito (massimo qualche secondo).

### Cambiare l'immagine in evidenza di un articolo
1. Apri l'articolo in modifica
2. Nel pannello a destra cerca **Immagine in evidenza**
3. Clicca, carica la tua immagine da PC, poi **Imposta immagine in evidenza**
4. Aggiorna l'articolo

---

## 4. Come modificare il CV

1. WordPress Admin → **Pagine** → cerca la pagina **CV**
2. Modifica il testo
3. **Aggiorna**
4. Visibile subito sul sito, nessuna pubblicazione extra necessaria.

---

## 5. Come modificare/aggiungere un libro nella pagina "Libri"

Attenzione: questa pagina ha un formato particolare (immagine copertina a
sinistra, testo a destra, bottone "Disponibile su Amazon"), quindi il testo
in WordPress deve rispettare questa struttura:

1. WordPress Admin → **Pagine** → **Libri**
2. All'interno trovi un blocco con **immagine + testo affiancati**
   (si chiama blocco "Media e testo" in WordPress)
3. Per cambiare:
   - **Titolo del libro** → modifica il titolo (es. "Progetto Nemesis")
   - **Sottotitolo/tagline** → è il primo paragrafo sotto il titolo
   - **Descrizione** → il testo successivo
   - **Copertina** → clicca sull'immagine nel blocco e sostituiscila
   - **Link Amazon** → è un link di testo tipo "Disponibile su Amazon" dentro
     il blocco; il sito lo trasforma automaticamente in un bottone colorato
4. **Aggiorna** la pagina
5. Visibile subito sul sito

⚠️ Se aggiungi un **secondo libro**, serve probabilmente un piccolo intervento
sul codice (perché oggi il sito è costruito pensando a un libro); in quel
caso chiedimelo e sistemo il codice.

---

## 6. Come aggiungere/modificare una galleria fotografica (Cloudinary)

### Aggiungere una NUOVA galleria
1. Vai su https://cloudinary.com/console
2. Nel menu **Media Library** clicca **Create folder**
3. Dai il nome con questo formato: **"Nome Anno"** (esempio: `Grecia 2026`)
   - È importante scrivere l'anno alla fine: serve al sito per ordinare le
     gallerie dalla più recente alla più vecchia, automaticamente
4. Entra nella cartella appena creata
5. Trascina dentro le foto da caricare (drag & drop) oppure clicca **Upload**
6. Fatto! La galleria compare da sola sul sito, sia in homepage sia nella
   pagina "Gallerie" — non serve nessuna pubblicazione/commit.

### Aggiungere foto a una galleria esistente
1. Cloudinary → Media Library → apri la cartella della galleria
2. Trascina dentro le nuove foto
3. Visibile subito sul sito

### Cambiare la copertina di una galleria
- Il sito usa come copertina automaticamente una delle foto della cartella
  (di solito la prima). Se vuoi "forzare" una foto come copertina, chiedimelo:
  si può sistemare nel codice o rinominando il file.

### Eliminare una galleria
- Cloudinary → Media Library → cartella → **Delete folder** (elimina anche
  le foto contenute, attenzione)

---

## 7. Come modificare la GRAFICA del sito (colori, bottoni, spazi, layout)

Questa è la parte "tecnica", che di solito faccio io su richiesta. La spiego
comunque per completezza, nel caso in futuro vuoi farla da solo o capire cosa
succede.

### Dove si trova il codice
- Cartella sul PC: `C:\CESARE_DOC_PERSONALI\cesarescalise-new`
- Le pagine principali sono dentro `src\pages\`:
  - `index.astro` → Homepage
  - `blog\index.astro` → Lista articoli
  - `gallerie\index.astro` → Lista gallerie
  - `libri.astro` → Pagina Libri
  - `cv.astro` → Pagina CV

### Procedura tipo per una modifica grafica
1. **Modifica** il file interessato (testo, colori, dimensioni — scritti con
   classi Tailwind, es. `text-lg`, `bg-indigo-600`, `py-7`)
2. **Testa in locale** prima di pubblicare, per essere sicuri che non ci siano
   errori:
   ```
   npm run dev
   ```
   poi apri http://localhost:4321 nel browser
3. Se tutto ok, **verifica che il sito si costruisca senza errori**:
   ```
   npm run build
   ```
4. **Pubblica le modifiche** (invia il codice a GitHub, che fa aggiornare
   Vercel automaticamente):
   ```
   git add -A
   git commit -m "descrizione breve della modifica"
   git push origin main
   ```
5. Aspetta **1-2 minuti**: Vercel pubblica da solo la nuova versione.
6. Vai sul sito vero (cesarescalise.it) e verifica, magari con un **refresh
   forzato** (Ctrl+F5) per evitare di vedere la versione "vecchia" salvata
   dal browser.

### Come annullare una modifica che non va bene
Se una pubblicazione ha creato un problema, su Vercel:
1. vercel.com/dashboard → progetto del sito → tab **Deployments**
2. Trova l'ultimo deploy che funzionava bene
3. Clicca sui tre puntini **⋯** → **Promote to Production**
   (così torni a quella versione senza toccare il codice)

---

## 8. Variabili d'ambiente (impostazioni "segrete")

Sono delle impostazioni che NON sono scritte nel codice pubblico, per motivi
di sicurezza (password, chiavi). Si trovano su Vercel → progetto → **Settings
→ Environment Variables**:

| Nome | A cosa serve |
|---|---|
| `PUBLIC_WP_URL` | indirizzo di WordPress, per leggere articoli/CV/libri |
| `WP_ARUBA_IP` | indirizzo "diretto" del server Aruba (serve per motivi tecnici di rete) |
| `CLOUDINARY_CLOUD_NAME` | nome dell'account Cloudinary |
| `CLOUDINARY_API_KEY` | chiave per leggere le gallerie da Cloudinary |
| `CLOUDINARY_API_SECRET` | password segreta abbinata alla chiave sopra |

Se una di queste cambia (es. Aruba cambia indirizzo server, o si cambia
account Cloudinary), va aggiornata qui su Vercel. Dopo averla cambiata serve
rifare un deploy (su Vercel → Deployments → ⋯ → **Redeploy**) perché le
variabili vengono lette solo al momento della pubblicazione.

---

## 9. Dominio e indirizzo del sito

- Il dominio `cesarescalise.it` è registrato su **Aruba**
- Punta (tramite DNS) a **Vercel**, che è quello che mostra effettivamente il
  sito quando qualcuno scrive l'indirizzo nel browser
- Se mai serve cambiare dove punta il dominio: Aruba → pannello DNS → record
  che punta all'indirizzo fornito da Vercel

---

## 10. Problemi comuni e soluzioni rapide

| Sintomo | Causa probabile | Cosa fare |
|---|---|---|
| Il sito non si apre / pagina bianca | Vercel non ha pubblicato bene l'ultimo deploy | vercel.com → Deployments → controlla se l'ultimo è "Error" |
| Articoli del blog non compaiono | WordPress irraggiungibile o `WP_ARUBA_IP` cambiato | Controllare che www.cesarescalise.it/wordpress funzioni da browser |
| Non riesco a entrare in wp-admin, errore "Cross-site POST..." | Bug di sicurezza di Astro che blocca il login | Già risolto nel codice (`checkOrigin: false`); se riappare, avvisami |
| Una galleria non compare o è nell'ordine sbagliato | Il nome della cartella su Cloudinary non finisce con l'anno | Rinomina la cartella in formato "Nome AAAA" |
| Dopo una modifica il sito sembra "vecchio" | Cache del browser | Ctrl+F5 per ricaricare senza cache |
| Immagine in evidenza di un articolo non si vede | Non è stata impostata, o URL errato | WordPress → Articolo → Immagine in evidenza |

---

## 11. Piccolo glossario

- **Deploy / pubblicazione**: l'operazione con cui Vercel prende l'ultima
  versione del codice da GitHub e la mette online.
- **Commit**: uno "scatto fotografico" di una modifica al codice, con un
  messaggio che la descrive.
- **Push**: l'invio dei commit da PC a GitHub.
- **Repository (repo)**: la cartella del progetto salvata su GitHub.
- **Build**: il processo che trasforma il codice sorgente in un sito pronto
  da mostrare nel browser; se la build fallisce, il deploy non va a buon fine.
- **CMS (Content Management System)**: un programma per gestire i contenuti
  (testi, immagini) senza toccare il codice — nel nostro caso è WordPress.

---

## 12. Riassunto "chi fa cosa"

| Voglio fare questo... | Dove vado | Serve pubblicare su Vercel? |
|---|---|---|
| Cambiare testo di un articolo | WordPress | No |
| Aggiungere un nuovo articolo | WordPress | No |
| Cambiare il CV | WordPress | No |
| Cambiare testo/copertina di un libro | WordPress | No |
| Aggiungere una nuova galleria foto | Cloudinary | No |
| Aggiungere foto a galleria esistente | Cloudinary | No |
| Cambiare colori, bottoni, spazi, layout | Codice (Astro) | Sì, con git push |
| Aggiungere una nuova pagina del sito | Codice (Astro) | Sì, con git push |
| Cambiare dove punta il dominio | Aruba (DNS) | No |
