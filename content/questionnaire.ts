/**
 * Copy italiano del questionario — separato dallo schema (lib/schema.ts) così
 * i testi si possono modificare senza toccare la logica di validazione.
 *
 * Ogni domanda ha: id (mappa 1:1 con un campo dello schema), label, guida
 * (sottotesto/placeholder), obbligatorietà "di contenuto" (badge in UI) e,
 * dove serve, `visibleIf` per il branching nuovo brand / restyling.
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
  nota:
    "Le risposte facoltative puoi lasciarle in bianco: quello che non sai ora lo definiamo insieme in call. I tuoi dati sono trattati nel rispetto del GDPR.",
};

export const midFormReminder =
  "Sei a metà: altri 5-7 minuti e hai finito. Le risposte facoltative puoi saltarle.";

export const sections: Section[] = [
  {
    id: "anagrafica",
    title: "Anagrafica e contatti",
    intro: "Dati minimi per gestire il progetto.",
    questions: [
      {
        id: "aziendaReferente",
        label: "Nome azienda/progetto e referente per il progetto",
        guida: "Es. 'Studio Rossi Srl — referente: Marco Rossi, titolare'.",
        type: "text-short",
        required: true,
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
    intro: "Il cuore strategico del progetto.",
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
    intro: "Cosa vendete davvero, e a che livello di prezzo.",
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
        guida: "Pensa a un brand percepito come 'fratello maggiore' del tuo: in che fascia lo collocheresti?",
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
    intro: "A chi parla davvero il tuo brand.",
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
    intro: "Per garantire un'identità davvero differenziata, non simile per caso.",
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
    intro: "Il ponte tra strategia e scelte visive.",
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
    intro: "Riferimenti concreti, non aggettivi astratti.",
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
    intro: "Per non ripartire da zero quando non serve.",
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
      },
    ],
  },
  {
    id: "deliverable-budget",
    title: "Deliverable, Tempistiche e Budget",
    intro: "Per allineare aspettative fin da subito.",
    questions: [
      {
        id: "formatiRichiesti",
        label: "Quali file/formati ti servono alla consegna?",
        guida: "Se non sai cosa ti serve tecnicamente, seleziona 'pacchetto completo consigliato dal designer'.",
        type: "multi-choice",
        required: false,
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
        id: "domandaJolly",
        label: "C'è altro che vorresti dirci e che non abbiamo chiesto?",
        type: "text-long",
        required: false,
      },
    ],
  },
];

export const outroCopy = {
  titolo: "Fatto — grazie!",
  corpo:
    "Ho ricevuto le tue risposte. Le uso per preparare la nostra call di kickoff: ti scrivo entro 1-2 giorni lavorativi per fissarla.",
};
