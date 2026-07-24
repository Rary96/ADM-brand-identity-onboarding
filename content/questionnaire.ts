/**
 * Copy italiano del questionario — separato dallo schema (lib/schema.ts) così
 * i testi si possono modificare senza toccare la logica di validazione.
 *
 * Ogni domanda ha: id (mappa 1:1 con un campo dello schema), label, guida
 * (sottotesto/placeholder), obbligatorietà "di contenuto" (badge in UI) e,
 * dove serve, `visibleIf` per il branching nuovo brand / restyling.
 *
 * Tono di voce (rivisto il 2026-07-24): il brand del cliente resta sempre al
 * centro del copy — non Arianna in prima persona. I testi di sezione (`intro`)
 * e `midFormReminder`/`outroCopy` possono contenere il token `{{azienda}}`,
 * interpolato a runtime col valore di `nomeAzienda` (vedi lib/personalize.ts) —
 * usato "ogni tanto", non su ogni domanda, per non diventare ripetitivo.
 */

export type FieldType =
  | "text-short"
  | "text-long"
  | "email"
  | "single-choice"
  | "multi-choice"
  | "scale"
  | "grid-2d"
  | "upload"
  | "color-picker"
  | "date";

export interface Question {
  id: string;
  label: string;
  guida?: string;
  type: FieldType;
  required: boolean;
  options?: { value: string; label: string }[];
  visibleIf?: { field: "tipoProgetto"; equals: "nuovo_brand" | "restyling" };
}

export interface Section {
  id: string;
  title: string;
  intro?: string;
  questions: Question[];
}

export const introCopy = {
  titolo: "Raccontami il tuo brand",
  sottotitolo:
    "Un questionario per costruire un'identità visiva che ti rappresenti davvero.",
  tempoStimato: "10-15 minuti",
  punti: [
    "Ogni risposta diventa materiale di lavoro: guida colori, font, forme — non è un modulo burocratico.",
    "Le domande facoltative puoi saltarle: quello che non definisci ora lo definiamo insieme in call.",
    "A form completato il prossimo passo tocca a me: ti ricontatto entro 1-2 giorni lavorativi per la call di kickoff.",
  ],
  bottone: "Diamo forma al tuo brand",
  nota:
    "I tuoi dati sono trattati nel rispetto del GDPR.",
};

export const midFormReminder =
  "Sei a metà, {{azienda}}: altri 5-7 minuti e hai finito. Le risposte facoltative puoi saltarle.";

