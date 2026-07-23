# Progress Log — Questionario Onboarding Brand Identity

Registro cronologico del progetto. Claude Code: aggiungi una nuova voce in fondo
(sezione "Log") ogni volta che completi uno step significativo — non riscrivere le
voci passate. Lo stato in cima ("Stato attuale") va invece tenuto aggiornato.

---

## Stato attuale

**Fase**: 3/4 quasi completa — **Google Sheets, Email e Upload funzionanti**:
ogni submission reale scrive una riga su Google Sheets, invia due email
(riepilogo interno + conferma cliente) via Nodemailer/Gmail SMTP (non Resend),
e i campi upload accettano allegati diretti (max 2 in totale, 2MB ciascuno,
solo sull'email interna) oltre al link incollato — **niente Google Drive**,
deciso e poi cambiato in corso d'opera (vedi Log). Testato end-to-end via
browser reale, inclusi due bug trovati e corretti durante il test. Restano da
fare, nell'ordine concordato: Privacy/Cookie → Deploy. Setup dei prossimi
account/servizi (CookieYes, Vercel) guidato passo-passo fase per fase.

| Fase | Cosa include | Stato |
|---|---|---|
| 1. Struttura file e schemi dati | `package.json`, `tailwind.config.ts`, `lib/schema.ts`, `lib/design-tokens.ts`, `content/questionnaire.ts` | ✅ Fatto (Cowork) |
| 2. UI/UX | `app/`, `components/` — form una domanda per volta, progress bar, keyboard nav | ✅ Fatto (Claude Code) |
| 3. API e integrazioni | `app/api/submit/route.ts`, Google Sheets ✅, email ✅, upload (allegati+link, niente Drive) ✅ | 🟡 In corso (privacy/cookie/deploy) |
| 4. Setup account esterni | Vercel, Resend, Google Cloud Service Account, CookieYes (azioni manuali dell'utente, non di Claude Code) | ⬜ Da fare |

---

## Contesto del progetto

Modulo di onboarding clienti per raccolta brief di Brand Identity/Logo Design,
stile Typeform (una domanda per schermata, transizioni fluide, barra di progresso).
Deve essere generalmente valido per qualsiasi cliente che lo compili (nuovo brand o
restyling), non personalizzato per singolo cliente — la palette lilla riflette
l'identità della professionista che lo usa, non quella del cliente che compila.

## Origine del contenuto

Il punto di partenza è stato un brief (`Questionario_Onboarding_Brand_Identity.docx`)
con un'analisi di una bozza esistente su Google Form e una proposta di struttura in
9 sezioni con 29 domande. Rispetto a quel brief, in questa fase di pianificazione
sono state apportate le seguenti modifiche:

- **Ridotte le domande da 29 a 24** (il brief stesso indicava un target di 20-28),
  accorpando: tono di voce + parole sì/mai in una domanda unica; supporti d'uso +
  vincoli tecnici in un'unica domanda.
- **Aggiunta una domanda di branching** all'inizio della Sezione 2
  ("È un nuovo brand o un restyling?") che mancava nel brief originale. In base alla
  risposta, cambia la domanda successiva: storia fondativa (nuovo brand) vs. cosa
  funziona/cosa cambiare dell'identità attuale (restyling). Il restyling rende inoltre
  effettivamente obbligatorio il campo "asset esistenti" in Sezione 8.
- **Obbligatorie solo 7 domande** su 24 (nome azienda+referente, email, storia/
  feedback attuale, valori, USP, cliente ideale, competitor) — in linea con la
  raccomandazione esplicita del brief di marcare come obbligatorie solo 6-8 domande
  davvero strategiche.

## Decisioni prese durante la pianificazione (Cowork)

Discusse e confermate con l'utente in chat, prima di passare allo sviluppo:

1. **Branching nuovo brand/restyling**: gestito con logica condizionale dinamica in
   un unico form (non due form separati), tramite il campo `tipoProgetto`.
2. **Upload immagini/loghi di riferimento**: salvati su Google Drive (stesso Service
   Account usato per Sheets), link scritto nella riga corrispondente del foglio.
   Scartate le alternative "solo link, niente upload" e "storage esterno dedicato".
3. **Nessun salvataggio/ripresa dei progressi tra sessioni**: coerente con uno stack
   senza database — form completabile in un'unica sessione, stato in memoria React.
   Scartate le alternative "localStorage" e "link di ripresa via email" (quest'ultima
   avrebbe richiesto un DB aggiuntivo).
4. **Setup progetto**: scaffold Next.js da zero (non repo esistente da estendere).
5. **Palette colore**: Pantone 13-3905 TCX "Diaphanous Lilac" → HEX `#C6C2CD`
   (confermato via ricerca web, fonte: Pantone color finder). Usato solo come accento
   molto limitato (progress bar, focus states, pulsante primario) su base neutra
   bianco/grigio, per non influenzare visivamente le risposte del cliente — stesso
   principio di neutralità di Typeform.
6. **Notifiche email**: doppio invio via Resend a ogni submission — riepilogo
   completo a `dalmontearianna.96@gmail.com` + email di conferma/ringraziamento al
   cliente.
7. **Lingua**: solo italiano (niente toggle multilingua).

## File prodotti in questa fase

Cartella `onboarding-brand-identity/`:

- `README.md` — riepilogo decisioni + struttura cartelle, pensato per chi apre il
  progetto la prima volta.
- `CLAUDE.md` — istruzioni di progetto per Claude Code: stack, regole di sicurezza
  (no secret nel codice, credenziali solo su env Vercel, validazione Zod anche
  server-side), decisioni da non ridiscutere, variabili d'ambiente richieste.
- `package.json` — dipendenze: Next.js, Tailwind, Framer Motion, Zod, googleapis,
  resend, react-email, lucide-react.
- `tailwind.config.ts` — collega i design tokens (colori, font, radii) a Tailwind.
- `lib/design-tokens.ts` — palette completa (accent lilla + scale neutre), font,
  radii, timing/easing delle transizioni tra step.
- `lib/schema.ts` — schema Zod completo del questionario: tutti i campi, enum
  (tipo progetto, posizionamento prezzo, archetipo, budget), branching con
  `superRefine`, validazioni condizionali.
- `content/questionnaire.ts` — copy italiano completo: 9 sezioni, 24 domande, label,
  guida/placeholder per ogni domanda aperta, testo intro/outro e reminder a metà form.

Verifica fatta: tutti gli id delle domande nel copy corrispondono 1:1 ai campi dello
schema Zod (controllo incrociato eseguito, nessuna discrepanza).

## Stack e strumenti (pattern riusabile per altri progetti)

Riepilogo tecnico pensato per essere copiato/adattato in progetti simili (form
multi-step con salvataggio su Google Workspace, senza DB dedicato).

**Framework & linguaggio**
- Next.js (App Router) + TypeScript, deploy target Vercel.
- Tailwind CSS v3 con `tailwind.config.ts` classico (non CSS-first/v4) — i design
  token (colori, font, radii, timing animazioni) vivono in `lib/design-tokens.ts`
  e vengono importati nel config Tailwind, non duplicati nel CSS.
- Framer Motion per le transizioni tra step (fade/slide, coerenti con timing nei
  design token).

**Componenti UI**
- shadcn/ui `2.3.0` (Radix UI + Tailwind, **non** la major più recente
  `shadcn@latest`/"base-nova" che usa Base UI + Tailwind v4 CSS-first — pin
  necessario per compatibilità con `tailwind.config.ts` classico). Componenti
  copiati in `components/ui/` (non un pacchetto npm), personalizzabili liberamente.
- Pattern "wizard": un componente state machine (`QuestionnaireWizard.tsx`) che
  orchestra intro → domande (una per step, filtrate/branchate) → consenso → outro;
  un componente `QuestionCard.tsx` per layout/validazione/navigazione della singola
  domanda; un `FieldRenderer.tsx` che smista ogni domanda al componente campo
  giusto in base al tipo definito nello schema.

**Validazione & contenuti**
- Zod come unica fonte di verità sui dati: schema in `lib/schema.ts`, usato sia
  per validazione "leggera" per-step (`lib/validate-step.ts`, solo obbligatorietà)
  sia per la validazione completa finale (client e poi server, mai solo client).
  Branching condizionale (es. "nuovo brand" vs "restyling") gestito con
  `superRefine` nello schema + flag `visibleIf` nel copy, non con form separati.
- Copy/contenuti testuali separati dal codice UI in `content/questionnaire.ts` —
  permette di editare testi/etichette senza toccare i componenti.

**Integrazioni previste (Step 3, non ancora implementate)**
- Google Sheets + Google Drive via un unico Service Account GCP (no OAuth utente).
- Resend + React Email per le notifiche transazionali (doppio invio: interno +
  conferma cliente).
- CookieYes per il banner cookie (script + env var, nessuna libreria custom).
- Nessun database: stato del form solo in memoria React, submission unica.

**Sicurezza**
- Zero secret nel codice: tutte le credenziali (Service Account, Resend, CookieYes)
  solo come env var su Vercel, `.env.local` in `.gitignore` per lo sviluppo locale.
- Validazione dati sempre ripetuta server-side con lo stesso schema Zod usato dal
  client, anche se il client ha già validato.

## Cose ancora da decidere/verificare prima del deploy

- Generare le credenziali reali: Service Account Google Cloud (email + private key),
  ID del Google Sheet e della cartella Drive di destinazione, account Resend +
  dominio mittente verificato, snippet CookieYes.
- Testo esatto dell'informativa privacy/GDPR da linkare nel consenso (`consensoPrivacy`
  nello schema) — al momento è solo un placeholder di riferimento generico nell'intro.
- Contenuto definitivo delle due email (interna + cliente) — layout React Email non
  ancora scritto.
- Eventuali refinement di palette/font una volta vista la UI reale (step 2).

---

## Log

**2026-07-23 — Cowork** — Analisi brief, ottimizzazione contenuti (29→24 domande,
aggiunta branching nuovo brand/restyling), raccolta decisioni architetturali
dall'utente, creazione struttura file + schema dati (fase 1/4). Creati `README.md`,
`CLAUDE.md`, `PROGRESS.md`.

**2026-07-23 — Claude Code** — Costruita la UI step-by-step completa (fase 2/4):
scaffold Next.js/Tailwind/shadcn (pin `shadcn@2.3.0`) + Framer Motion, state machine
`QuestionnaireWizard` (intro → domande branchate → consenso → outro), componente
`QuestionCard` con validazione e navigazione da tastiera (Invio), `FieldRenderer` e
11 componenti campo dedicati in `components/questionnaire/fields/` (chip input,
mappa posizionamento 2D drag, slider tono di voce, color picker, upload-by-link,
ecc.). Testato il flusso end-to-end e corretto un bug nello schema (`canaliVendita`
mancava `.optional()`, faceva fallire lo step anche quando il campo non era
obbligatorio). L'invio del form resta uno STUB (valida con `questionarioSchema` e fa
`console.log`, nessuna scrittura reale). Aggiornato `CLAUDE.md` con lo stato reale
del progetto e la checklist ordinata per lo Step 3 (API).

