export const theme = {
  colors: {
    // Primary — electric blue, sharp and intentional
    primary: {
      DEFAULT: "#0066FF",
      hover: "#0052CC",
      muted: "#0066FF1A",
    },
    // Accent — acid green for highlights and success states
    accent: {
      DEFAULT: "#00FF88",
      hover: "#00CC6A",
      muted: "#00FF881A",
    },
    // Neutrals — near-black base, strict grayscale
    neutral: {
      0: "#FFFFFF",
      50: "#F7F7F7",
      100: "#EBEBEB",
      200: "#D4D4D4",
      300: "#A8A8A8",
      400: "#6E6E6E",
      500: "#4A4A4A",
      600: "#2E2E2E",
      700: "#1A1A1A",
      800: "#111111",
      900: "#080808",
    },
    // Status
    success: "#00FF88",
    warning: "#FFB800",
    error: "#FF3333",
  },
  fonts: {
    display: "'Syne', sans-serif",       // Bold geometric — headings
    body: "'DM Sans', sans-serif",        // Clean readable — body text
    mono: "'DM Mono', monospace",         // Data, labels, badges
  },
  radius: {
    sm: "2px",
    md: "4px",
    lg: "8px",
  },
} as const;

export type Theme = typeof theme;