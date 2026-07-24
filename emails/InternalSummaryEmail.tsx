import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { SectionBlock } from "@/emails/components/SectionBlock";
import { buildEmailSections } from "@/lib/email-sections";
import { getOptionLabel } from "@/lib/questionnaire-labels";
import { colors } from "@/lib/design-tokens";
import type { Questionario } from "@/lib/schema";

interface InternalSummaryEmailProps {
  data: Questionario;
  submissionId: string;
}

export function InternalSummaryEmail({ data, submissionId }: InternalSummaryEmailProps) {
  const emailSections = buildEmailSections(data);
  const tipoProgettoLabel = getOptionLabel("tipoProgetto", data.tipoProgetto);
  const budgetLabel = getOptionLabel("budget", data.budget);

  return (
    <EmailLayout preview={`Nuova submission — ${data.aziendaReferente}`}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 4px" }}>
        Nuova risposta al questionario
      </Heading>
      <Text style={{ fontSize: 13, color: colors.neutral[400], margin: "0 0 20px" }}>
        ID submission {submissionId}
      </Text>

      <Section
        style={{
          backgroundColor: colors.accent[50],
          border: `1px solid ${colors.accent[200]}`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: 700, color: colors.neutral[900], margin: "0 0 8px" }}>
          {data.aziendaReferente}
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 1.7, color: colors.neutral[700], margin: 0 }}>
          {data.email}
          {data.telefonoSito ? (
            <>
              <br />
              {data.telefonoSito}
            </>
          ) : null}
          <br />
          <span style={{ color: colors.accent[700], fontWeight: 600 }}>{tipoProgettoLabel}</span>
          {budgetLabel ? ` · Budget: ${budgetLabel}` : ""}
        </Text>
      </Section>

      {emailSections.map((section) => (
        <SectionBlock key={section.title} section={section} />
      ))}
    </EmailLayout>
  );
}

export default InternalSummaryEmail;