**2026-07-23 — Claude Code** — Pianificazione dettagliata dello Step 3/4 (API e
integrazioni), nessun codice scritto in questa sessione. Decisioni chiave del piano:

- **Upload separato dal submit**: `app/api/upload/route.ts` (un file per chiamata,
  multipart) distinto da `app/api/submit/route.ts` (solo JSON leggero) — le
  Serverless Function Vercel hanno un limite ~4.5MB sul body, un unico POST con
  tutto il questionario + file reali lo supererebbe. L'URL Drive risultante
  dall'upload finisce nello stesso array `urls` già usato dai link incollati:
  **zero modifiche a `lib/schema.ts`**.
- **Google Sheets**: un tab `Risposte`, append-only (`values.append`), una colonna
  per ogni sotto-campo degli oggetti annidati, array serializzati con `join(", ")`,
  enum tradotti nelle label italiane già presenti in `content/questionnaire.ts`
  (stessa fonte della UI), più una colonna finale con il JSON completo come rete di
  sicurezza. Dettaglio completo (50 colonne) nel piano tecnico salvato a parte.
- **Google Drive**: una sottocartella per submission (creata al volo al primo
  upload, id tenuto in state React), permesso `reader`/`anyone` sui file caricati
  così i link su Sheets/email sono apribili senza login. Nota operativa: la
  cartella di destinazione va creata da un account Google reale (non dal Service
  Account, che non ha quota di storage propria) e condivisa come Editor col
  Service Account.
