import { Heading, Text } from "@react-email/components";
import { colors } from "@/lib/design-tokens";
import type { EmailSection } from "@/lib/email-sections";

export function SectionBlock({ section }: { section: EmailSection }) {
  return (
    <>
      <Heading
        as="h3"
        style={{ fontSize: 15, color: colors.neutral[900], margin: "24px 0 8px" }}
      >
        {section.title}
      </Heading>
      {section.fields.map((field) => (
        <Text
          key={field.label}
          style={{ fontSize: 14, lineHeight: 1.5, margin: "0 0 10px", color: colors.neutral[700] }}
        >
          <strong style={{ color: colors.neutral[600] }}>{field.label}</strong>
          <br />
          {field.value}
        </Text>
      ))}
    </>
  );
}
