// src/theme/contracts/theme.types.ts

import type React from "react";

export type ThemeName = string;

export type ThemeSource =
  | "builtin"
  | "custom"
  | "generated";

export type ThemeColorScheme =
  | "light"
  | "dark";

export interface ThemeMetadata {

  label?: string;

  /**
   * Optional theme description.
   */
  description?: string;

  /**
   * Optional theme selector icon.
   */
  icon?: React.ComponentType;

  /**
   * Browser native color integration hint.
   */
  colorScheme?: ThemeColorScheme;
}

export interface ThemeDefinition {
  /**
   * Stable public identifier.
   */
  name: ThemeName;

  /**
   * Theme origin.
   */
  source: ThemeSource;

  /**
   * Optional presentation metadata.
   */
  metadata?: ThemeMetadata;

  /**
   * Parent theme identifier.
   *
   * Missing values may be resolved from this parent.
   */
  extends?: ThemeName;

  /**
   * Semantic token overrides.
   */
  tokens?: ThemeTokens;
}

export interface ThemeTokens {
  color?: ThemeColorTokens;

  surface?: ThemeSurfaceTokens;

  text?: ThemeTextTokens;

  border?: ThemeBorderTokens;

  radius?: ThemeRadiusTokens;

  shadow?: ThemeShadowTokens;

  typography?: ThemeTypographyTokens;

  /**
   * Application-owned semantic extensions.
   */
  extensions?: Record<string, unknown>;
}

export interface ThemeColorTokens {
  primary?: string;
  primaryHover?: string;
  primaryContrast?: string;

  secondary?: string;
  secondaryHover?: string;
  secondaryContrast?: string;

  success?: string;
  successStrong?: string;
  successContrast?: string;

  warning?: string;
  warningStrong?: string;
  warningContrast?: string;

  danger?: string;
  dangerHover?: string;
  dangerContrast?: string;
}

export interface ThemeSurfaceTokens {
  bg?: string;
  surface?: string;
  surface2?: string;
  surface3?: string;
  surfaceHover?: string;
}

export interface ThemeTextTokens {
  text?: string;
  textMuted?: string;
  textSoft?: string;
  textInverse?: string;
}

export interface ThemeBorderTokens {
  border?: string;
  borderStrong?: string;
}

export interface ThemeRadiusTokens {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  full?: string;
}

export interface ThemeShadowTokens {
  sm?: string;
  md?: string;
  lg?: string;

  control?: string;

  action?: string;
  actionHover?: string;
  actionSubtleHover?: string;
  actionOutlineHover?: string;
}

export interface ThemeTypographyTokens {
  fontSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };

  fontWeight?: {
    medium?: number;
    bold?: number;
  };
}

export interface ThemeValidationDiagnostic {
  level: "error" | "warning" | "info";

  code: string;

  message: string;

  path?: string;
}

export interface ThemeValidationResult {
  valid: boolean;

  diagnostics: ThemeValidationDiagnostic[];
}