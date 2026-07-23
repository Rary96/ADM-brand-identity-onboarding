import { google } from "googleapis";
import type { Questionario } from "@/lib/schema";
import { getOptionLabel, getOptionLabels } from "@/lib/questionnaire-labels";
import type { ParsedAttachment } from "@/lib/attachment-limits";

export interface SubmissionMeta {
  submissionId: string;
  submittedAt: string;
}

const join = (arr?: string[]) => (arr ?? []).join(", ");

/** Aggiunge alla nota di un campo upload l'elenco degli eventuali allegati email. */
function noteWithAttachments(
  note: string | undefined,
  fieldId: string,
  attachments: ParsedAttachment[]
): string {
  const fieldAttachments = attachments.filter((a) => a.fieldId === fieldId);
  const base = note ?? "";
  if (fieldAttachments.length === 0) return base;
  const list = `(+ ${fieldAttachments.length} allegati email: ${fieldAttachments
    .map((a) => a.filename)
    .join(", ")})`;
  return base ? `${base} ${list}` : list;
}

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY mancanti");
  }
  const auth = new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/**
 * Una colonna per ogni sotto-campo degli oggetti annidati, array serializzati
 * con "join(', ')", enum tradotti in label italiane (stessa fonte della UI).
 * L'ultima colonna è il payload JSON completo, rete di sicurezza per campi
 * non ancora "colonnati". Ordine e header vanno tenuti allineati alla prima
 * riga del tab "Risposte" nello Sheet.
 */
function buildRow(
  data: Questionario,
  meta: SubmissionMeta,
  attachments: ParsedAttachment[]
): (string | number)[] {
  return [
    meta.submittedAt,
    meta.submissionId,
    data.aziendaReferente,
    data.email,
    data.telefonoSito ?? "",
    data.settoreAnno ?? "",
    getOptionLabel("tipoProgetto", data.tipoProgetto),
    data.storiaFondativa ?? "",
    data.feedbackAttuale ?? "",
    data.aggettivi ?? "",
    data.missioneVision ?? "",
    join(data.valori.selezionati),
    data.valori.altro ?? "",
    data.uspVendita,
    getOptionLabel("posizionamentoPrezzo", data.posizionamentoPrezzo),
    join(data.canaliVendita?.selezionati),
    data.canaliVendita?.altro ?? "",
    data.clienteIdeale,
    data.problemaDesiderio ?? "",
    join(getOptionLabels("emozioneLogo", data.emozioneLogo)),
    data.competitor,
    data.differenziazione ?? "",
    data.mappaPosizionamento?.classicoInnovativo ?? "",
    data.mappaPosizionamento?.seriosaGiocosa ?? "",
    getOptionLabel("archetipo", data.archetipo),
    data.archetipoMotivazione ?? "",
    data.toneEParole?.formaleInformale ?? "",
    data.toneEParole?.tecnicoSemplice ?? "",
    data.toneEParole?.serioIronico ?? "",
    data.toneEParole?.paroleSempre ?? "",
    data.toneEParole?.paroleMai ?? "",
    join(data.loghiRiferimento.urls),
    noteWithAttachments(data.loghiRiferimento.note, "loghiRiferimento", attachments),
    join(data.stiliDaEvitare?.urls),
    noteWithAttachments(data.stiliDaEvitare?.note, "stiliDaEvitare", attachments),
    getOptionLabel("tipologiaMarchio", data.tipologiaMarchio),
    join(data.colori?.preferiti),
    join(data.colori?.daEvitare),
    data.colori?.note ?? "",
    join(data.assetEsistenti?.urls),
    noteWithAttachments(data.assetEsistenti?.note, "assetEsistenti", attachments),
    join(data.supportiEVincoli?.supporti),
    data.supportiEVincoli?.vincoliTecnici ?? "",
    join(data.formatiRichiesti),
    data.scadenza?.data ?? "",
    data.scadenza?.note ?? "",
    getOptionLabel("budget", data.budget),
    data.domandaJolly ?? "",
    data.consensoPrivacy ? "Sì" : "No",
    JSON.stringify(data),
  ];
}

export async function appendSubmissionRow(
  data: Questionario,
  meta: SubmissionMeta,
  attachments: ParsedAttachment[] = []
) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID mancante");

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Risposte!A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [buildRow(data, meta, attachments)] },
  });
}
