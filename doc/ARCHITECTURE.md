# Architettura di riferimento — form a step / raccolta dati con notifiche email

Questo file è pensato per essere **portato in altri progetti** (form di
contatto, altri onboarding a step, questionari) come base di partenza: stack,
pattern ricorrenti e — soprattutto — il *perché* dietro ogni scelta, così da
poter valutare rapidamente se vale ancora in un contesto nuovo o va
rivista. A differenza di `PROGRESS.md` (log cronologico specifico di questo
progetto), qui non c'è narrazione né dettagli legati a questo cliente:
solo il pattern generale.

Non è un piano da eseguire alla lettera: è un punto di partenza da adattare.
Ogni scelta qui sotto ha un "quando NON usarla" — leggerlo prima di copiare.

## Quando questo pattern si applica

Form/questionari a bassa-media frequenza di invio (indicativamente fino a
qualche centinaio di submission al mese), senza necessità di:
- login utenti o aree riservate,
- salvataggio progressi tra sessioni,
- query/analisi complesse sui dati raccolti (oltre a leggerli su un foglio).

Se una di queste condizioni cambia, vedi le sezioni "quando rivalutare" sotto.

## Stack

- **Next.js (App Router)** + **Tailwind CSS** — routing e styling, nessuna
  ragione specifica per uno stack diverso su progetti di questa taglia.
- **Framer Motion** — transizioni fluide tra step di un wizard/form multi-step.
- **shadcn/ui, versione classica (Radix + Tailwind v3/v4 "classico" con
  `tailwind.config.ts`)**, non l'ultima major (`shadcn@latest`, che dalla
  versione con preset "base-nova" genera componenti su Base UI + Tailwind
  v4 CSS-first, senza `tailwind.config.ts`). Pinnare la versione della CLI
  (es. `shadcn@2.3.0`) se il progetto usa già una palette/design-tokens in
  `tailwind.config.ts` classico — la migrazione a Base UI/oklch è un lavoro a
  sé, non un side-effect di "aggiungere un componente".
- **Zod** — validazione **sia client che server-side**. Non fidarsi mai della
  sola validazione client: è UX, non sicurezza.

## Pattern "form a step" (wizard)

- Stato in memoria React (niente DB, niente salvataggio progressi tra
  sessioni) **se e solo se** il form è pensato per essere completato in
  un'unica sessione breve (10-15 minuti). Se il form è lungo o l'utente può
  ragionevolmente doverlo abbandonare e riprendere, questo pattern non basta
  — serve persistenza (localStorage come minimo, DB se serve accesso
  multi-dispositivo).
- Una domanda/campo per schermata, barra di progresso, navigazione solo a
  bottone (non Invio/Enter) se il campo può avere altri usi per quel tasto
  (es. aggiungere un chip in un multi-input) — altrimenti valutare caso per
  caso, non è una regola universale.
- Branching (domande condizionali in base a una risposta precedente) va
  modellato nello schema di validazione stesso (es. Zod `superRefine`), non
  solo in UI — altrimenti la validazione server-side non riflette la vera
  logica del form.
- Riduzione dell'abbandono: minimizzare i campi obbligatori a quelli
  davvero indispensabili al lavoro a valle, il resto facoltativo.

## Raccolta risposte: Google Sheets vs database vero

**Google Sheets via Service Account** (append-only, una riga per
submission) è adeguato quando:
- il volume è basso/medio,
- non servono query complesse, solo consultazione/export,
- chi consulta i dati preferisce un foglio a una dashboard.

**Quando rivalutare → DB vero** (es. Postgres/Supabase): se servono query
strutturate, storicizzazione con integrità referenziale, o il volume cresce
al punto da rendere l'append su Sheets un collo di bottiglia.

## Notifiche email: Nodemailer + SMTP (App Password) vs alternative

Criteri di scelta usati:
- **Nodemailer + SMTP Gmail (App Password)**: nessun dominio da verificare,
  invio a qualsiasi destinatario da subito, nessun OAuth da mantenere. Adatto
  a volumi bassi/medi e a mittenti che già hanno un account Gmail dedicato.
- **Resend**: richiede un dominio verificato — la scelta giusta se il volume
  di invii cresce molto o serve deliverability/analytics migliori. Da
  rivalutare quando questo diventa un problema reale, non preventivamente.
