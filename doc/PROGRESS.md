# Progress Log — Questionario Onboarding Brand Identity

Registro cronologico del progetto. Claude Code: aggiungi una nuova voce in fondo
(sezione "Log") ogni volta che completi uno step significativo — non riscrivere le
voci passate. Lo stato in cima ("Stato attuale") va invece tenuto aggiornato.

---

## Stato attuale

**Fase**: 🎉 **Progetto completo e in produzione.** Google Sheets, Email,
Upload, pagina privacy e deploy su Vercel tutti funzionanti e testati — anche
in produzione, con una submission reale (allegato incluso): riga corretta su
Sheets, entrambe le email ricevute, nessun errore. URL pubblico:
`https://adm-brand-identity-onboarding.vercel.app` (piano Hobby, team "ADM
Design"). Push su `main` → redeploy automatico, nessuna azione manuale
richiesta per gli aggiornamenti futuri. **CookieYes non è stato integrato**
(deciso dall'utente, vedi Log) — il form non usa cookie non tecnici.

| Fase | Cosa include | Stato |
|---|---|---|
| 1. Struttura file e schemi dati | `package.json`, `tailwind.config.ts`, `lib/schema.ts`, `lib/design-tokens.ts`, `content/questionnaire.ts` | ✅ Fatto (Cowork) |
| 2. UI/UX | `app/`, `components/` — form una domanda per volta, progress bar, keyboard nav | ✅ Fatto (Claude Code) |
| 3. API e integrazioni | `app/api/submit/route.ts`, Google Sheets ✅, email ✅, upload (allegati+link, niente Drive) ✅ | ✅ Fatto |
| 4. Privacy | `app/informativa-privacy/page.tsx`, link da intro/consenso | ✅ Fatto |
| 5. Deploy su Vercel | Progetto collegato, env var impostate, test end-to-end in produzione | ✅ Fatto |

**Non in scope**: CookieYes/banner cookie — deciso di non integrarlo per questo
progetto (vedi Log 2026-07-23).

## Limiti noti (strumenti scelti gratuiti / per carico leggero)

Ogni scelta qui sotto è stata fatta consapevolmente per un progetto a basso
volume (un form di onboarding, non un prodotto ad alto traffico). Se il
contesto cambia, questi sono i punti da rivalutare per primi:

- **Vercel piano Hobby (gratuito)**: i ToS di Vercel lo riservano a uso non
  commerciale — se il questionario diventasse uno strumento a pagamento o
  con volumi alti andrebbe rivalutato l'upgrade a Pro (nessuna riconfigurazione
  necessaria, solo un cambio di piano). Limiti tecnici del piano: bandwidth
  mensile e durata massima delle funzioni serverless inferiori al piano Pro —
  non un problema al volume attuale.
- **Nodemailer + Gmail SMTP con App Password (non Resend)**: tetto non
  ufficiale di ~500 email/giorno per account Gmail gratuiti, ben oltre il
  volume di questo form. Nessuna dashboard di deliverability/bounce come un
  servizio email transazionale dedicato. **Da rivalutare (torna Resend)** se
  il volume di invii dovesse crescere molto.
- **Niente Google Drive per gli upload**: il tetto di 2 file/2MB totali per
  submission non è solo una scelta di semplicità ma anche un vincolo tecnico
  reale — il body di una funzione serverless è limitato a ~4.5MB. Per file
  più grandi o numerosi il cliente deve usare un link esterno (Drive/
  WeTransfer/ecc.), non un vero upload.
- **Google Sheets come "database"**: adatto al volume di un form di
  onboarding (poche submission), non pensato per query/filtri complessi né
  per scritture concorrenti ad alto volume.
- **Nessun salvataggio progressi tra sessioni (niente DB)**: se il cliente
  chiude il browser a metà compilazione, perde le risposte date fino a quel
  punto — conseguenza diretta della scelta di non usare un database.

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

**2026-07-23 — Claude Code** — Decisione: niente CookieYes per questo progetto.

- L'utente ha valutato che al momento non serve integrare un banner
  cookie/CookieYes per questo form: nessun cookie non tecnico o di
  profilazione in uso (nessun analytics/tracking di terze parti configurato).
- Richiesta esplicita: **tenere traccia di come si dovrebbe fare**, per
  riprendere in futuro se dovesse servire (es. se si aggiungesse analytics),
  ma **non sviluppare l'integrazione ora**.
- Come si sarebbe fatto (per riferimento futuro, dal piano originale Fase 4):
  creare un account CookieYes, recuperare l'ID sito, aggiungere lo script
  CookieYes in `app/layout.tsx` (nel `<head>`, prima di qualsiasi altro
  script/tag di terze parti) tramite `NEXT_PUBLIC_COOKIEYES_ID`, e verificare
  che il banner compaia al primo caricamento.
- Rimosso ogni riferimento attivo a CookieYes da `CLAUDE.md` (stack tecnico,
  checklist "cosa manca", env var richieste), spostato in una voce dedicata
  di "Cosa è già stato deciso" così da non essere riproposto senza che
  l'utente lo richieda esplicitamente.
- La Fase 4 del piano si riduce quindi alla sola pagina privacy; la Fase 5
  (deploy) resta invariata, semplicemente senza `NEXT_PUBLIC_COOKIEYES_ID` tra
  le env var da impostare su Vercel.

**2026-07-23 — Claude Code** — Implementata la Fase 4 del piano: pagina privacy.

- L'utente ha fornito come esempio la privacy policy di un altro proprio
  cliente (agenzia viaggi, con partner terzo per pagamenti/prenotazioni,
  profilazione/marketing, CookieYes) da adattare e generalizzare mantenendo
  la stessa struttura di paragrafi, riducendola a quello che questo form fa
  davvero.
- Dati reali del titolare forniti dall'utente in chat (P.IVA, C.F., sede,
  email di contatto `dalmontearianna.96@gmail.com`, nessuna PEC) — non
  inventati, scritti direttamente nella pagina (non sono secret, sono dati
  che per legge vanno resi pubblici in un'informativa privacy).
- Nuova `app/informativa-privacy/page.tsx`: 7 sezioni (Titolare, Categorie di
  dati, Base giuridica e finalità con sotto-sezioni su conservazione e
  modalità di raccolta, Modalità del trattamento, Comunicazione a terzi,
  Tutela dei minori, Diritti dell'interessato). A differenza del template
  originale: **niente marketing/newsletter/profilazione** (il form raccoglie
  dati solo per gestire la richiesta di progetto, nessuna finalità
  commerciale ulteriore concordata con l'utente), **niente terze parti
  operative** (il template aveva un partner tour-operator; qui i soli
  "fornitori terzi" sono Google/Gmail per Sheets ed email, e l'hosting),
  **niente riferimento a CookieYes** (coerente con la decisione di non
  integrarlo, vedi voce precedente in questo Log).
- Styling coerente col resto dell'app: neutrali dominanti, accento lilla
  solo su link (stessa palette di `lib/design-tokens.ts`), nessuna nuova
  dipendenza (niente plugin `@tailwindcss/typography`, markup manuale con
  componenti `Section`/`SubSection` locali alla pagina).
- Collegata da due punti che già citavano "l'informativa privacy" come testo
  libero: `IntroScreen.tsx` (nota sotto il bottone "Inizia") e
  `ConsentStep.tsx` (checkbox di consenso finale) — entrambi i link aprono
  in una **nuova scheda** (`target="_blank"`), scelta obbligata perché il
  form non salva progressi tra sessioni (stato solo in memoria React): un
  link in-tab avrebbe fatto perdere all'utente tutte le risposte già date.
  Su `ConsentStep.tsx` aggiunto anche `stopPropagation` sul click del link,
  perché è annidato in un `<label>` che attiva il Checkbox Radix al click:
  senza, cliccare sul link avrebbe anche (in)avvertitamente spuntato/tolto
  il consenso.
- Verificato: `npm run build` pulito, nessun nuovo errore/warning di tipo.
  Test in browser reale (Playwright): pagina `/informativa-privacy`
  raggiungibile (200, screenshot controllato manualmente), nessun errore
  console; link da `IntroScreen` verificato per `href` (`/informativa-privacy`)
  e `target` (`_blank`).
- `CLAUDE.md` aggiornato: nuova voce in "Cosa è già stato deciso" sulla
  pagina privacy, checklist "Cosa manca" ridotta al solo deploy, struttura
  file aggiornata.

Non ancora fatto: deploy su Vercel — vedi piano per i dettagli (collegare
repo, impostare env var, test end-to-end in produzione).

**2026-07-23 — Claude Code** — Implementata la Fase 5 del piano: deploy su
Vercel. **Progetto completo.**

- Account Vercel creato con login GitHub, piano **Hobby** (scelta consapevole
  dell'utente dopo aver confrontato con Pro: Hobby è gratuito ma riservato a
  uso non commerciale per i ToS di Vercel — visto il volume bassissimo del
  progetto l'utente ha preferito partire da lì, con possibilità di upgrade a
  Pro in qualsiasi momento senza dover riconfigurare nulla).
- Progetto importato da `Rary96/ADM-brand-identity-onboarding` (branch
  `main`), preset Next.js auto-rilevato, Root Directory `./` (il repo
  coincide con la cartella del progetto, nessuna sotto-cartella da
  configurare).
- 5 variabili d'ambiente impostate su Vercel (Production + Preview):
  `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SHEET_ID`, `GMAIL_USER`,
  `GMAIL_APP_PASSWORD` incollate in blocco (Vercel spezza da sé il formato
  `CHIAVE=valore` multi-riga), `GOOGLE_PRIVATE_KEY` aggiunta a parte in una
  riga singola (troppo lunga/particolare per l'auto-parsing, valore incollato
  senza le virgolette singole usate solo in `.env.local` per il parsing
  locale).
- Primo deploy completato con successo. URL pubblico:
  `https://adm-brand-identity-onboarding.vercel.app`. Confermato che ogni
  push su `main` triggera un redeploy automatico in produzione (integrazione
  nativa Vercel↔GitHub, nessuna azione manuale richiesta per gli
  aggiornamenti futuri).
- **Verificato end-to-end in produzione** con una submission reale via
  Playwright (non solo build/health-check): compilazione completa del
  questionario con un allegato reale (`test-logo.png`) su
  `https://adm-brand-identity-onboarding.vercel.app`, risposta
  `POST /api/submit` → `200 {"ok":true}`, nessun errore console, raggiunta la
  schermata "Fatto". Riga corrispondente controllata su Google Sheets (nota
  allegato corretta: "+ 1 allegati email: test-logo.png") tramite script
  temporaneo con le stesse credenziali del Service Account, poi rimossa
  (era solo di test). L'utente ha confermato manualmente la ricezione di
  entrambe le email (riepilogo interno + conferma cliente) sulla propria
  casella — unico passaggio non verificabile da Claude Code, che non ha
  accesso alla casella Gmail dell'utente.
- `CLAUDE.md` e questo file aggiornati: nessuna fase residua sul flusso di
  invio del questionario, checklist "Cosa manca" rimossa, tabella di stato
  tutta a ✅.

**Stato finale**: le 5 fasi del piano Step 3/4 (Sheets → Email → Upload →
Privacy → Deploy) sono tutte completate e verificate, comprese le tre
deviazioni concordate lungo il percorso (niente Resend, niente Google Drive,
niente CookieYes — vedi voci di Log precedenti per il dettaglio di ciascuna).
Il questionario è pubblicamente raggiungibile e funzionante.
