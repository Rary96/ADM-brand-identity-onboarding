import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { InternalSummaryEmail } from "@/emails/InternalSummaryEmail";
import { ClientConfirmationEmail } from "@/emails/ClientConfirmationEmail";
import type { Questionario } from "@/lib/schema";
import type { ParsedAttachment } from "@/lib/attachment-limits";

const INTERNAL_RECIPIENT = "dalmontearianna.96@gmail.com";

export type MailAttachment = ParsedAttachment;

/**
 * Invio via SMTP Gmail (App Password), non Resend: nessun dominio da
 * verificare, nessun refresh token OAuth da rinnovare. Se in futuro il volume
 * di invii dovesse crescere molto, Resend (o altro provider transazionale)
 * torna la scelta più adatta — vedi doc/PROGRESS.md.
 */
function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER o GMAIL_APP_PASSWORD mancanti");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendInternalSummaryEmail(
  data: Questionario,
  submissionId: string,
  attachments: MailAttachment[] = []
) {
  const transport = getTransport();
  const html = await render(<InternalSummaryEmail data={data} submissionId={submissionId} />);
  await transport.sendMail({
    from: `Onboarding Brand Identity <${process.env.GMAIL_USER}>`,
    to: INTERNAL_RECIPIENT,
    subject: `Nuova submission — ${data.nomeAzienda}`,
    html,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
  });
}

export async function sendClientConfirmationEmail(data: Questionario) {
  const transport = getTransport();
  const html = await render(
    <ClientConfirmationEmail nomeAzienda={data.nomeAzienda} referente={data.referente} />
  );
  await transport.sendMail({
    from: `Arianna Dal Monte | ADM Design & Digital <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: "Grazie — ho ricevuto le tue risposte",
    html,
  });
}