export const sections: Section[] = [
  {
    id: "anagrafica",
    title: "Anagrafica e contatti",
    intro: "Le basi, per non perderci nulla.",
    questions: [
      {
        id: "nomeAzienda",
        label: "Come si chiama la tua azienda o il tuo progetto?",
        guida: "Il nome che vuoi vedere sul logo — se è ancora provvisorio va bene lo stesso.",
        type: "text-short",
        required: true,
      },
      {
        id: "referente",
        label: "Chi sei? Nome e ruolo di chi segue il progetto",
        guida: "Es. 'Marco Rossi, titolare' — così so con chi parlo in call.",
        type: "text-short",
        required: false,
      },
      {
        id: "email",
        label: "Email di riferimento",
        type: "email",
        required: true,
      },
      {
        id: "telefonoSito",
        label: "Telefono e sito web/social attuali (se esistenti)",
        guida: "Anche solo un profilo Instagram o una pagina Google Business va bene.",
        type: "text-short",
        required: false,
      },
      {
        id: "settoreAnno",
        label: "Settore di attività e anno di fondazione",
        guida: "Se operi in più settori, indica quello prevalente per fatturato.",
        type: "text-short",
        required: false,
      },
    ],
  },
  {
    id: "storia-vision-valori",
    title: "Storia, Vision e Valori",
    intro: "Il cuore strategico di {{azienda}}.",
    questions: [
      {
        id: "tipoProgetto",
        label: "Questo progetto è un nuovo brand o un restyling di un'identità esistente?",
        type: "single-choice",
        required: true,
        options: [
          { value: "nuovo_brand", label: "Nuovo brand, si parte da zero" },
          { value: "restyling", label: "Restyling di un brand esistente" },
        ],
      },
      {
        id: "storiaFondativa",
        label: "Perché è nata questa azienda? C'è un aneddoto o un momento fondativo?",
        guida: "Non serve un racconto perfetto: anche 3-4 frasi su 'come è iniziato tutto' bastano.",
        type: "text-long",
        required: true,
        visibleIf: { field: "tipoProgetto", equals: "nuovo_brand" },
      },
      {
        id: "namingStatus",
        label: "Il nome che userai è già definitivo?",
        guida: "Utile saperlo prima di disegnare un logotipo attorno a un nome che potrebbe cambiare.",
        type: "single-choice",
        required: false,
        visibleIf: { field: "tipoProgetto", equals: "nuovo_brand" },
        options: [
          { value: "definitivo", label: "Sì, dominio e disponibilità già verificati" },
          { value: "da_validare", label: "Ancora da validare (dominio/marchio)" },
          { value: "da_decidere_insieme", label: "Da decidere insieme in call" },
        ],
      },
      {
        id: "feedbackAttuale",
        label: "Cosa funziona bene e cosa vorresti cambiare della tua identità attuale?",
        guida: "Pensa sia al logo che a colori, font o tono: cosa terresti e cosa butteresti.",
        type: "text-long",
        required: true,
        visibleIf: { field: "tipoProgetto", equals: "restyling" },
      },
      {
        id: "aggettivi",
        label: "Se l'azienda fosse una persona, come la descriveresti in 5 aggettivi?",
        guida: "Es. 'affidabile, calda, diretta, curiosa, essenziale'.",
        type: "text-short",
        required: false,
      },
      {
        id: "missioneVision",
        label: "Qual è la missione (cosa fate ogni giorno) e la vision (dove volete arrivare tra 5-10 anni)?",
        guida: "Missione: 'Aiutiamo le PMI a digitalizzare la contabilità'. Vision: 'Diventare il punto di riferimento entro il 2030'.",
        type: "text-long",
        required: false,
      },
      {
        id: "valori",
        label: "Quali sono i 3-5 valori non negoziabili del brand?",
        guida: "Scegli valori che guiderebbero una decisione difficile, non parole generiche come 'qualità' o 'passione'.",
        type: "multi-choice",
        required: true,
      },
    ],
  },
  {
    id: "prodotto-business",
    title: "Prodotto/Servizio e Modello di Business",
    intro: "Cosa vende davvero {{azienda}}, e a che livello di prezzo.",
    questions: [
      {
        id: "uspVendita",
        label: "Cosa vendete esattamente e qual è il vostro elemento distintivo (USP)?",
        guida: "Completa la frase: 'A differenza dei concorrenti, noi siamo gli unici a...'.",
        type: "text-long",
        required: true,
      },
      {
        id: "posizionamentoPrezzo",
        label: "In quale fascia di prezzo/posizionamento vi collocate?",
        guida: "Se hai dubbi, pensa a un concorrente che percepisci più costoso di te: tu dove ti collochi rispetto a lui?",
        type: "scale",
        required: false,
        options: [
          { value: "economico", label: "Economico" },
          { value: "medio", label: "Medio" },
          { value: "premium", label: "Premium" },
          { value: "lusso", label: "Lusso" },
        ],
      },
      {
        id: "canaliVendita",
        label: "Quali canali di vendita/contatto usate oggi?",
        guida: "Seleziona tutte le opzioni pertinenti, anche se in fase di avvio.",
        type: "multi-choice",
        required: false,
      },
    ],
  },
  {
    id: "target",
    title: "Target Audience e Buyer Persona",
    intro: "A chi parla davvero il brand di {{azienda}}.",
    questions: [
      {
        id: "clienteIdeale",
        label: "Chi è il cliente ideale? (età, ruolo, contesto di vita, potere d'acquisto)",
        guida: "Se ti aiuta, descrivi una persona reale tra i tuoi clienti attuali che ami servire.",
        type: "text-long",
        required: true,
      },
      {
        id: "problemaDesiderio",
        label: "Che problema o desiderio risolve il vostro brand per questo pubblico?",
        guida: "Es. 'Vogliono sentirsi organizzati senza stress' oppure 'vogliono status e riconoscibilità'.",
        type: "text-long",
        required: false,
      },
      {
        id: "emozioneLogo",
        label: "Come vorresti che il cliente si sentisse guardando il tuo logo la prima volta?",
        guida: "Scegline al massimo 2, altrimenti il messaggio si disperde.",
        type: "multi-choice",
        required: false,
        options: [
          { value: "rassicurato", label: "Rassicurato" },
          { value: "ispirato", label: "Ispirato" },
          { value: "incuriosito", label: "Incuriosito" },
          { value: "sorpreso", label: "Sorpreso" },
          { value: "rilassato", label: "Rilassato" },
          { value: "motivato", label: "Motivato" },
        ],
      },
    ],
  },
  {
    id: "competitor",
    title: "Competitor e Posizionamento",
    intro: "Per garantire a {{azienda}} un'identità davvero differenziata, non simile per caso.",
    questions: [
      {
        id: "competitor",
        label: "Indica 2-3 competitor diretti (nome + sito/social) e cosa apprezzi/non apprezzi del loro brand",
        guida: "Anche solo il nome basta, il link è un plus: es. 'Azienda X (sito) — mi piace la coerenza cromatica ma li trovo freddi'.",
        type: "text-long",
        required: true,
      },
      {
        id: "differenziazione",
        label: "Cosa vi rende diversi da loro agli occhi del cliente?",
        guida: "Prova a chiedere a un cliente fedele perché sceglie voi e non un concorrente.",
        type: "text-long",
        required: false,
      },
      {
        id: "mappaPosizionamento",
        label: "Su una mappa 'classico vs. innovativo' e 'seriosa vs. giocosa', dove vuoi posizionarti?",
        guida: "Se non sei sicuro, indica dove NON vuoi stare: a volte è più facile partire da lì.",
        type: "grid-2d",
        required: false,
      },
    ],
  },
  {
    id: "personalita-tone-of-voice",
    title: "Personalità del brand e Tone of Voice",
    intro: "Il ponte tra la strategia di {{azienda}} e le scelte visive.",
    questions: [
      {
        id: "archetipo",
        label: "Se dovessi scegliere un archetipo di marca, quale ti rappresenta di più?",
        guida: "Non serve conoscerli in dettaglio: scegli istintivamente, il resto lo guidiamo noi in call.",
        type: "single-choice",
        required: false,
        options: [
          { value: "eroe", label: "Eroe" },
          { value: "saggio", label: "Saggio" },
          { value: "esploratore", label: "Esploratore" },
          { value: "ribelle", label: "Ribelle" },
          { value: "creatore", label: "Creatore" },
          { value: "sovrano", label: "Sovrano" },
          { value: "mago", label: "Mago" },
          { value: "innocente", label: "Innocente" },
          { value: "amante", label: "Amante" },
          { value: "giullare", label: "Giullare" },
          { value: "uomo_comune", label: "Uomo comune" },
          { value: "custode", label: "Custode" },
        ],
      },
      {
        id: "archetipoMotivazione",
        label: "Perché senti che questo archetipo ti rappresenta?",
        guida: "Facoltativo, ma anche una riga aiuta a orientare il tono visivo del logo.",
        type: "text-long",
        required: false,
      },
      {
        id: "toneEParole",
        label: "Come parlate ai clienti — e ci sono parole che usereste sempre o mai?",
        guida: "Pensa a una mail tipo che scrivereste a un cliente: che tono ha? Anche 2-3 parole per lato bastano.",
        type: "scale",
        required: false,
      },
    ],
  },
  {
    id: "estetica-stile",
    title: "Preferenze Estetiche e Stile Visivo",
    intro: "Riferimenti concreti per {{azienda}}, non aggettivi astratti.",
    questions: [
      {
        id: "loghiRiferimento",
        label: "Carica o linka 3-5 loghi/brand (anche di altri settori) che ti piacciono, spiegando perché",
        guida:
          "Non devono essere dello stesso settore: cerca ciò che 'ti fa dire wow' a prescindere dal prodotto. Puoi allegare direttamente file piccoli (JPG, PNG, WEBP, SVG, PDF fino a 2MB, max 2 in totale su tutto il form) oppure incollare un link (Drive, WeTransfer, Pinterest...) per file più grandi o numerosi.",
        type: "upload",
        required: true,
      },
      {
        id: "stiliDaEvitare",
        label: "Quali stili NON ti rappresentano o vuoi assolutamente evitare?",
        guida:
          "Es. 'Niente stile clipart/anni 2000, niente colori pastello'. Allegato diretto fino a 2MB (JPG, PNG, WEBP, SVG, PDF) o link per file più grandi.",
        type: "upload",
        required: false,
      },
      {
        id: "tipologiaMarchio",
        label: "Preferenze su tipologia di marchio",
        guida: "Se non sai scegliere, lascia 'aperto a proposta del designer'.",
        type: "single-choice",
        required: false,
        options: [
          { value: "logotipo", label: "Logotipo (solo testo)" },
          { value: "simbolo_testo", label: "Simbolo + testo" },
          { value: "solo_simbolo", label: "Solo simbolo/icona" },
          { value: "aperto_a_proposta", label: "Aperto a proposta del designer" },
        ],
      },
      {
        id: "colori",
        label: "Colori: ce ne sono che ami, che odi, o vincoli aziendali/settoriali da rispettare?",
        guida: "Indica anche colori 'vietati' per associazioni negative nel tuo settore o mercato.",
        type: "color-picker",
        required: false,
      },
    ],
  },
  {
    id: "asset-vincoli",
    title: "Asset Esistenti e Vincoli Tecnici",
    intro: "Per non far ripartire {{azienda}} da zero quando non serve.",
    questions: [
      {
        id: "assetEsistenti",
        label: "Esiste già un logo, un naming registrato, o linee guida di brand da rispettare?",
        guida:
          "Allega anche versioni vecchie o bozze abbandonate, anche se non ti piacciono più. Allegato diretto fino a 2MB (JPG, PNG, WEBP, SVG, PDF) o link per file più grandi.",
        type: "upload",
        required: false, // required=true dinamicamente se tipoProgetto=restyling, vedi lib/schema.ts
      },
      {
        id: "supportiEVincoli",
        label: "Su quali supporti verrà usato il logo, e ci sono vincoli tecnici o normativi di settore?",
        guida: "Seleziona anche usi futuri previsti nei prossimi 1-2 anni. In caso di dubbio su normative, allega il regolamento.",
        type: "multi-choice",
        required: false,
        options: [
          { value: "sito_web", label: "Sito web" },
          { value: "social_media", label: "Social media" },
          { value: "packaging", label: "Packaging" },
          { value: "insegna_negozio", label: "Insegna negozio" },
          { value: "divise_uniformi", label: "Divise/uniformi" },
          { value: "stampa", label: "Stampa (biglietti, flyer, brochure)" },
          { value: "cancelleria", label: "Cancelleria (carta intestata, buste)" },
          { value: "veicoli", label: "Veicoli aziendali" },
        ],
      },
    ],
  },
  {
    id: "deliverable-budget",
    title: "Deliverable, Tempistiche e Budget",
    intro: "Per allineare le aspettative di {{azienda}} fin da subito.",
    questions: [
      {
        id: "formatiRichiesti",
        label: "Quali file/formati ti servono alla consegna?",
        guida: "Se non sai cosa ti serve tecnicamente, seleziona 'pacchetto completo consigliato dal designer'.",
        type: "multi-choice",
        required: false,
        options: [
          { value: "vettoriale", label: "AI/EPS vettoriale" },
          { value: "png_trasparente", label: "PNG trasparente alta risoluzione" },
          { value: "pdf_stampa", label: "PDF stampa" },
          { value: "favicon", label: "Favicon/icona app" },
          { value: "firma_email", label: "Firma email" },
          { value: "brand_guidelines", label: "Brand guidelines (PDF)" },
          { value: "template_social", label: "Template social media" },
          { value: "pacchetto_completo", label: "Pacchetto completo consigliato dal designer" },
        ],
      },
      {
        id: "payoffTagline",
        label: "Ti serve anche un payoff/tagline sotto il logo?",
        guida: "Es. 'Just do it' sotto Nike. Se non sai ancora rispondere, nessun problema.",
        type: "single-choice",
        required: false,
        options: [
          { value: "si", label: "Sì" },
          { value: "no", label: "No, solo il logo" },
          { value: "non_so", label: "Non so, ne parliamo in call" },
        ],
      },
      {
        id: "scadenza",
        label: "Hai una scadenza vincolante (lancio prodotto, evento, stampa materiali)?",
        guida: "Indica anche scadenze 'morbide' se non hai una data fissa.",
        type: "date",
        required: false,
      },
      {
        id: "budget",
        label: "Hai già un budget indicativo allocato per questo progetto?",
        guida: "Non temere di essere impreciso: una fascia indicativa basta.",
        type: "single-choice",
        required: false,
        options: [
          { value: "meno_1000", label: "Meno di 1.000€" },
          { value: "1000_3000", label: "1.000 - 3.000€" },
          { value: "3000_6000", label: "3.000 - 6.000€" },
          { value: "oltre_6000", label: "Oltre 6.000€" },
        ],
      },
      {
        id: "decisorFinale",
        label: "Chi darà l'ok finale sul lavoro?",
        guida: "Aiuta a evitare revisioni dell'ultimo minuto per un parere che non avevamo sentito prima.",
        type: "single-choice",
        required: false,
        options: [
          { value: "solo_io", label: "Solo io" },
          { value: "io_piu_team", label: "Io, ma sento anche un socio/team" },
          { value: "comitato", label: "Più persone devono essere d'accordo" },
        ],
      },
      {
        id: "domandaJolly",
        label: "C'è altro che vorresti dirci e che non abbiamo chiesto?",
        type: "text-long",
        required: false,
      },
    ],
  },
];

export const outroCopy = {
  titolo: "Fatto — grazie, {{azienda}}!",
  corpo: "Ho ricevuto le risposte su {{azienda}}, grazie per il tempo che ci hai dedicato.",
  // Usato solo nell'email di conferma cliente (ClientConfirmationEmail),
  // non nella OutroScreen a video — dettaglio dei prossimi passi dopo l'invio.
  prossimiPassi: [
    "Rivedo con calma tutte le tue risposte.",
    "Ti scrivo entro 1-2 giorni lavorativi per fissare la call di kickoff.",
    "Nella call definiamo insieme le prossime tappe del progetto.",
  ],
};
