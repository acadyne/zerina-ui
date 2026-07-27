// src/theme/runtime/system-default-tokens.ts

import type {
  ThemeColorScheme,
  ThemeTokens,
} from "../contracts/theme.types";

import {
  deepFreeze,
} from "../internal/theme-object-utils";


function createSystemDefaultTokens(
  colorScheme: ThemeColorScheme
): ThemeTokens {
  const isLight =
    colorScheme === "light";


  return {
    color: {
      primary: "#2f8c79",
      primaryHover: "#267564",
      primaryContrast: "#ffffff",

      secondary: "#6b7280",
      secondaryHover: "#4b5563",
      secondaryContrast: "#ffffff",

      success: "#22c55e",
      successStrong: "#15803d",
      successContrast: "#ffffff",

      warning: "#f59e0b",
      warningStrong: "#b45309",
      warningContrast: "#ffffff",

      danger: "#ef4444",
      dangerHover: "#dc2626",
      dangerContrast: "#ffffff",
    },

    surface: isLight
      ? {
          bg: "#f6f7f9",
          surface: "#ffffff",
          surface2: "#f1f3f5",
          surface3: "#e9edf1",
          surfaceHover:
            "rgba(15, 23, 42, 0.05)",
        }
      : {
          bg: "#0b0d10",
          surface: "#111315",
          surface2: "#171a1d",
          surface3: "#1d2125",
          surfaceHover:
            "rgba(255,255,255,0.08)",
        },

    text: isLight
      ? {
          text: "#111827",
          textMuted: "#4b5563",
          textSoft: "#6b7280",
          textInverse: "#ffffff",
        }
      : {
          text: "#f3f4f6",
          textMuted: "#c4c7cc",
          textSoft: "#9ca3af",
          textInverse: "#111827",
        },

    border: isLight
      ? {
          border:
            "rgba(17, 24, 39, 0.12)",
          borderStrong:
            "rgba(17, 24, 39, 0.2)",
        }
      : {
          border:
            "rgba(255,255,255,0.12)",
          borderStrong:
            "rgba(255,255,255,0.2)",
        },

    radius: {
      sm: "0.5rem",
      md: "0.65rem",
      lg: "0.85rem",
      xl: "1rem",
      full: "9999px",
    },

    shadow: {
      sm:
        "0 4px 12px rgba(0,0,0,0.12)",
      md:
        "0 10px 28px rgba(0,0,0,0.22)",
      lg:
        "0 18px 48px rgba(0,0,0,0.35)",

      control:
        "0 1px 3px rgba(0,0,0,0.25)",

      action:
        "0 6px 14px rgba(0,0,0,0.14)",
      actionHover:
        "0 8px 18px rgba(0,0,0,0.18)",
      actionSubtleHover:
        "0 4px 12px rgba(0,0,0,0.08)",
      actionOutlineHover:
        "0 4px 12px rgba(0,0,0,0.1)",
    },

    typography: {
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
      },

      fontWeight: {
        medium: 500,
        bold: 700,
      },
    },

    control: {
      height: {
        sm: "2rem",
        md: "2.5rem",
        lg: "3rem",
      },
    },

    interaction: {
      overlay: "rgba(0,0,0,0.55)",
      focusRing:
        "rgba(47,140,121,0.35)",
    },
  };
}


export const SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME:
  Readonly<
    Record<
      ThemeColorScheme,
      ThemeTokens
    >
  > =
  deepFreeze({
    light:
      createSystemDefaultTokens(
        "light"
      ),

    dark:
      createSystemDefaultTokens(
        "dark"
      ),
  });