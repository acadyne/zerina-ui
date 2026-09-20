// src/theme/built-in/themes.ts


import type {
  ThemeDefinition,
} from "../contracts/theme.types";

import {
  deepFreeze,
} from "../internal/theme-object-utils";


const builtInThemes: ThemeDefinition[] = [
  {
    name: "light",
    source: "builtin",
    metadata: {
      label: "Light",
      icon: "sun",
      colorScheme: "light",
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
        primaryContrast: "#111827",

        primaryContainer: "#dff1da",
        onPrimaryContainer: "#1f3a28",

        secondary: "#d97706",
        secondaryHover: "#b45309",
        secondaryContrast: "#111827",

        secondaryContainer: "#ffedd5",
        onSecondaryContainer: "#431407",

        danger: "#dc2626",
        dangerHover: "#b91c1c",
        dangerContrast: "#ffffff",
      },

      surface: {
        canvas: "#f5fbf3",
        surface: "#ffffff",
        containerLow: "#f6fbf4",
        container: "#edf8ea",
        containerHigh: "#dff1da",
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

      radius: {
        sm: "0.65rem",
        md: "0.85rem",
        lg: "1.05rem",
        xl: "1.3rem",
      },

      elevation: {
        level1: "0 3px 10px rgba(42, 96, 60, 0.10)",
        level2: "0 7px 20px rgba(42, 96, 60, 0.14)",
        level3: "0 12px 30px rgba(42, 96, 60, 0.18)",
        level4: "0 20px 48px rgba(42, 96, 60, 0.22)",
        level5: "0 30px 72px rgba(42, 96, 60, 0.28)",
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
        primaryContrast: "#111827",

        primaryContainer: "#ffedc2",
        onPrimaryContainer: "#4a2a05",

        secondary: "#0ea5a4",
        secondaryHover: "#0f766e",
        secondaryContrast: "#111827",

        secondaryContainer: "#ccfbf1",
        onSecondaryContainer: "#134e4a",

        danger: "#e11d48",
        dangerHover: "#be123c",
        dangerContrast: "#ffffff",
      },

      surface: {
        canvas: "#fff8ed",
        surface: "#fffdf8",
        containerLow: "#fff8e9",
        container: "#fff1d6",
        containerHigh: "#ffe4b5",
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

      radius: {
        sm: "0.7rem",
        md: "0.9rem",
        lg: "1.15rem",
        xl: "1.4rem",
      },

      elevation: {
        level1: "0 3px 10px rgba(146, 64, 14, 0.10)",
        level2: "0 7px 20px rgba(146, 64, 14, 0.14)",
        level3: "0 12px 30px rgba(146, 64, 14, 0.18)",
        level4: "0 20px 48px rgba(146, 64, 14, 0.23)",
        level5: "0 30px 72px rgba(146, 64, 14, 0.30)",
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
        primaryContrast: "#000000",

        primaryContainer: "#4b2818",
        onPrimaryContainer: "#f5e9dc",

        secondary: "#8b5e3c",
        secondaryHover: "#6f4b2f",
        secondaryContrast: "#ffffff",

        secondaryContainer: "#3e2b20",
        onSecondaryContainer: "#f5e9dc",

        danger: "#dc2626",
        dangerHover: "#b91c1c",
        dangerContrast: "#ffffff",
      },

      surface: {
        canvas: "#1c1410",
        surface: "#241a15",
        containerLow: "#2a1f19",
        container: "#2f221b",
        containerHigh: "#3a2b22",
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

      radius: {
        sm: "0.4rem",
        md: "0.58rem",
        lg: "0.78rem",
        xl: "0.95rem",
      },

      elevation: {
        level1: "0 3px 10px rgba(0, 0, 0, 0.34)",
        level2: "0 8px 22px rgba(0, 0, 0, 0.42)",
        level3: "0 14px 34px rgba(0, 0, 0, 0.50)",
        level4: "0 24px 58px rgba(0, 0, 0, 0.60)",
        level5: "0 34px 84px rgba(0, 0, 0, 0.70)",
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
        primaryContrast: "#111827",

        primaryContainer: "#172554",
        onPrimaryContainer: "#dbeafe",

        secondary: "#94a3b8",
        secondaryHover: "#64748b",
        secondaryContrast: "#111827",

        secondaryContainer: "#29313b",
        onSecondaryContainer: "#f1f5f9",

        danger: "#ef4444",
        dangerHover: "#dc2626",
        dangerContrast: "#111827",
      },

      surface: {
        canvas: "#0d1520",
        surface: "#131d2b",
        containerLow: "#161f2f",
        container: "#1a2637",
        containerHigh: "#223146",
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

      radius: {
        sm: "0.4rem",
        md: "0.55rem",
        lg: "0.72rem",
        xl: "0.9rem",
      },

      elevation: {
        level1: "0 3px 12px rgba(1, 8, 20, 0.36)",
        level2: "0 8px 24px rgba(1, 8, 20, 0.44)",
        level3: "0 14px 36px rgba(1, 8, 20, 0.52)",
        level4: "0 24px 60px rgba(1, 8, 20, 0.62)",
        level5: "0 34px 88px rgba(1, 8, 20, 0.72)",
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
        primaryContrast: "#06202a",

        primaryContainer: "#4b1641",
        onPrimaryContainer: "#ffe7fa",

        secondary: "#22d3ee",
        secondaryHover: "#06b6d4",
        secondaryContrast: "#06202a",

        secondaryContainer: "#12343b",
        onSecondaryContainer: "#cffafe",

        danger: "#ff5c7a",
        dangerHover: "#e11d48",
        dangerContrast: "#06202a",
      },

      surface: {
        canvas: "#0b0614",
        surface: "#140b24",
        containerLow: "#190d2b",
        container: "#1d1033",
        containerHigh: "#28164a",
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

      radius: {
        sm: "0.3rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1.1rem",
      },

      elevation: {
        level1: "0 3px 12px rgba(255, 79, 216, 0.12)",
        level2: "0 8px 24px rgba(255, 79, 216, 0.16), 0 0 18px rgba(34, 211, 238, 0.08)",
        level3: "0 14px 36px rgba(255, 79, 216, 0.20), 0 0 28px rgba(34, 211, 238, 0.10)",
        level4: "0 24px 60px rgba(255, 79, 216, 0.24), 0 0 38px rgba(34, 211, 238, 0.12)",
        level5: "0 34px 88px rgba(255, 79, 216, 0.28), 0 0 52px rgba(34, 211, 238, 0.14)",
      },

      typography: {
        fontFamily: {
          display: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        },

        role: {
          display: {
            letterSpacing: "-0.04em",
          },

          headline: {
            letterSpacing: "-0.03em",
          },
        },
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
        primaryContrast: "#2b2117",

        primaryContainer: "#4a331b",
        onPrimaryContainer: "#f3e6c8",

        secondary: "#7c5a3a",
        secondaryHover: "#64472d",
        secondaryContrast: "#fff4df",

        secondaryContainer: "#3d2c1f",
        onSecondaryContainer: "#f3e6c8",

        danger: "#b94f3c",
        dangerHover: "#963d2e",
        dangerContrast: "#fff4ea",
      },

      surface: {
        canvas: "#2b2117",
        surface: "#38291d",
        containerLow: "#3e2e21",
        container: "#453325",
        containerHigh: "#533d2c",
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

      radius: {
        sm: "0.3rem",
        md: "0.45rem",
        lg: "0.65rem",
        xl: "0.82rem",
      },

      elevation: {
        level1: "0 3px 10px rgba(24, 14, 7, 0.34)",
        level2: "0 8px 22px rgba(24, 14, 7, 0.42)",
        level3: "0 14px 34px rgba(24, 14, 7, 0.50)",
        level4: "0 24px 58px rgba(24, 14, 7, 0.60)",
        level5: "0 34px 84px rgba(24, 14, 7, 0.68)",
      },

      typography: {
        fontFamily: {
          display: "Georgia, Cambria, \"Times New Roman\", Times, serif",
        },

        role: {
          display: {
            letterSpacing: "-0.015em",
          },

          headline: {
            letterSpacing: "-0.01em",
          },
        },
      },
    },
  },
];


export const BUILT_IN_THEMES:
  readonly ThemeDefinition[] =
  deepFreeze(builtInThemes);