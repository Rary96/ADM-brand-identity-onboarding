import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { InternalSummaryEmail } from "@/emails/InternalSummaryEmail";
import { ClientConfirmationEmail } from "@/emails/ClientConfirmationEmail";
import type { Questionario } from "@/lib/schema";

const INTERNAL_RECIPIENT = "dalmontearianna.96@gmail.com";

/**
 * Invio via SMTP Gmail (App Password), non Resend: nessun dominio da
 * verificare, nessun refresh token OAuth da rinnovare. Se in futuro il volume
 * di invii dovesse crescere molto, Resend (o altro provider transazionale)
 * torna la scelta più adatta — vedi PROGRESS.md.
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

export async function sendInternalSummaryEmail(data: Questionario, submissionId: string) {
  const transport = getTransport();
  const html = await render(<InternalSummaryEmail data={data} submissionId={submissionId} />);
  await transport.sendMail({
    from: `Onboarding Brand Identity <${process.env.GMAIL_USER}>`,
    to: INTERNAL_RECIPIENT,
    subject: `Nuova submission — ${data.aziendaReferente}`,
    html,
  });
}

export async function sendClientConfirmationEmail(data: Questionario) {
  const transport = getTransport();
  const html = await render(<ClientConfirmationEmail aziendaReferente={data.aziendaReferente} />);
  await transport.sendMail({
    from: `Studio ADM <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: "Grazie — ho ricevuto le tue risposte",
    html,
  });
}
