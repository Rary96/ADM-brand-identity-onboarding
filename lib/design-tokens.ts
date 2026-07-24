/**
 * Design tokens condivisi tra Tailwind config e componenti.
 *
 * Palette pensata per essere quasi interamente neutra (bianco / grigi),
 * con il lilla come UNICO accento — usato solo su: progress bar, focus ring,
 * pulsante primario, piccoli dettagli (checkbox selezionati, underline attivo).
 * Testo, sfondi e card restano neutri per non influenzare le risposte
 * estetiche del cliente (stesso principio di Typeform).
 */

export const colors = {
  // Accento — Pantone 13-3905 TCX "Diaphanous Lilac"
  accent: {
    DEFAULT: "#C6C2CD",
    50: "#F7F6F8",
    100: "#EFEDF1",
    200: "#DFDBE3",
    300: "#C6C2CD", // base
    400: "#ACA5B7",
    500: "#8F86A0",
    600: "#726A83",
    700: "#585168",
    800: "#3E394A",
    900: "#252230",
  },
  // Neutrali — dominanti nell'interfaccia
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAFA",
    100: "#F2F2F3",
    200: "#E4E4E6",
    300: "#CBCBCE",
    400: "#9C9CA1",
    500: "#6E6E74",
    600: "#4E4E53",
    700: "#37373B",
    800: "#222225",
    900: "#141416",
  },
  success: "#5FA37B",
  error: "#C4604F",
} as const;

export const fonts = {
  // Font sans neutro e leggibile, coerente con un tono "pulito" e non decorativo
  sans: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
  // Font per numeri/step (progress "3 / 9") — stesso family, peso diverso
  mono: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  full: "9999px",
} as const;

export const motion = {
  // Transizioni tra step — coerenti con riferimento Typeform: veloci, non invasive
  stepDuration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;
