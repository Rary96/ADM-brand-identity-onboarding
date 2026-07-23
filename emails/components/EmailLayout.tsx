import { Html, Head, Body, Container, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { colors } from "@/lib/design-tokens";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="it">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.neutral[50],
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: 16,
            padding: 32,
            maxWidth: 560,
          }}
        >
          <Section
            style={{
              borderBottom: `3px solid ${colors.accent[300]}`,
              paddingBottom: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.accent[600],
                letterSpacing: 0.5,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Onboarding Brand Identity
            </Text>
          </Section>

          {children}

          <Section
            style={{
              borderTop: `1px solid ${colors.neutral[200]}`,
              marginTop: 32,
              paddingTop: 16,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.neutral[400], margin: 0 }}>
              ADM — Design & Digital
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
