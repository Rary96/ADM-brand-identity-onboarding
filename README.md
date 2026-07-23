# Questionario Onboarding — Brand Identity & Logo Design

Step 2/3 completato: struttura file + schemi dati + UI/UX (Typeform-style, Next.js/Tailwind/shadcn, Framer Motion, progress bar). Prossimo step: API (Google Sheets, Resend, Drive upload).

## Decisioni prese

- **Branching nuovo brand / restyling**: una domanda iniziale in Sezione 2 mostra domande diverse a seconda del caso (vedi `content/questionnaire.ts`, campo `tipoProgetto`).
- **Upload file**: verranno caricati su Google Drive via Service Account, link salvato su Google Sheets.
- **Nessun salvataggio progressi**: form completabile in un'unica sessione (stato in memoria, nessun DB).
- **Solo italiano.**
- **Palette**: Pantone 13-3905 TCX "Diaphanous Lilac" → `#C6C2CD`, usato in modo molto limitato (accenti, progress bar, focus states) su base neutra bianco/grigio. Vedi `lib/design-tokens.ts`.
- **Notifiche email (Resend)**: una email di riepilogo a te (dalmontearianna.96@gmail.com) + una email di conferma al cliente.

## Contenuto ottimizzato rispetto al brief originale

- Ridotto da 29 a 24 domande (target 20-28 del brief), accorpando alcune domande di dettaglio (tono di voce + parole; supporti d'uso + vincoli tecnici).
- Obbligatorie solo le 7 domande davvero strategiche, come raccomandato nel brief: nome azienda, email, storia/feedback attuale, valori, USP, cliente ideale, competitor. Tutto il resto è facoltativo.
- Aggiunta la domanda di branching nuovo brand/restyling con relativa domanda di feedback sull'identità esistente per il caso restyling (mancava nel brief).

## Struttura progetto (Next.js App Router)

```
onboarding-brand-identity/
├── package.json
├── tailwind.config.ts
├── components.json         # config shadcn/ui
├── app/
│   ├── layout.tsx           # font Inter, metadata
│   ├── page.tsx              # monta <QuestionnaireWizard />
│   └── globals.css            # tema shadcn (HSL vars) sopra la palette lilla/neutri
├── components/
│   ├── ui/                    # primitive shadcn/ui (Radix + cva)
│   └── questionnaire/
│       ├── QuestionnaireWizard.tsx  # state machine: intro → domande → consenso → outro
│       ├── QuestionCard.tsx          # layout singola domanda + validazione + nav
│       ├── FieldRenderer.tsx          # smista ogni domanda al componente campo giusto
│       ├── ProgressBar.tsx             # barra di progresso (accento lilla)
│       ├── IntroScreen.tsx / OutroScreen.tsx / ConsentStep.tsx
│       └── fields/                      # un componente per ogni tipologia di campo
├── lib/
│   ├── schema.ts             # Zod schema + tipi TypeScript del questionario
│   ├── design-tokens.ts      # Palette colori, font, spaziature, timing Framer Motion
│   ├── questionnaire-steps.ts # flatten domande + branching nuovo brand/restyling
│   └── validate-step.ts        # validazione "leggera" per step (obbligatorietà)
├── content/
│   └── questionnaire.ts      # Copy IT: sezioni, domande, guida cliente, placeholder
```

Le cartelle `emails/` (React Email) e le API routes (Google Sheets, Drive, Resend) verranno aggiunte nello step successivo. L'invio del form al momento valida i dati con `questionarioSchema` e stampa il payload in console (stub in attesa dell'endpoint `/api/submit`).