- **Filosofia errori**: Sheets è la fonte di verità (se fallisce, 500 e l'utente
  può ripremere "Invia" senza perdere le risposte già compilate); le due email
  Resend sono best-effort via `Promise.allSettled` — se falliscono si logga
  server-side ma la risposta al client resta positiva, perché i dati sono comunque
  salvati.
- **Email**: template React Email in `emails/`, contenuto costruito da una
  funzione condivisa che itera `content/questionnaire.ts` (si aggiornano da soli
  se cambia una domanda), riepilogo completo interno + conferma breve al cliente
  (non il dump completo, per non essere invadenti).
- **Ordine di implementazione concordato con l'utente**: Sheets → Email → Upload
  file reale → Privacy policy (testo esistente ADM da adattare) + CookieYes →
  Deploy su Vercel. Ogni fase con setup account esterno parte con istruzioni
  passo-passo prima di scrivere codice; credenziali solo in `.env.local`
  (gitignored) e Vercel Environment Variables, mai nel codice.

Piano tecnico completo (mapping colonne Sheets campo-per-campo, pseudocodice delle
route API, struttura file `emails/`) salvato anche come plan file Claude Code
locale — se non più disponibile, questo log è sufficiente per ricostruirlo.

**2026-07-23 — Claude Code** — Implementata la Fase 1 del piano: integrazione
Google Sheets reale, prima parte funzionante dello Step 3/4.

