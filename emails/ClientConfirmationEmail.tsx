import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { outroCopy } from "@/content/questionnaire";
import { personalize } from "@/lib/personalize";
import { colors } from "@/lib/design-tokens";

interface ClientConfirmationEmailProps {
  nomeAzienda: string;
  referente?: string;
}

/** Solo il nome di battesimo da "Marco Rossi, titolare" — se assente, saluta con nomeAzienda. */
function firstName(referente: string | undefined): string | undefined {
  return referente?.split(",")[0]?.trim().split(" ")[0];
}

export function ClientConfirmationEmail({ nomeAzienda, referente }: ClientConfirmationEmailProps) {
  const titolo = personalize(outroCopy.titolo, nomeAzienda);
  const corpo = personalize(outroCopy.corpo, nomeAzienda);
  const saluto = firstName(referente) ?? nomeAzienda;

  return (
    <EmailLayout preview={corpo}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 16px" }}>
        {titolo}
      </Heading>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        Ciao {saluto},
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        {corpo}
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
