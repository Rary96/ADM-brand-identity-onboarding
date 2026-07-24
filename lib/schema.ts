import { z } from "zod";

/**
 * Schema del questionario di onboarding Brand Identity.
 *
 * Note architetturali:
 * - `tipoProgetto` guida il branching "nuovo brand / restyling": in UI nasconde/mostra
 *   `storiaFondativa` vs `feedbackAttuale`, e rende `assetEsistenti` effettivamente
 *   obbligatorio solo per i restyling (vedi superRefine in fondo al file).
 * - I campi di upload (`loghiRiferimento`, `stiliDaEvitare`, `assetEsistenti`) accettano
 *   sia URL (link a Drive/Instagram/Pinterest) sia riferimenti a file caricati dal client
 *   (che verranno poi risolti in URL Google Drive lato server, step API).
 * - Solo 7 campi sono `required` a livello di contenuto strategico (vedi README):
 *   nomeAzienda, email, storiaFondativa/feedbackAttuale, valori, uspVendita,
 *   clienteIdeale, competitor. Tutto il resto è facoltativo per ridurre l'abbandono.
 *   `nomeAzienda` (ex `aziendaReferente`, splittato dal `referente` il 2026-07-24
 *   per poterlo riprendere pulito nel copy personalizzato e nel saluto email —
 *   vedi doc/PROGRESS.md).
 */

export const tipoProgettoEnum = z.enum(["nuovo_brand", "restyling"]);

export const posizionamentoPrezzoEnum = z.enum([
  "economico",
  "medio",
  "premium",
  "lusso",
]);

export const namingStatusEnum = z.enum([
  "definitivo",
  "da_validare",
  "da_decidere_insieme",
]);

export const decisorFinaleEnum = z.enum(["solo_io", "io_piu_team", "comitato"]);

export const payoffTaglineEnum = z.enum(["si", "no", "non_so"]);

export const archetipoEnum = z.enum([
  "eroe",
  "saggio",
  "esploratore",
  "ribelle",
  "creatore",
  "sovrano",
  "mago",
  "innocente",
  "amante",
  "giullare",
  "uomo_comune",
  "custode",
]);

export const budgetRangeEnum = z.enum([
  "meno_1000",
  "1000_3000",
  "3000_6000",
  "oltre_6000",
]);

const uploadOrLink = z.object({
  urls: z.array(z.string().url()).default([]),
  note: z.string().optional(),
});

