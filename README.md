# Questionario Onboarding — Brand Identity & Logo Design

Modulo di onboarding clienti stile Typeform (una domanda per schermata, transizioni
fluide, barra di progresso) per la raccolta del brief di Brand Identity/Logo Design.

**Stato**: 🎉 Progetto completo e in produzione:
[adm-brand-identity-onboarding.vercel.app](https://adm-brand-identity-onboarding.vercel.app)
(Vercel, piano Hobby). Testato end-to-end anche in produzione con una
submission reale. Push su `main` → redeploy automatico. Dettaglio completo
delle decisioni, delle deviazioni dal piano originale e del perché in
[`doc/PROGRESS.md`](doc/PROGRESS.md) e in [`CLAUDE.md`](CLAUDE.md) (sezione
"Cosa è già stato deciso").

## Decisioni prese

- **Branching nuovo brand / restyling**: una domanda iniziale in Sezione 2 mostra
  domande diverse a seconda del caso (vedi `content/questionnaire.ts`, campo
  `tipoProgetto`).
- **Salvataggio risposte**: Google Sheets via Service Account (`lib/google-sheets.ts`),
  append-only, una riga per submission.
- **Upload file**: niente Google Drive (deciso e poi cambiato in corso d'opera).
  Ogni campo upload accetta allegato diretto via email (tetto globale 2 file,
  2MB ciascuno, solo sull'email interna) oppure link incollato (Drive personale
  del cliente, WeTransfer, Pinterest, ecc.), senza limiti — vedi
  `lib/attachment-limits.ts`.
- **Notifiche email**: doppio invio ad ogni submission (riepilogo interno +
  conferma cliente) via **Nodemailer + SMTP Gmail (App Password)**, non Resend —
  l'utente non ha un dominio da verificare (richiesto da Resend) e non vuole
  comprarne uno solo per questo. Se il volume di invii dovesse crescere molto,
  Resend torna la scelta più adatta, da rivalutare solo allora. Vedi
  `lib/mailer.tsx`.
- **Cookie banner (CookieYes)**: non integrato per questo progetto (nessun
  cookie non tecnico/di profilazione in uso). Traccia di come si farebbe se
  servisse in futuro conservata in `doc/PROGRESS.md`.
- **Pagina privacy**: `/informativa-privacy`, dati reali del titolare, adattata
  da un template esistente e ridotta a quello che il form fa davvero.
- **Nessun salvataggio progressi tra sessioni**: form completabile in un'unica
  sessione (stato in memoria, nessun DB).
- **Solo italiano.**
- **Palette**: Pantone 13-3905 TCX "Diaphanous Lilac" → `#C6C2CD`, usato in modo
  molto limitato (accenti, progress bar, focus states) su base neutra
  bianco/grigio. Vedi `lib/design-tokens.ts`.

## Contenuto ottimizzato rispetto al brief originale

- Ridotto da 29 a 24 domande (target 20-28 del brief), accorpando alcune domande di dettaglio (tono di voce + parole; supporti d'uso + vincoli tecnici).
- Obbligatorie solo le 7 domande davvero strategiche, come raccomandato nel brief: nome azienda, email, storia/feedback attuale, valori, USP, cliente ideale, competitor. Tutto il resto è facoltativo.
- Aggiunta la domanda di branching nuovo brand/restyling con relativa domanda di feedback sull'identità esistente per il caso restyling (mancava nel brief).

### Revisione domande e copy (2026-07-24)

Dopo il primo periodo in produzione, revisione mirata di domande e copy — vedi
`doc/PROGRESS.md` (Log 2026-07-24) per il dettaglio completo:

- `aziendaReferente` splittato in `nomeAzienda` + `referente` (necessario per
  personalizzare il copy col nome azienda e correggere il saluto nell'email
  di conferma, prima rotto).
- 4 domande in più rispetto alla versione iniziale (35 per i nuovi brand, 34
  per i restyling): domanda di follow-up sull'archetipo (`archetipoMotivazione`,
  già nello schema ma mancante dal contenuto), stato del naming per i nuovi
  brand, decisore finale, necessità di payoff/tagline. Le 7 domande
  strategiche obbligatorie restano invariate nella sostanza.
- `supportiEVincoli.supporti` e `formatiRichiesti` convertiti da chip a testo
  libero a multi-select chiuso + "altro": a differenza di `valori`/
  `canaliVendita` (che restano chip liberi, specifici per ogni azienda),
  supporti d'uso e formati file sono enumerabili in modo pressoché
  universale in un progetto di identità.
- Tono di voce rivisto (il brand del cliente al centro del copy, non
  Arianna in prima persona) e personalizzazione: i testi di sezione e i
  reminder riprendono il nome azienda inserito in Sezione 1 (token
  `{{azienda}}`, vedi `lib/personalize.ts`).

## Struttura progetto (Next.js App Router)

```
onboarding-brand-identity/
├── package.json
├── tailwind.config.ts
├── components.json          # config shadcn/ui
├── app/
│   ├── layout.tsx           # font Montserrat, metadata
│   ├── page.tsx              # monta <QuestionnaireWizard />
│   ├── globals.css            # tema shadcn (HSL vars) sopra la palette lilla/neutri
│   ├── api/submit/route.ts    # valida (Zod), scrive su Sheets, invia le due email
│   └── informativa-privacy/   # pagina privacy policy
├── components/
│   ├── ui/                    # primitive shadcn/ui (Radix + cva)
│   └── questionnaire/
│       ├── QuestionnaireWizard.tsx  # state machine: intro → domande → consenso → outro
│       ├── QuestionCard.tsx          # layout singola domanda + validazione + nav
│       ├── FieldRenderer.tsx          # smista ogni domanda al componente campo giusto
│       ├── ProgressBar.tsx             # barra di progresso (accento lilla)
│       ├── IntroScreen.tsx / OutroScreen.tsx / ConsentStep.tsx
│       ├── AttachmentsContext.tsx      # stato allegati email (tetto globale)
│       └── fields/                      # un componente per ogni tipologia di campo
├── lib/
│   ├── schema.ts             # Zod schema + tipi TypeScript del questionario
│   ├── design-tokens.ts      # Palette colori, font, spaziature, timing Framer Motion
│   ├── questionnaire-steps.ts # flatten domande + branching nuovo/restyling
│   ├── validate-step.ts        # validazione "leggera" per step (obbligatorietà)
│   ├── attachment-limits.ts    # tetto/tipi ammessi per allegati email
│   ├── google-sheets.ts         # scrittura riga su Sheets
│   ├── mailer.tsx                 # invio email via Nodemailer/Gmail SMTP
│   ├── email-sections.ts           # riepilogo email da content/questionnaire.ts
│   └── questionnaire-labels.ts      # enum → label italiane (condiviso Sheets/email)
├── emails/                   # template React Email (riepilogo interno, conferma cliente)
├── content/
│   └── questionnaire.ts      # Copy IT: sezioni, domande, guida cliente, placeholder
└── doc/
    └── PROGRESS.md           # log cronologico: decisioni, deviazioni dal piano, perché
```

## Documentazione

- [`CLAUDE.md`](CLAUDE.md) — regole di ingaggio e decisioni di progetto non
  ridiscutibili senza motivo (fonte di verità per Claude Code).
- [`doc/PROGRESS.md`](doc/PROGRESS.md) — log cronologico dettagliato: cosa è
  stato fatto in ogni fase, ogni deviazione dal piano originale con il perché
  (es. Resend → Nodemailer, Google Drive → allegati email, CookieYes non
  integrato), specifico di questo progetto.
- [`doc/ARCHITECTURE.md`](doc/ARCHITECTURE.md) — riferimento generico e
  portabile (stack, pattern ricorrenti, razionale delle scelte tecniche,
  workflow issue/branch), pensato per essere ripreso come base in altri
  progetti simili (form di contatto, altri onboarding a step).