- Guidato l'utente passo-passo nella creazione di progetto GCP, abilitazione Google
  Sheets API, Service Account + chiave JSON, foglio Google Sheet (tab `Risposte`,
  50 colonne di header) condiviso col Service Account. Credenziali ricevute in
  chat e scritte solo in `.env.local` (gitignored), mai stampate altrove né
  committate.
- Nuovo `lib/questionnaire-labels.ts`: helper condiviso che traduce i valori enum
  (es. `tipoProgetto`, `archetipo`, `budget`) nelle label italiane già definite in
  `content/questionnaire.ts` — stessa fonte di verità della UI, riusabile anche
  per i template email della prossima fase.
- Nuovo `lib/google-sheets.ts`: `appendSubmissionRow` — costruisce la riga di 50
  colonne (una per sotto-campo degli oggetti annidati, array con `join(", ")`,
  ultima colonna JSON completo come rete di sicurezza) e fa `values.append` sul
  tab `Risposte`.
- Nuovo `app/api/submit/route.ts`: valida con `questionarioSchema` server-side,
  scrive su Sheets, 400 se dati invalidi, 500 con messaggio se Sheets fallisce,
  200 `{ok:true}` se ok.
- `QuestionnaireWizard.tsx`: `submissionId` generato una volta al mount,
  `handleSubmit` ora è una vera `fetch("/api/submit", ...)` con gestione errori
  reale (le risposte non vengono perse se l'invio fallisce, l'utente può
  ripremere "Invia").