export const questionarioSchema = z
  .object({
    // Sezione 1 — Anagrafica e contatti
    nomeAzienda: z.string().min(2, "Campo obbligatorio"),
    referente: z.string().optional(),
    email: z.string().email("Email non valida"),
    telefonoSito: z.string().optional(),
    settoreAnno: z.string().optional(),

    // Sezione 2 — Storia, Vision e Valori
    tipoProgetto: tipoProgettoEnum,
    storiaFondativa: z.string().optional(), // richiesto se tipoProgetto = nuovo_brand
    namingStatus: namingStatusEnum.optional(), // solo tipoProgetto = nuovo_brand
    feedbackAttuale: z.string().optional(), // richiesto se tipoProgetto = restyling
    aggettivi: z.string().optional(), // 5 aggettivi, testo libero
    missioneVision: z.string().optional(),
    valori: z.object({
      selezionati: z.array(z.string()).default([]),
      altro: z.string().optional(),
    }),

    // Sezione 3 — Prodotto/Servizio e Modello di Business
    uspVendita: z.string().min(1, "Campo obbligatorio"),
    posizionamentoPrezzo: posizionamentoPrezzoEnum.optional(),
    canaliVendita: z
      .object({
        selezionati: z.array(z.string()).default([]),
        altro: z.string().optional(),
      })
      .optional(),

    // Sezione 4 — Target Audience e Buyer Persona
    clienteIdeale: z.string().min(1, "Campo obbligatorio"),
    problemaDesiderio: z.string().optional(),
    emozioneLogo: z.array(z.string()).max(2).optional(),

    // Sezione 5 — Competitor e Posizionamento
    competitor: z.string().min(1, "Campo obbligatorio"),
    differenziazione: z.string().optional(),
    mappaPosizionamento: z
      .object({
        classicoInnovativo: z.number().min(0).max(100),
        seriosaGiocosa: z.number().min(0).max(100),
      })
      .optional(),

    // Sezione 6 — Personalità del brand e Tone of Voice
    archetipo: archetipoEnum.optional(),
    archetipoMotivazione: z.string().optional(),
    toneEParole: z
      .object({
        formaleInformale: z.number().min(0).max(100).optional(),
        tecnicoSemplice: z.number().min(0).max(100).optional(),
        serioIronico: z.number().min(0).max(100).optional(),
        paroleSempre: z.string().optional(),
        paroleMai: z.string().optional(),
      })
      .optional(),

    // Sezione 7 — Preferenze Estetiche e Stile Visivo
    loghiRiferimento: uploadOrLink,
    stiliDaEvitare: uploadOrLink.optional(),
    tipologiaMarchio: z
      .enum(["logotipo", "simbolo_testo", "solo_simbolo", "aperto_a_proposta"])
      .optional(),
    colori: z
      .object({
        preferiti: z.array(z.string()).default([]),
        daEvitare: z.array(z.string()).default([]),
        note: z.string().optional(),
      })
      .optional(),

    // Sezione 8 — Asset Esistenti e Vincoli Tecnici
    assetEsistenti: uploadOrLink.optional(), // required se restyling, vedi superRefine
    supportiEVincoli: z
      .object({
        supporti: z.object({
          selezionati: z.array(z.string()).default([]),
          altro: z.string().optional(),
        }),
        vincoliTecnici: z.string().optional(),
      })
      .optional(),

    // Sezione 9 — Deliverable, Tempistiche e Budget
    formatiRichiesti: z
      .object({
        selezionati: z.array(z.string()).default([]),
        altro: z.string().optional(),
      })
      .default({ selezionati: [] }),
    scadenza: z
      .object({
        data: z.string().optional(),
        note: z.string().optional(),
      })
      .optional(),
    budget: budgetRangeEnum.optional(),
    decisorFinale: decisorFinaleEnum.optional(),
    payoffTagline: payoffTaglineEnum.optional(),
    domandaJolly: z.string().optional(),

    // Consenso privacy (obbligatorio, gestito separatamente da CookieYes per il banner)
    consensoPrivacy: z.literal(true, {
      errorMap: () => ({ message: "Devi accettare l'informativa privacy per continuare" }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.tipoProgetto === "nuovo_brand" && !data.storiaFondativa) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["storiaFondativa"],
        message: "Campo obbligatorio per un nuovo brand",
      });
    }
    if (data.tipoProgetto === "restyling" && !data.feedbackAttuale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["feedbackAttuale"],
        message: "Campo obbligatorio per un restyling",
      });
    }
    if (
      data.tipoProgetto === "restyling" &&
      (!data.assetEsistenti || data.assetEsistenti.urls.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assetEsistenti"],
        message: "Carica almeno un asset esistente (logo, linee guida, ecc.)",
      });
    }
    if (data.valori.selezionati.length === 0 && !data.valori.altro) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["valori"],
        message: "Indica almeno un valore",
      });
    }
    if (!data.competitor && data.tipoProgetto === "nuovo_brand") {
      // già coperto da .min(1) sopra, mantenuto per chiarezza logica futura
    }
  });

export type Questionario = z.infer<typeof questionarioSchema>;

/** Lista dei campi realmente obbligatori a livello di contenuto strategico (per UI: badge "obbligatoria"). */
export const campiObbligatoriStrategici = [
  "nomeAzienda",
  "email",
  "storiaFondativa_o_feedbackAttuale",
  "valori",
  "uspVendita",
  "clienteIdeale",
  "competitor",
] as const;
