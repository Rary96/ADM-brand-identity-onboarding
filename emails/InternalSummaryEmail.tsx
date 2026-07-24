import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { SectionBlock } from "@/emails/components/SectionBlock";
import { buildEmailSections } from "@/lib/email-sections";
import { colors } from "@/lib/design-tokens";
import type { Questionario } from "@/lib/schema";

interface InternalSummaryEmailProps {
  data: Questionario;
  submissionId: string;
}

export function InternalSummaryEmail({ data, submissionId }: InternalSummaryEmailProps) {
  const emailSections = buildEmailSections(data);

  return (
    <EmailLayout preview={`Nuova submission — ${data.nomeAzienda}`}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 4px" }}>
        Nuova risposta al questionario — {data.nomeAzienda}
      </Heading>
      <Text style={{ fontSize: 13, color: colors.neutral[400], margin: "0 0 24px" }}>
        {data.referente ? `${data.referente} — ` : ""}ID submission {submissionId}
      </Text>
      {emailSections.map((section) => (
        <SectionBlock key={section.title} section={section} />
      ))}
    </EmailLayout>
  );
}

export default InternalSummaryEmail;