- Verificato end-to-end due volte: chiamata diretta all'API (curl) e flusso
  completo in browser reale (Playwright headless) — in entrambi i casi la riga è
  arrivata su Sheets nelle colonne giuste, poi rimossa perché erano solo dati di
  test.

Non ancora fatto: email (Resend), upload file reale su Drive, pagina privacy,
CookieYes, deploy — vedi piano per l'ordine.

**2026-07-23 — Claude Code** — Implementata la Fase 2 del piano: invio email
reale, seconda parte funzionante dello Step 3/4. **Deviazione dal piano
originale**: niente Resend.

- In chat è emerso che l'utente non ha un dominio da verificare (necessario per
  Resend) e non vuole comprarne uno solo per questo. Valutate tre alternative:
  EmailJS (scartato: pensato per invio lato client, tier gratuito 200
  richieste/mese troppo piccolo per uso server-side); Gmail API via OAuth2
  (scartato: per app non verificate da Google il refresh token scade dopo 7
  giorni, rischio concreto per un invio automatico senza manutenzione);
  **Nodemailer + SMTP Gmail con App Password** (scelto: nessun dominio,
  nessun OAuth/scadenza, invia a qualsiasi destinatario da subito, zero servizi
  terzi in più oltre Google che già si usa per Sheets/Drive). Limite noto e
  accettato: ~500 email/giorno (account Gmail gratuito), ben oltre il volume di
  questo form. **Se in futuro serve un volume di invii molto più alto, Resend
  torna la scelta più adatta** — da rivalutare solo allora.
- Mittente: `dalmontearianna.96@gmail.com` (App Password generata dall'utente,
  ricevuta in chat e scritta solo in `.env.local`, mai altrove).
- `package.json`: rimossa la dipendenza `resend`, aggiunte `nodemailer` e
  `@react-email/render` (esplicita, prima solo transitiva).
- Nuovo `lib/email-sections.ts`: costruisce la struttura sezione→campi per il
  riepilogo email iterando `content/questionnaire.ts` (stessa fonte della UI),
  omette i facoltativi vuoti — si aggiorna da solo se cambia una domanda.
- Nuovo `emails/` (React Email): `components/EmailLayout.tsx` e
  `components/SectionBlock.tsx` condivisi, `InternalSummaryEmail.tsx` (riepilogo
  completo a `dalmontearianna.96@gmail.com`), `ClientConfirmationEmail.tsx`
  (ringraziamento breve, copy riusata da `outroCopy` in
  `content/questionnaire.ts`, non il dump completo).
- Nuovo `lib/mailer.tsx` (estensione `.tsx` perché contiene JSX): trasporto
  Nodemailer su `smtp.gmail.com`, `sendInternalSummaryEmail` e
  `sendClientConfirmationEmail`.
- `app/api/submit/route.ts`: dopo la scrittura su Sheets, invio delle due email
  **best-effort** via `Promise.allSettled` — un errore di invio viene solo
  loggato server-side, la risposta al client resta positiva perché i dati sono
  comunque salvati (stessa filosofia già decisa nel piano).
- `CLAUDE.md` e `PROGRESS.md` (questo file) aggiornati per riflettere il cambio
  Resend → Nodemailer/Gmail SMTP.
- Verificato end-to-end: submission di test via API diretta con `dalmontearianna.96@gmail.com`
  come destinatario cliente (per poter controllare la ricezione), nessun errore
  nei log del server (entrambi gli invii SMTP completati). Riga di test rimossa
  da Sheets dopo la verifica.

Non ancora fatto: upload file reale su Drive, pagina privacy, CookieYes, deploy —
vedi piano per l'ordine.

**2026-07-23 — Claude Code** — Implementata la Fase 3 del piano: upload file.
**Deviazione dal piano originale**: niente Google Drive.

