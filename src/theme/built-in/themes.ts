// src/theme/built-in/themes.ts

import type {
  ThemeDefinition,
} from "../contracts/theme.types";


export const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    name: "light",
    source: "builtin",
    metadata: {
      label: "Light",
      icon: "sun",
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
      icon: "moon",
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
  {
    name: "spring",
    source: "builtin",
    metadata: {
      label: "Spring",
      icon: "spring",
      colorScheme: "light",
    },
    tokens: {
      color: {
        primary: "#5aa469",
        primaryHover: "#4a8c58",
        primaryContrast: "#ffffff",

        secondary: "#d97706",
        secondaryHover: "#b45309",
        secondaryContrast: "#ffffff",

        danger: "#dc2626",
        dangerHover: "#b91c1c",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#f5fbf3",
        surface: "#ffffff",
        surface2: "#edf8ea",
        surface3: "#dff1da",
        surfaceHover: "rgba(40, 120, 80, 0.08)",
      },

      text: {
        text: "#1f2937",
        textMuted: "#3f4d43",
        textSoft: "#6b7280",
        textInverse: "#ffffff",
      },

      border: {
        border: "rgba(56, 114, 72, 0.16)",
        borderStrong: "rgba(56, 114, 72, 0.28)",
      },
    },
  },

  {
    name: "summer",
    source: "builtin",
    metadata: {
      label: "Summer",
      icon: "summer",
      colorScheme: "light",
    },
    tokens: {
      color: {
        primary: "#f59e0b",
        primaryHover: "#d97706",
        primaryContrast: "#ffffff",

        secondary: "#0ea5a4",
        secondaryHover: "#0f766e",
        secondaryContrast: "#ffffff",

        danger: "#e11d48",
        dangerHover: "#be123c",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#fff8ed",
        surface: "#fffdf8",
        surface2: "#fff1d6",
        surface3: "#ffe4b5",
        surfaceHover: "rgba(180, 83, 9, 0.08)",
      },

      text: {
        text: "#2b2118",
        textMuted: "#5b4636",
        textSoft: "#8a6f5a",
        textInverse: "#ffffff",
      },

      border: {
        border: "rgba(146, 64, 14, 0.16)",
        borderStrong: "rgba(146, 64, 14, 0.26)",
      },
    },
  },

  {
    name: "autumn",
    source: "builtin",
    metadata: {
      label: "Autumn",
      icon: "autumn",
      colorScheme: "dark",
    },
    tokens: {
      color: {
        primary: "#c0652a",
        primaryHover: "#a94f1b",
        primaryContrast: "#ffffff",

        secondary: "#8b5e3c",
        secondaryHover: "#6f4b2f",
        secondaryContrast: "#ffffff",

        danger: "#dc2626",
        dangerHover: "#b91c1c",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#1c1410",
        surface: "#241a15",
        surface2: "#2f221b",
        surface3: "#3a2b22",
        surfaceHover: "rgba(255,255,255,0.06)",
      },

      text: {
        text: "#f5e9dc",
        textMuted: "#d4bfae",
        textSoft: "#b08968",
        textInverse: "#1b120d",
      },

      border: {
        border: "rgba(255,220,180,0.12)",
        borderStrong: "rgba(255,220,180,0.2)",
      },
    },
  },

  {
    name: "winter",
    source: "builtin",
    metadata: {
      label: "Winter",
      icon: "winter",
      colorScheme: "dark",
    },
    tokens: {
      color: {
        primary: "#60a5fa",
        primaryHover: "#3b82f6",
        primaryContrast: "#ffffff",

        secondary: "#94a3b8",
        secondaryHover: "#64748b",
        secondaryContrast: "#ffffff",

        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#0d1520",
        surface: "#131d2b",
        surface2: "#1a2637",
        surface3: "#223146",
        surfaceHover: "rgba(255,255,255,0.07)",
      },

      text: {
        text: "#eef6ff",
        textMuted: "#c2d4e8",
        textSoft: "#93aac4",
        textInverse: "#0f172a",
      },

      border: {
        border: "rgba(255,255,255,0.12)",
        borderStrong: "rgba(255,255,255,0.2)",
      },
    },
  },
  {
    name: "retro-futurist",
    source: "builtin",
    metadata: {
      label: "Retro Futurist",
      icon: "sparkles",
      colorScheme: "dark",
    },
    tokens: {
      color: {
        primary: "#ff4fd8",
        primaryHover: "#e13fc0",
        primaryContrast: "#ffffff",

        secondary: "#22d3ee",
        secondaryHover: "#06b6d4",
        secondaryContrast: "#06202a",

        danger: "#ff5c7a",
        dangerHover: "#e11d48",
        dangerContrast: "#ffffff",
      },

      surface: {
        bg: "#0b0614",
        surface: "#140b24",
        surface2: "#1d1033",
        surface3: "#28164a",
        surfaceHover: "rgba(255,255,255,0.08)",
      },

      text: {
        text: "#f5eefe",
        textMuted: "#d7c7f0",
        textSoft: "#a78bda",
        textInverse: "#12091f",
      },

      border: {
        border: "rgba(255,0,200,0.18)",
        borderStrong: "rgba(0,255,255,0.24)",
      },
    },
  },

  {
    name: "sepia-retro",
    source: "builtin",
    metadata: {
      label: "Sepia Retro",
      icon: "palette",
      colorScheme: "dark",
    },
    tokens: {
      color: {
        primary: "#c08a3e",
        primaryHover: "#a9742f",
        primaryContrast: "#fff8ea",

        secondary: "#7c5a3a",
        secondaryHover: "#64472d",
        secondaryContrast: "#fff4df",

        danger: "#b94f3c",
        dangerHover: "#963d2e",
        dangerContrast: "#fff4ea",
      },

      surface: {
        bg: "#2b2117",
        surface: "#38291d",
        surface2: "#453325",
        surface3: "#533d2c",
        surfaceHover: "rgba(255,248,220,0.08)",
      },

      text: {
        text: "#f3e6c8",
        textMuted: "#dbc7a1",
        textSoft: "#b79d75",
        textInverse: "#2b2117",
      },

      border: {
        border: "rgba(243,230,200,0.14)",
        borderStrong: "rgba(243,230,200,0.24)",
      },
    },
  },
];