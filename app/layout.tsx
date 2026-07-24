import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Raccontami il tuo brand — Onboarding Brand Identity",
  description:
    "Questionario di onboarding per la definizione dell'identità visiva del tuo brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