- In chat l'utente ha chiesto se allegare i file via email invece di Drive fosse
  fattibile, con un tetto tipo "2 allegati sotto 2MB". Confermato fattibile col
  vincolo che il tetto dev'essere **globale su tutta la submission** (non per
  singolo campo upload): il body di una funzione serverless è limitato a
  ~4.5MB sull'intera richiesta, e i campi upload nello schema sono 3
  (`loghiRiferimento`, `stiliDaEvitare`, `assetEsistenti`) — un tetto "2×2MB"
  per ciascuno avrebbe potuto sommare fino a 12MB.
- Decisione finale (dall'utente): **entrambe le opzioni disponibili sullo stesso
  campo** — allegato diretto (max 2 file totali, 2MB ciascuno, solo su email
  interna) per file piccoli, link incollato (Drive personale del cliente,
  WeTransfer, SwissTransfer, Pinterest, ecc.) senza limiti per file più grandi o
  numerosi. Questo elimina completamente la necessità di Google Drive/API
  aggiuntive: nessun nuovo setup esterno richiesto per questa fase.
- Nuovo `lib/attachment-limits.ts`: costanti condivise client+server (max 2
  file, 2MB, tipi ammessi JPG/PNG/WEBP/SVG/PDF) — stessa fonte per validazione
  UI immediata e ri-validazione server (mai fidarsi solo del client).
- Nuovo `components/questionnaire/AttachmentsContext.tsx`: stato allegati e
  tetto globale via React Context invece di prop-drilling attraverso
  `QuestionCard`/`FieldRenderer`, che restano dispatcher generici.
- `UploadLinkField.tsx`: aggiunta area "allega file" accanto al link esistente,
  con contatore condiviso tra i 3 campi upload e messaggio chiaro quando il
  tetto globale è raggiunto ("usa un link per altri file").
- `content/questionnaire.ts`: testo guida delle 3 domande upload aggiornato per
  indicare esplicitamente formati e limiti ammessi (richiesto esplicitamente
  dall'utente, non lasciarlo solo nella UI del componente).
- `QuestionnaireWizard.handleSubmit`: da JSON a `FormData` (dati + eventuali file
  allegati in un'unica richiesta multipart a `/api/submit`).
- `app/api/submit/route.ts`: da `request.json()` a `request.formData()`,
  ri-validazione server-side di tipo/size/conteggio allegati.
- `lib/mailer.tsx`: `sendInternalSummaryEmail` ora accetta e allega i file
  (solo sull'email interna, mai su quella cliente). `lib/google-sheets.ts`:
  le colonne "note" dei 3 campi upload segnalano il nome dei file allegati via
  email quando presenti (i file non finiscono mai come colonna/link su Sheets).
- **Due bug trovati e corretti testando in browser reale** (non solo via API
  diretta): (1) `lib/validate-step.ts` considerava obbligatorio-non-soddisfatto
  un campo upload anche con un allegato valido, perché controllava solo
  `urls`/`note` e non sapeva nulla degli allegati — corretto passando
  `hasAttachment` a `validateStep`; (2) allegare un file senza mai toccare
  l'input link lasciava `answers[fieldId]` `undefined`, facendo fallire la
  validazione Zod finale con l'errore generico "Required" al momento
  dell'invio — corretto chiamando `onChange(value)` anche quando si allega un
  file, per registrare comunque il valore (anche di default) nello stato.
- Verificato end-to-end in browser reale (Playwright) con un file vero
  allegato: submission riuscita (200 `{ok:true}`), nota corretta su Sheets
  ("+ 1 allegati email: test-logo.png"), nessun errore nei log del server.
  Riga di test rimossa da Sheets dopo la verifica.
- `CLAUDE.md` aggiornato: rimossi tutti i riferimenti a Google Drive
  dell'integrazione upload.

Non ancora fatto: pagina privacy, CookieYes, deploy — vedi piano per l'ordine.
