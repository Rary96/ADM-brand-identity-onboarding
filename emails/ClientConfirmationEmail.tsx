import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { outroCopy } from "@/content/questionnaire";
import { colors } from "@/lib/design-tokens";

interface ClientConfirmationEmailProps {
  aziendaReferente: string;
}

export function ClientConfirmationEmail({ aziendaReferente }: ClientConfirmationEmailProps) {
  return (
    <EmailLayout preview={outroCopy.corpo}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 16px" }}>
        {outroCopy.titolo}
      </Heading>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        Ciao{aziendaReferente ? `, ${aziendaReferente}` : ""},
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        {outroCopy.corpo}
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: 0 }}>
        A presto,
        <br />
        Arianna
      </Text>
    </EmailLayout>
  );
}

export default ClientConfirmationEmail;
