// src/theme/contracts/theme.types.ts

import type {
  ThemeTokens,
} from "./theme-token-contract";

export type {
  CSSFontWeight,
  ResolvedThemeTokens,
  ThemeBorderTokens,
  ThemeColorTokens,
  ThemeControlTokens,
  ThemeExtensionPrimitive,
  ThemeExtensionTokens,
  ThemeExtensionValue,
  ThemeInteractionTokens,
  ThemeRadiusTokens,
  ThemeShadowTokens,
  ThemeSurfaceTokens,
  ThemeTextTokens,
  ThemeTokenCSSVariable,
  ThemeTokens,
  ThemeTypographyTokens,
} from "./theme-token-contract";

export type ThemeIconName =
  string;

export type ThemeName =
  string;

export type ThemeSource =
  | "builtin"
  | "custom"
  | "generated";

export type ThemeColorScheme =
  | "light"
  | "dark";

export interface ThemeMetadata {
  label?: string;

  description?: string;

  icon?: ThemeIconName;

  colorScheme?: ThemeColorScheme;
}

export interface ThemeDefinition {
  name: ThemeName;

  source: ThemeSource;

  metadata?: ThemeMetadata;

  extends?: ThemeName;

  tokens?: ThemeTokens;
}

export interface ThemeValidationDiagnostic {
  level:
    | "error"
    | "warning"
    | "info";

  code: string;

  message: string;

  path?: string;
}

export type ThemeValidationResult =
  | {
      valid: true;

      value: ThemeDefinition;

      diagnostics:
        ThemeValidationDiagnostic[];
    }
  | {
      valid: false;

      diagnostics:
        ThemeValidationDiagnostic[];
    };
