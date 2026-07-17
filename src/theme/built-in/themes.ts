// src/theme/built-in/themes.ts

import type { ThemeDefinition } from "../contracts/theme.types";

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    name: "light",
    source: "builtin",
    metadata: {
      label: "Light",
      colorScheme: "light",
    },
    tokens: {
      color: {
        primary: "#2f8c79",
        primaryHover: "#267564",
        primaryContrast: "#ffffff",

        secondary: "#6b7280",
        secondaryHover: "#4b5563",
        secondaryContrast: "#ffffff",

        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#f6f7f9",
        surface: "#ffffff",
        surface2: "#f1f3f5",
        surface3: "#e9edf1",
        surfaceHover: "rgba(15, 23, 42, 0.05)",
      },

      text: {
        text: "#111827",
        textMuted: "#4b5563",
        textSoft: "#6b7280",
        textInverse: "#ffffff",
      },

      border: {
        border: "rgba(17, 24, 39, 0.12)",
        borderStrong: "rgba(17, 24, 39, 0.2)",
      },
    },
  },

  {
    name: "dark",
    source: "builtin",
    metadata: {
      label: "Dark",
      colorScheme: "dark",
    },
    tokens: {
      color: {
        primary: "#2f8c79",
        primaryHover: "#267564",
        primaryContrast: "#ffffff",

        secondary: "#6b7280",
        secondaryHover: "#4b5563",
        secondaryContrast: "#ffffff",

        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#0b0d10",
        surface: "#111315",
        surface2: "#171a1d",
        surface3: "#1d2125",
        surfaceHover: "rgba(255,255,255,0.08)",
      },

      text: {
        text: "#f3f4f6",
        textMuted: "#c4c7cc",
        textSoft: "#9ca3af",
        textInverse: "#111827",
      },

      border: {
        border: "rgba(255,255,255,0.12)",
        borderStrong: "rgba(255,255,255,0.2)",
      },
    },
  },
];