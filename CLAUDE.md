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

## Struttura file già creata

```
onboarding-brand-identity/
├── package.json
├── tailwind.config.ts
├── lib/
│   ├── schema.ts          # Zod schema + tipi TypeScript, branching, validazioni
│   └── design-tokens.ts   # Palette colori, font, radii, timing animazioni
├── content/
│   └── questionnaire.ts   # Copy IT: sezioni, domande, guida cliente, placeholder
```

Da creare nei prossimi step (in quest'ordine):

1. `app/` — pagine Next.js (form multi-step, pagina di ringraziamento)
2. `components/` — componenti UI (question renderer per ogni `FieldType`, progress
   bar, navigazione step con Framer Motion, integrazione shadcn/ui)
3. `emails/` — template React Email (notifica interna + conferma cliente)
4. `app/api/submit/route.ts` — validazione Zod server-side, scrittura su Google
   Sheets, upload su Google Drive, invio email via Resend
5. Setup CookieYes (script nel layout, banner cookie)

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
