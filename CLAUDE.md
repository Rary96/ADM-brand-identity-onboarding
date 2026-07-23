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
  vedi Log 2026-07-23 in `doc/PROGRESS.md`). Due modi, entrambi disponibili sullo
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
- **Cookie banner (CookieYes)**: NON integrato in questo progetto — deciso
  dall'utente il 2026-07-23 ("non serve integrarli, almeno al momento"). Il
  form non usa cookie non tecnici/di profilazione, quindi non è bloccante per
  il deploy. Se in futuro dovesse servire (es. aggiunta di analytics/tracking),
  vedi la traccia di come si sarebbe dovuto fare in `doc/PROGRESS.md` (Log
  2026-07-23) — non reintrodurlo senza che l'utente lo richieda esplicitamente.
- **Pagina privacy** (`app/informativa-privacy/page.tsx`): titolare del
  trattamento Arianna Dal Monte (freelance, dati reali — P.IVA, sede, C.F. —
  nella pagina stessa), adattata da un template fornito dall'utente per un
  altro cliente, generalizzata e ridotta a quello che il form fa davvero
  (nessuna finalità di marketing/profilazione, nessun terzo oltre
  Google/Gmail come sub-responsabili tecnici, nessun cookie non tecnico).
  Linkata da `IntroScreen.tsx` e `ConsentStep.tsx` con `target="_blank"`
  (mai in-tab: il form non salva progressi tra sessioni, vedi decisione sopra
  — una navigazione in-tab perderebbe le risposte già inserite).

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
├── app/informativa-privacy/
│   └── page.tsx                # Pagina privacy policy (dati reali titolare, adattata da template)
├── doc/
│   └── PROGRESS.md            # Log cronologico dettagliato: decisioni, deviazioni dal piano, perché
```

Repo GitHub collegato: `Rary96/ADM-brand-identity-onboarding` (branch `main`).
Deployato in produzione su Vercel (piano Hobby, team "ADM Design"):
`https://adm-brand-identity-onboarding.vercel.app`. Push su `main` → redeploy
automatico in produzione (integrazione Vercel↔GitHub nativa, nessuna azione
manuale richiesta).

**Progetto completo: Step 1/3 (dati), Step 2/3 (UI/UX) e Step 3/3 (API) tutti
fatti.** `app/api/submit/route.ts` valida con `questionarioSchema`
server-side, scrive davvero su Google Sheets (`lib/google-sheets.ts`), invia
le due email via Nodemailer/Gmail SMTP con allegati diretti quando presenti
(`lib/mailer.tsx`). `QuestionnaireWizard.handleSubmit` invia un vero
`FormData` a `/api/submit`. Pagina privacy online. **Testato end-to-end anche
in produzione** (submission reale con allegato: riga corretta su Sheets,
entrambe le email ricevute, nessun errore) — vedi `doc/PROGRESS.md` per il
dettaglio del test.

## Stato

Non ci sono più fasi aperte sul flusso di invio del questionario. Eventuali
prossimi lavori (nuove domande, restyling, nuove integrazioni) partono da
zero come richieste separate — non c'è una checklist residua da questo piano.

Non in scope (deciso, non ridiscutere senza motivo): banner cookie/CookieYes —
vedi voce dedicata sopra in "Cosa è già stato deciso".

## Variabili d'ambiente (impostate su Vercel, Production e Preview)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=      # fatto, .env.local locale + Vercel
GOOGLE_PRIVATE_KEY=                # fatto, .env.local locale + Vercel
GOOGLE_SHEET_ID=                   # fatto, .env.local locale + Vercel
GMAIL_USER=                        # fatto, .env.local locale + Vercel (dalmontearianna.96@gmail.com)
GMAIL_APP_PASSWORD=                # fatto, .env.local locale + Vercel
```

Questi valori li genera/recupera l'utente (login Google Cloud Console, Google
Account, Vercel) — non vanno inventati né richiesti come input di codice.
Vivono solo in `.env.local` (gitignored) in locale e nelle Environment
Variables di Vercel in produzione — mai nel codice sorgente.
