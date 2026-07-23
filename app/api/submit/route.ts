import { NextResponse } from "next/server";
import { questionarioSchema } from "@/lib/schema";
import { appendSubmissionRow } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = questionarioSchema.safeParse(body?.data);

  if (!result.success) {
    return NextResponse.json(
      { error: "Dati non validi", issues: result.error.issues },
      { status: 400 }
    );
  }

  const meta = {
    submissionId:
      typeof body?.meta?.submissionId === "string"
        ? body.meta.submissionId
        : crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  try {
    await appendSubmissionRow(result.data, meta);
  } catch (err) {
    console.error("Errore scrittura Google Sheets:", err);
    return NextResponse.json(
      { error: "Impossibile salvare le risposte, riprova." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
