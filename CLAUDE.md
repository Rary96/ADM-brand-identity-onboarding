# Progetto: Questionario Onboarding — Brand Identity & Logo Design

Modulo di onboarding clienti stile Typeform: transizioni fluide una domanda alla volta,
barra di progresso, UI curata e responsive, supporto tastiera (Invio/Enter).

## Ruolo

Agisci da Senior Full-Stack Developer + Expert UX/UI Designer.

## Stack tecnico

- **Framework & Styling**: Next.js (App Router), Tailwind CSS, Framer Motion per le
  transizioni tra step.
- **UI Library**: shadcn/ui per i componenti accessibili di base (Button, Input,
  Progress, Card, Dialog, ecc.).
- **Integrazioni & Backend**:
  - Google Sheets API (via Service Account) — salvataggio risposte
  - Nodemailer via SMTP Gmail (App Password) + React Email per il markup — invio
    notifiche, allegati diretti inclusi (max 2 file, 2MB ciascuno, sull'email
    interna). Non Resend: niente dominio da verificare, niente OAuth/refresh
    token da rinnovare (vedi decisione sotto). Se il volume di invii dovesse
    crescere molto, Resend torna la scelta più adatta — da rivalutare allora.
    Niente Google Drive: scartato a favore di allegati email + link (vedi
    decisione "Upload file" sotto).
  - CookieYes — banner cookie/consenso
  - Zod — validazione dati, sia client-side che server-side

## Regole di ingaggio

1. Fai riferimento ai file di questa cartella (`lib/schema.ts`, `lib/design-tokens.ts`,
   `content/questionnaire.ts`, `README.md`) come fonte di verità su dati, contenuti e
   decisioni di design già prese. Non rimetterle in discussione senza chiedere.
2. Procedi **step by step**: prima struttura dei file di progetto e schemi dati (già
   fatto, vedi sotto), poi UI/UX, poi logica delle API. Non generare tutto il codice in
   un unico blocco.
3. Sicurezza, non negoziabile:
   - Nessun secret nel codice sorgente.
   - Le credenziali (Service Account Google Cloud, Resend, ecc.) vivono solo in
     variabili d'ambiente su Vercel — mai committate, nemmeno in file `.env` versionati
     (usa `.env.local` in `.gitignore` per lo sviluppo locale).
   - Validazione dati sempre anche server-side con Zod, non fidarti solo del client.

## Cosa è già stato deciso (non ridiscutere senza motivo)

- **Branching nuovo brand / restyling**: una domanda iniziale in Sezione 2
  (`tipoProgetto`) mostra domande diverse a seconda del caso — vedi
  `lib/schema.ts` (superRefine) e `content/questionnaire.ts` (`visibleIf`).
- **Upload file**: NON su Google Drive (deciso e poi cambiato in corso d'opera —
  vedi Log 2026-07-23 in `PROGRESS.md`). Due modi, entrambi disponibili sullo
  stesso campo (`UploadLinkField.tsx`): allegato diretto via email (tetto
  GLOBALE su tutta la submission, non per campo, perché il body di una funzione
  serverless è limitato a ~4.5MB — vedi `lib/attachment-limits.ts`: max 2 file
  in totale, 2MB ciascuno, solo immagini comuni + PDF) oppure link incollato
  (Drive/WeTransfer/SwissTransfer/Pinterest/ecc.) senza alcun limite, per file
  più grandi o numerosi. Gli allegati diretti vanno solo nell'email interna
  (mai su Sheets come file — la nota della colonna corrispondente elenca solo
  i nomi), il link va anche su Sheets.
- **Nessun salvataggio progressi tra sessioni**: form completabile in un'unica
  sessione, stato in memoria React (nessun DB, coerente con lo stack scelto).
- **Solo italiano**, tono informale in seconda persona singolare ("tu").
- **Palette**: Pantone 13-3905 TCX "Diaphanous Lilac" → `#C6C2CD`, usata SOLO come
  accento limitato (progress bar, focus ring, pulsante primario, dettagli). Sfondo e
  testo restano neutri (bianco/grigi) per non influenzare le risposte estetiche del
  cliente, come fa Typeform. Vedi `lib/design-tokens.ts` per la palette completa.
- **Notifiche email**: doppio invio a ogni submission —
  1. riepilogo completo a `dalmontearianna.96@gmail.com`
  2. email di conferma/ringraziamento al cliente (indirizzo dal campo `email` del form)
  Invio via Nodemailer + SMTP Gmail (App Password su `dalmontearianna.96@gmail.com`),
  non Resend: valutato anche EmailJS (pensato per invio lato client, tier gratuito
  troppo piccolo) e Gmail API via OAuth2 (refresh token che scade dopo 7 giorni per
  app non verificate — rischio operativo per un invio automatico senza
  manutenzione). App Password: nessun dominio da verificare, invia a qualsiasi
  destinatario da subito. Vedi `lib/mailer.tsx`.
- **Contenuto del questionario**: 24 domande su 9 sezioni (una per pagina), solo 7
  obbligatorie a livello strategico (nome azienda, email, storia/feedback attuale,
  valori, USP, cliente ideale, competitor). Tutto il resto è facoltativo per ridurre
  l'abbandono. Vedi `README.md` per il dettaglio delle ottimizzazioni rispetto al
  brief originale.
- **Tempo stimato di compilazione**: 10-15 minuti, indicato in apertura e ripetuto a
  metà form come rinforzo (vedi `content/questionnaire.ts`: `introCopy`,
  `midFormReminder`).
