import { NextResponse } from "next/server";
import { questionarioSchema } from "@/lib/schema";
import { appendSubmissionRow } from "@/lib/google-sheets";
import { sendInternalSummaryEmail, sendClientConfirmationEmail } from "@/lib/mailer";
import { ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENTS, MAX_ATTACHMENT_BYTES } from "@/lib/attachment-limits";
import type { MailAttachment } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Estrae gli allegati diretti dal FormData, ri-validando tipo/size/conteggio
 * server-side (mai fidarsi solo del client). Quelli fuori tetto vengono
 * scartati silenziosamente invece di bloccare l'intero submit: il client li
 * ha già validati, un mismatch qui è un edge case, non un errore da mostrare.
 */
async function extractAttachments(formData: FormData): Promise<MailAttachment[]> {
  const attachments: MailAttachment[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("attachment_") || key.endsWith("_field")) continue;
    if (!(value instanceof File)) continue;
    if (attachments.length >= MAX_ATTACHMENTS) break;
    if (value.size > MAX_ATTACHMENT_BYTES) continue;
    if (!ALLOWED_ATTACHMENT_TYPES.includes(value.type)) continue;

    const fieldId = String(formData.get(`${key}_field`) ?? "");
    const content = Buffer.from(await value.arrayBuffer());
    attachments.push({ filename: value.name, content, fieldId });
  }
  return attachments;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(String(formData.get("data") ?? ""));
  } catch {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  const result = questionarioSchema.safeParse(parsedData);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: result.error.issues },
      { status: 400 }
    );
  }

  let rawMeta: { submissionId?: unknown } = {};
  try {
    rawMeta = JSON.parse(String(formData.get("meta") ?? "{}"));
  } catch {
    rawMeta = {};
  }
  const meta = {
    submissionId:
      typeof rawMeta.submissionId === "string" ? rawMeta.submissionId : crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  const attachments = await extractAttachments(formData);

  try {
    await appendSubmissionRow(result.data, meta, attachments);
  } catch (err) {
    console.error("Errore scrittura Google Sheets:", err);
    return NextResponse.json(
      { error: "Impossibile salvare le risposte, riprova." },
      { status: 500 }
    );
  }

  // Le email sono best-effort: i dati sono già salvati su Sheets, un errore
  // qui non deve far percepire l'invio come fallito all'utente.
  const emailResults = await Promise.allSettled([
    sendInternalSummaryEmail(result.data, meta.submissionId, attachments),
    sendClientConfirmationEmail(result.data),
  ]);
  emailResults.forEach((r) => {
    if (r.status === "rejected") console.error("Errore invio email:", r.reason);
  });

  return NextResponse.json({ ok: true });
}
