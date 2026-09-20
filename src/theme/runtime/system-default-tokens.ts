// src/theme/runtime/system-default-tokens.ts

import type {
  ResolvedThemeTokens,
  ThemeColorScheme,
} from "../contracts/theme.types";

import {
  deepFreeze,
} from "../internal/theme-object-utils";


function createSystemDefaultTokens(
  colorScheme: ThemeColorScheme
): ResolvedThemeTokens {
  const isLight =
    colorScheme === "light";

  return {
    color: {
      primary: "#2f8c79",
      primaryHover: "#267564",
      primaryContrast: "#000000",
      primaryContainer:
        isLight
          ? "#d7efe9"
          : "#163f37",
      onPrimaryContainer:
        isLight
          ? "#17352f"
          : "#bfe8de",

      secondary: "#6b7280",
      secondaryHover: "#4b5563",
      secondaryContrast: "#ffffff",
      secondaryContainer:
        isLight
          ? "#e5e7eb"
          : "#29313b",
      onSecondaryContainer:
        isLight
          ? "#1f2937"
          : "#e5e7eb",

      neutralContainer:
        isLight
          ? "#eef0f2"
          : "#1d2125",
      onNeutralContainer:
        isLight
          ? "#1f2937"
          : "#f3f4f6",

      info:
        isLight
          ? "#2563eb"
          : "#60a5fa",
      infoStrong:
        isLight
          ? "#1d4ed8"
          : "#3b82f6",
      infoContrast:
        isLight
          ? "#ffffff"
          : "#111827",
      infoContainer:
        isLight
          ? "#dbeafe"
          : "#172554",
      onInfoContainer:
        isLight
          ? "#1e3a8a"
          : "#dbeafe",

      success: "#22c55e",
      successStrong: "#15803d",
      successContrast: "#111827",
      successContainer:
        isLight
          ? "#dcfce7"
          : "#143f27",
      onSuccessContainer:
        isLight
          ? "#14532d"
          : "#dcfce7",

      warning: "#f59e0b",
      warningStrong: "#b45309",
      warningContrast: "#111827",
      warningContainer:
        isLight
          ? "#fef3c7"
          : "#422006",
      onWarningContainer:
        isLight
          ? "#78350f"
          : "#fef3c7",

      danger: "#ef4444",
      dangerHover: "#dc2626",
      dangerContrast: "#111827",
      dangerContainer:
        isLight
          ? "#fee2e2"
          : "#4c1d1d",
      onDangerContainer:
        isLight
          ? "#7f1d1d"
          : "#fee2e2",
    },

    surface:
      isLight
        ? {
            canvas:
              "#f6f7f9",

            surface:
              "#ffffff",

            containerLow:
              "#f8f9fa",

            container:
              "#f1f3f5",

            containerHigh:
              "#e9edf1",

            surfaceHover:
              "rgba(15, 23, 42, 0.05)",
          }
        : {
            canvas:
              "#0b0d10",

            surface:
              "#111315",

            containerLow:
              "#141719",

            container:
              "#171a1d",

            containerHigh:
              "#1d2125",

            surfaceHover:
              "rgba(255,255,255,0.08)",
          },

    text:
      isLight
        ? {
            text:
              "#111827",

            textMuted:
              "#4b5563",

            textSoft:
              "#6b7280",

            textInverse:
              "#ffffff",
          }
        : {
            text:
              "#f3f4f6",

            textMuted:
              "#c4c7cc",

            textSoft:
              "#9ca3af",

            textInverse:
              "#111827",
          },

    border:
      isLight
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
      sm:
        "0.5rem",

      md:
        "0.65rem",

      lg:
        "0.85rem",

      xl:
        "1rem",

      full:
        "9999px",
    },

    elevation:
      isLight
        ? {
            level0:
              "none",

            level1:
              "0 2px 8px rgba(15,23,42,0.10)",

            level2:
              "0 6px 18px rgba(15,23,42,0.14)",

            level3:
              "0 10px 28px rgba(15,23,42,0.20)",

            level4:
              "0 18px 48px rgba(15,23,42,0.28)",

            level5:
              "0 28px 72px rgba(15,23,42,0.34)",
          }
        : {
            level0:
              "none",

            level1:
              "0 3px 10px rgba(0,0,0,0.30)",

            level2:
              "0 8px 22px rgba(0,0,0,0.38)",

            level3:
              "0 12px 32px rgba(0,0,0,0.48)",

            level4:
              "0 22px 56px rgba(0,0,0,0.58)",

            level5:
              "0 30px 80px rgba(0,0,0,0.68)",
          },

    typography: {
      fontFamily: {
        body:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",

        display:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",

        mono:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", monospace",
      },

      fontSize: {
        xs:
          "0.75rem",

        sm:
          "0.875rem",

        md:
          "1rem",

        lg:
          "1.125rem",

        xl:
          "1.25rem",
      },

      headingFontSize: {
        sm:
          "1.125rem",

        md:
          "1.25rem",

        lg:
          "1.5rem",

        xl:
          "1.875rem",

        "2xl":
          "2.25rem",
      },

      fontWeight: {
        regular:
          400,

        medium:
          500,

        bold:
          700,
      },

      role: {
        display: {
          fontFamily:
            "var(--ui-font-family-display)",

          fontSize:
            "var(--ui-heading-font-size-2xl)",

          fontWeight:
            "var(--ui-font-weight-bold)",

          lineHeight:
            "1.08",

          letterSpacing:
            "-0.025em",
        },

        headline: {
          fontFamily:
            "var(--ui-font-family-display)",

          fontSize:
            "var(--ui-heading-font-size-lg)",

          fontWeight:
            "var(--ui-font-weight-bold)",

          lineHeight:
            "1.18",

          letterSpacing:
            "-0.018em",
        },

        title: {
          fontFamily:
            "var(--ui-font-family-display)",

          fontSize:
            "var(--ui-heading-font-size-sm)",

          fontWeight:
            "var(--ui-font-weight-bold)",

          lineHeight:
            "1.28",

          letterSpacing:
            "-0.01em",
        },

        body: {
          fontFamily:
            "var(--ui-font-family-body)",

          fontSize:
            "var(--ui-font-size-md)",

          fontWeight:
            "var(--ui-font-weight-regular)",

          lineHeight:
            "1.5",

          letterSpacing:
            "0",
        },

        label: {
          fontFamily:
            "var(--ui-font-family-body)",

          fontSize:
            "var(--ui-font-size-sm)",

          fontWeight:
            "var(--ui-font-weight-medium)",

          lineHeight:
            "1.3",

          letterSpacing:
            "0.01em",
        },

        caption: {
          fontFamily:
            "var(--ui-font-family-body)",

          fontSize:
            "var(--ui-font-size-xs)",

          fontWeight:
            "var(--ui-font-weight-medium)",

          lineHeight:
            "1.35",

          letterSpacing:
            "0.02em",
        },
      },
    },

    spacing: {
      zero:
        "0",

      xs:
        "0.25rem",

      sm:
        "0.5rem",

      md:
        "0.75rem",

      lg:
        "1rem",

      xl:
        "1.5rem",

      "2xl":
        "2rem",

      "3xl":
        "3rem",
    },

    density: {
      compact: {
        controlHeight:
          "2.25rem",

        itemMinHeight:
          "2.5rem",

        inlineGap:
          "0.375rem",

        blockGap:
          "0.5rem",

        contentPadding:
          "0.75rem",

        iconSize:
          "1.125rem",
      },

      comfortable: {
        controlHeight:
          "2.75rem",

        itemMinHeight:
          "3rem",

        inlineGap:
          "0.5rem",

        blockGap:
          "0.75rem",

        contentPadding:
          "1rem",

        iconSize:
          "1.25rem",
      },

      spacious: {
        controlHeight:
          "3.25rem",

        itemMinHeight:
          "3.5rem",

        inlineGap:
          "0.75rem",

        blockGap:
          "1rem",

        contentPadding:
          "1.25rem",

        iconSize:
          "1.5rem",
      },
    },

    control: {
      height: {
        sm:
          "2rem",

        md:
          "2.5rem",

        lg:
          "3rem",
      },

      paddingX: {
        sm:
          "0.75rem",

        md:
          "0.9rem",

        lg:
          "1rem",
      },

      paddingY: {
        sm:
          "0.45rem",

        md:
          "0.6rem",

        lg:
          "0.75rem",
      },

      textareaMinHeight: {
        sm:
          "84px",

        md:
          "108px",

        lg:
          "132px",
      },
    },

    interaction: {
      overlay:
        "rgba(0,0,0,0.55)",

      focusRingColor:
        "color-mix(in srgb, var(--ui-primary) 35%, transparent)",

      focusRingDangerColor:
        "color-mix(in srgb, var(--ui-danger) 35%, transparent)",

      focusRingWidth:
        "3px",

      focusRingOffset:
        "0px",

      disabledOpacity:
        "0.65",
    },

    extensions: {},
  };
}

export const SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME:
  Readonly<
    Record<
      ThemeColorScheme,
      ResolvedThemeTokens
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