- **Gmail API via OAuth2**: scartata per invii automatici senza
  manutenzione — il refresh token scade dopo 7 giorni per app non
  verificate, rischio operativo per un flusso "set and forget".
- **EmailJS**: pensato per invio lato client, tier gratuito tipicamente
  troppo piccolo per uso in produzione anche a basso volume.

**Indirizzo mittente/destinatario interno**: rappresenta l'email del
proprietario/gestore di *quel* progetto specifico — non un valore fisso del
pattern. Cambia da progetto a progetto in base a chi possiede l'istanza.
L'indirizzo usato per l'autenticazione SMTP (mittente) va sempre in una env
var (mai hardcoded nel codice, coerente con la regola sui secret). Se anche
il destinatario del riepilogo interno è fisso per il progetto, va segnalato
chiaramente con un commento nel punto in cui è definito (di chi è, perché è
fisso in questo contesto) — e se in futuro dovesse servire configurarlo
senza toccare il codice, va spostato anch'esso in una env var, non
aggiunto come nuova costante hardcoded.

Allegati diretti via email: attenzione al **limite del body delle funzioni
serverless** (~4.5MB su piattaforme come Vercel) — va imposto un tetto
esplicito su numero/dimensione file (es. max 2 file, 2MB ciascuno), validato
sia client che server. Per file più grandi o numerosi, offrire in alternativa
un campo "link" (Drive personale del cliente, WeTransfer, ecc.) senza limiti,
invece di gestire l'upload lato server (niente integrazione Drive/S3 se non
strettamente necessaria — riduce superficie di manutenzione).

## Template email: HTML statico via React Email, non "adattamento" a runtime

Frainteso comune: la mail non viene interpretata da Gmail come un browser
interpreta una pagina — non c'è JS lato client, non c'è adattamento
dinamico. Il rendering avviene **una sola volta, lato server**, prima
dell'invio:

1. I template (`emails/*.tsx`, `emails/components/*.tsx`) sono componenti
   React scritti con **`@react-email/components`** (`Html`, `Head`, `Body`,
   `Container`, `Section`, `Text`, `Heading`, `Preview`, ecc.) — non gli
   elementi/componenti della UI dell'app (niente Tailwind, niente shadcn/ui).
2. In `lib/mailer.tsx`, `render()` di `@react-email/render` converte
   l'albero React in una **stringa HTML statica**, ultimo passo prima di
   `transport.sendMail({ html, ... })` via Nodemailer. Da quel momento è
   puro HTML+CSS inline: nessun React, nessun JS arriva nella casella.
3. Gmail (o Outlook, Apple Mail, ecc.) non adatta nulla in modo intelligente:
   applica il proprio motore di rendering HTML/CSS a quella stringa statica,
   con gli stessi limiti di qualunque client email — supporto CSS parziale,
   niente flexbox/grid affidabile, `<style>` nel `<head>` spesso rimosso o
   ignorato in alcuni contesti (in particolare Outlook desktop, che usa il
   motore di rendering di Word).

### Perché componenti React Email e non i div/Tailwind della UI

- Renderizzano internamente come **tabelle HTML**, non `<div>` con
  flexbox/grid — l'unico layout che regge in modo consistente su tutti i
  client (soprattutto Outlook desktop).
- Ogni stile è un **oggetto `style={{ ... }}` inline sul singolo elemento**,
  non una classe Tailwind o un file CSS esterno — i client email spesso
  ignorano `<style>` in `<head>` o selettori CSS complessi; l'inline è
  l'unico approccio con supporto quasi universale.
- Architettura del form (Tailwind + componenti custom) e architettura delle
  email (React Email + inline styles) sono quindi **deliberatamente
  disaccoppiate** — non è un'incoerenza, è un vincolo del mezzo (email vs
  browser).

### Perché sembra "adattarsi" visivamente su schermi diversi

Non ci sono media query (`@media`) nei template attuali. L'effetto
responsive tra desktop e mobile viene solo da:
- `Container` con `maxWidth: 560` (non si allarga oltre su desktop),
- le tabelle interne con `width: "100%"` (si restringono naturalmente sotto
  quel limite, es. su mobile).

È un layout fluido con un tetto massimo, non un layout responsive vero con
breakpoint dedicati — sufficiente per un template a colonna singola come
questo. Da rivedere (con media query dedicate nel `<Head>`, supportate da
react-email ma da testare client per client) solo se in futuro serve un
layout a più colonne che deve trasformarsi radicalmente su mobile.

