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
  - Google Drive API (stesso Service Account) — upload file/immagini di riferimento,
    link salvato nella riga corrispondente su Sheets
  - Resend + React Email — invio notifiche
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
- **Upload file**: caricati su Google Drive via Service Account, link salvato su
  Google Sheets (non URL esterni per default, ma i campi accettano anche link se il
  cliente preferisce incollare un URL invece di caricare un file).
- **Nessun salvataggio progressi tra sessioni**: form completabile in un'unica
  sessione, stato in memoria React (nessun DB, coerente con lo stack scelto).
- **Solo italiano**, tono informale in seconda persona singolare ("tu").
- **Palette**: Pantone 13-3905 TCX "Diaphanous Lilac" → `#C6C2CD`, usata SOLO come
  accento limitato (progress bar, focus ring, pulsante primario, dettagli). Sfondo e
  testo restano neutri (bianco/grigi) per non influenzare le risposte estetiche del
  cliente, come fa Typeform. Vedi `lib/design-tokens.ts` per la palette completa.
- **Notifiche email (Resend)**: doppio invio a ogni submission —
  1. riepilogo completo a `dalmontearianna.96@gmail.com`
  2. email di conferma/ringraziamento al cliente (indirizzo dal campo `email` del form)
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
- **Upload file, stato attuale**: solo link incollato (Drive/Pinterest/Instagram/sito),
  non ancora vero upload da filesystem — vedi checklist "Cosa manca" sotto.

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
│       └── fields/                      # ChipsField, PillMultiSelectField, PriceScaleField,
│                                          # ToneScaleField, GridPositionField, UploadLinkField,
│                                          # ColorField, SupportsField, DeadlineField, SimpleFields
├── lib/
│   ├── schema.ts              # Zod schema + tipi TypeScript, branching, validazioni
│   ├── design-tokens.ts       # Palette colori, font, radii, timing animazioni
│   ├── questionnaire-steps.ts  # flatten domande sezioni + filtro branching nuovo/restyling
│   └── validate-step.ts         # validazione "leggera" per step (solo obbligatorietà)
├── content/
│   └── questionnaire.ts       # Copy IT: sezioni, domande, guida cliente, placeholder
```

Repo GitHub collegato: `Rary96/ADM-brand-identity-onboarding` (branch `main`).

**Step 1/3 (dati) e Step 2/3 (UI/UX) completati.** L'invio del form al momento è uno
STUB: `QuestionnaireWizard.handleSubmit` valida con `questionarioSchema` e fa solo
`console.log(result.data)` — nessuna scrittura reale su Sheets/Drive, nessuna email.

## Cosa manca per far funzionare davvero l'invio (Step 3/3 — API)

In ordine consigliato:

1. **Setup Google Cloud** (lato utente, non codice): creare/riusare un progetto GCP,
   abilitare Google Sheets API + Google Drive API, creare un Service Account e
   generarne la chiave JSON.
2. **Google Sheet di destinazione**: crearlo, condividerlo (ruolo Editor) con l'email
   del Service Account, recuperare lo Sheet ID.
3. **Cartella Google Drive di destinazione** per gli allegati: crearla, condividerla
   con lo stesso Service Account, recuperare il Folder ID.
4. **Account Resend**: dominio mittente verificato + API key; decidere l'indirizzo
   `RESEND_FROM_EMAIL`.
5. **`app/api/submit/route.ts`**: ri-validare il payload con `questionarioSchema`
   lato server (mai fidarsi solo del client), scrivere la riga su Google Sheets,
   caricare gli allegati su Drive, inviare le due email via Resend, rispondere
   con esito ok/errore.
6. **`emails/`**: due template React Email — riepilogo interno (a
   `dalmontearianna.96@gmail.com`) e conferma/ringraziamento al cliente (indirizzo
   preso dal campo `email` del form).
7. **Collegare il frontend**: `QuestionnaireWizard.handleSubmit` deve chiamare
   `fetch("/api/submit", ...)` al posto del `console.log` attuale, e gestire davvero
   gli errori di rete/server (oggi mostra solo errori di validazione locale).
8. **Upload file reale** (gap noto): oggi i campi `loghiRiferimento`,
   `stiliDaEvitare`, `assetEsistenti` accettano SOLO link incollati
   (`UploadLinkField`), non ancora un vero upload da file system. Va aggiunta una UI
   drag-and-drop/file-picker che mandi i file al server prima che possano finire su
   Drive — il link resta comunque come alternativa, come da decisione originale.
9. **Pagina informativa privacy**: intro e step di consenso citano già
   "l'informativa privacy" ma non esiste ancora una pagina/link reale — necessaria
   prima di raccogliere dati veri (GDPR).
10. **CookieYes**: script nel layout + banner cookie, variabile
    `NEXT_PUBLIC_COOKIEYES_ID`.
11. **Variabili d'ambiente su Vercel** (vedi sezione sotto) + deploy + test end-to-end
    in produzione con un invio reale.

## Variabili d'ambiente richieste (da configurare su Vercel, non nel codice)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_DRIVE_FOLDER_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_COOKIEYES_ID=
```

Questi valori li genera/recupera l'utente (login Google Cloud Console, Resend,
Vercel, CookieYes) — non vanno inventati né richiesti come input di codice.