- **shadcn/ui: versione classica (Radix + Tailwind v3), non l'ultima major**. La CLI
  `shadcn@latest` (v4, preset "base-nova") genera componenti su Base UI +
  Tailwind v4 (CSS-first, niente `tailwind.config.ts`), incompatibile con
  `tailwind.config.ts`/`design-tokens.ts` già decisi. Usato `shadcn@2.3.0`
  (Radix + `tailwind.config.ts` classico) — non fare l'upgrade senza discuterne,
  richiederebbe riscrivere la palette in CSS vars/oklch.
- **Campi array liberi senza opzioni predefinite** (`valori`, `canaliVendita`,
  `supportiEVincoli.supporti`, `formatiRichiesti`): lo schema li tipizza come
  `z.array(z.string())` senza enum, quindi in UI sono chip-input a testo libero
  (`ChipsField`), non checkbox con lista fissa — coerente con lo schema, non
  inventare una tassonomia di opzioni senza chiederlo.
- **Allegati email vs prop-drilling**: lo stato degli allegati (chi ha allegato
  cosa, tetto globale) vive in `AttachmentsContext` (React Context), non passato
  come prop attraverso `QuestionCard`/`FieldRenderer` — quei due restano
  dispatcher generici che non devono sapere nulla di allegati. Solo
  `UploadLinkField` consuma il context via `useFieldAttachments(fieldId)`.

## Struttura file già creata

```
onboarding-brand-identity/
├── package.json
├── tailwind.config.ts
├── components.json          # config shadcn/ui (style "default", Radix, non Base UI/v4)
├── app/
│   ├── layout.tsx            # font Inter, metadata
│   ├── page.tsx                # monta <QuestionnaireWizard />
│   └── globals.css              # tema shadcn (HSL vars) sopra palette lilla/neutri
├── components/
│   ├── ui/                      # primitive shadcn/ui (Radix + cva): button, input,
│   │                             # textarea, progress, radio-group, checkbox, slider, card
│   └── questionnaire/
│       ├── QuestionnaireWizard.tsx   # state machine: intro → domande → consenso → outro
│       ├── QuestionCard.tsx           # layout singola domanda + validazione + nav
│       ├── FieldRenderer.tsx           # smista ogni domanda al componente campo giusto
│       ├── ProgressBar.tsx / IntroScreen.tsx / OutroScreen.tsx / ConsentStep.tsx
│       ├── AttachmentsContext.tsx      # stato allegati email (tetto globale)
│       └── fields/                      # ChipsField, PillMultiSelectField, PriceScaleField,
│                                          # ToneScaleField, GridPositionField, UploadLinkField,
│                                          # ColorField, SupportsField, DeadlineField, SimpleFields
├── lib/
│   ├── schema.ts              # Zod schema + tipi TypeScript, branching, validazioni
│   ├── design-tokens.ts       # Palette colori, font, radii, timing animazioni
│   ├── questionnaire-steps.ts  # flatten domande sezioni + filtro branching nuovo/restyling
│   ├── validate-step.ts         # validazione "leggera" per step (solo obbligatorietà)
│   ├── attachment-limits.ts      # tetto/tipi ammessi per allegati email (usato client+server)
│   ├── google-sheets.ts           # scrittura riga su Sheets
│   ├── mailer.tsx                  # invio email via Nodemailer/Gmail SMTP
│   ├── email-sections.ts            # riepilogo email da content/questionnaire.ts
│   └── questionnaire-labels.ts       # enum → label italiane (condiviso Sheets/email)
├── emails/                     # template React Email (riepilogo interno, conferma cliente)
├── content/
│   └── questionnaire.ts       # Copy IT: sezioni, domande, guida cliente, placeholder
```

Repo GitHub collegato: `Rary96/ADM-brand-identity-onboarding` (branch `main`).

**Step 1/3 (dati) e Step 2/3 (UI/UX) completati. Step 3/3 (API) in corso:**
`app/api/submit/route.ts` valida con `questionarioSchema` server-side, scrive
davvero su Google Sheets (`lib/google-sheets.ts`), invia le due email via
Nodemailer/Gmail SMTP con allegati diretti quando presenti (`lib/mailer.tsx`) —
funzionante e testato end-to-end. `QuestionnaireWizard.handleSubmit` invia un
vero `FormData` a `/api/submit`, non più JSON con `console.log`.

## Cosa manca ancora per completare l'invio (Step 3/3 — API)

Fatto: Google Sheets, email (riepilogo interno + conferma cliente), upload
(allegati email + link, niente Drive). Ordine consigliato per il resto:

1. **Pagina informativa privacy**: intro e step di consenso citano già
   "l'informativa privacy" ma non esiste ancora una pagina/link reale — necessaria
   prima di raccogliere dati veri (GDPR). L'utente ha un testo esistente sul sito
   principale ADM da adattare.
2. **CookieYes**: script nel layout + banner cookie, variabile
   `NEXT_PUBLIC_COOKIEYES_ID`.
3. **Deploy su Vercel**: collegare il repo, impostare le env var (vedi sotto),
   test end-to-end in produzione con un invio reale.

## Variabili d'ambiente richieste (da configurare su Vercel, non nel codice)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=      # fatto, in .env.local
GOOGLE_PRIVATE_KEY=                # fatto, in .env.local
GOOGLE_SHEET_ID=                   # fatto, in .env.local
GMAIL_USER=                        # fatto, in .env.local (dalmontearianna.96@gmail.com)
GMAIL_APP_PASSWORD=                # fatto, in .env.local
NEXT_PUBLIC_COOKIEYES_ID=          # da fare (Fase privacy/cookie)
```

Questi valori li genera/recupera l'utente (login Google Cloud Console, Google
Account, Vercel, CookieYes) — non vanno inventati né richiesti come input di
codice. Quelli già raccolti vivono solo in `.env.local` (gitignored) in locale;
su Vercel andranno impostati come Environment Variables al momento del deploy.