### Struttura dei file coinvolti

- `emails/components/EmailLayout.tsx` — guscio condiviso da entrambi i
  template (sfondo, container, header con nome progetto, footer) — unico
  punto dove cambiare lo stile "cornice" comune.
- `emails/components/SectionBlock.tsx` — blocco riutilizzabile
  titolo-sezione + lista campo/valore, usato solo nel riepilogo interno.
- `emails/InternalSummaryEmail.tsx` / `ClientConfirmationEmail.tsx` — i due
  template concreti, compongono `EmailLayout` + i blocchi di contenuto.
- `lib/email-sections.ts` — logica pura di trasformazione dati
  (dati form → array `{ title, fields }`), riusa la stessa fonte di verità
  del contenuto della UI del form, così se cambia una domanda lì l'email si
  aggiorna da sola.
- `lib/mailer.tsx` — unico punto che chiama `render()` e invia via
  Nodemailer/SMTP: è il confine tra React e HTML statico.

## Sicurezza (non negoziabile, in ogni progetto)

- Nessun secret nel codice sorgente né in file `.env` versionati — solo
  `.env.local` (gitignored) in locale, environment variables della
  piattaforma di hosting in produzione.
- Validazione dati **sempre anche server-side** con lo stesso schema (Zod)
  usato client-side, per evitare divergenze.

## Workflow operativo: issue tracking e branching

- **Ogni problema rilevato si traccia come GitHub Issue**, etichettata con
  una categoria (nel progetto di riferimento: `UI` interfaccia visiva, `UX`
  flusso/interazione, `BACK` struttura tecnica/backend — adattare le
  etichette al progetto ma mantenere sempre una categorizzazione esplicita)
  oltre alle label di default GitHub (`bug`, `documentation`, ecc.) quando
  pertinenti.
- **Ogni intervento non banale su un branch dedicato**, mai commit diretti
  su `main` se `main` è collegato a un deploy automatico (Vercel/Netlify/
  altro) — un push a metà lavoro romperebbe la produzione.
- **Ad ogni commit/push sul branch di lavoro**, verificare se risolve una o
  più Issue aperte e chiuderle subito (`gh issue close <N> --comment "..."`,
  citando l'hash del commit) — non aspettare il merge su `main`. Evitare la
  keyword automatica GitHub (`Closes #N`), che chiude solo al merge sul
  branch default.
- Log cronologico del "perché" delle decisioni in un file dedicato (in
  questo progetto `doc/PROGRESS.md`) separato dalla checklist operativa
  (le Issue) — il log narra le deviazioni dal piano originale e il
  ragionamento, le Issue tracciano cosa resta da fare.

## Struttura cartelle (pattern generico Next.js App Router)

```
progetto/
├── app/
│   ├── layout.tsx / page.tsx
│   ├── api/<endpoint>/route.ts   # valida (Zod), scrive su storage, invia notifiche
│   └── <pagine statiche>/        # es. privacy policy
├── components/
│   ├── ui/                       # primitive shadcn/ui
│   └── <dominio>/                # wizard/state machine, layout per step,
│                                   # dispatcher che smista al componente campo giusto
├── lib/
│   ├── schema.ts                 # Zod schema + tipi, unica fonte di verità dati
│   ├── design-tokens.ts          # palette, font, spaziature, timing animazioni
│   ├── <storage>.ts              # scrittura su Sheets/DB
│   ├── mailer.tsx                # invio email
│   └── <labels>.ts               # enum → label leggibili, condiviso storage/email
├── emails/                       # template email (es. React Email)
├── content/                      # copy testuale separato dal codice UI
└── doc/
    ├── PROGRESS.md               # log cronologico specifico del progetto
    └── ARCHITECTURE.md           # questo file, portabile tra progetti
```

## Come riusare questo file in un progetto nuovo

1. Copiarlo nel nuovo progetto come punto di partenza, non come vincolo.
2. Rivedere ogni sezione "quando rivalutare" alla luce del contesto nuovo
   (volume atteso, chi consulta i dati, vincoli del cliente).
3. Aggiornare *questo* file (nel progetto originale) se una decisione qui
   descritta cambia in modo generalizzabile — non solo `PROGRESS.md`, che
   resta specifico del progetto in cui è stato scritto.
