// src/theme/ssr/theme-document-state.ts

import type {
  ThemeColorScheme,
  ThemeDefinition,
  ThemeName,
  ThemeTokenCSSVariable,
} from "../contracts/theme.types";

import {
  BUILT_IN_THEMES,
} from "../built-in";

import {
  ThemeSystem,
} from "../runtime/theme-system";

import {
  createThemeStyleRecord,
  type ThemeStyleRecord,
} from "../runtime/theme-style-declarations";

export interface CreateThemeDocumentStateOptions {
  /**
   * Theme used by the server and by the first client render.
   *
   * When omitted, the first registered theme is selected.
   */
  initialTheme?: ThemeName;

  /**
   * Theme registry used during server rendering.
   *
   * The same registry and initialTheme must be passed to
   * UIThemeProvider during hydration.
   */
  themes?: readonly ThemeDefinition[];
}

export type ThemeDocumentCustomProperty =
  ThemeTokenCSSVariable;

export type ThemeDocumentStyle = {
  colorScheme:
    ThemeColorScheme;
} & ThemeStyleRecord;

export interface ThemeDocumentState {
  /**
   * Value for the data-ui-theme attribute on the document root.
   */
  themeName: ThemeName;

  /**
   * Effective color scheme resolved through theme inheritance.
   */
  colorScheme:
    ThemeColorScheme;

  /**
   * React-compatible inline style object for the document root.
   */
  style:
    ThemeDocumentStyle;
}

/**
 * Creates the deterministic theme state used by an SSR document.
 *
 * This helper is pure:
 * - it does not access window, document, or localStorage
 * - it does not mutate the DOM
 * - it does not restore persisted client preferences
 *
 * UIThemeProvider must receive the same themes and initialTheme during
 * hydration. Persisted preferences are restored after mounting.
 */
export function createThemeDocumentState(
  options:
    CreateThemeDocumentStateOptions = {}
): ThemeDocumentState {
  const system =
    new ThemeSystem({
      initialTheme:
        options.initialTheme,

      persist:
        false,

      themes:
        options.themes ??
        BUILT_IN_THEMES,

      readStoredThemeOnInit:
        false,
    });

  const activeTheme =
    system.getActiveTheme();

  const resolved =
    system.resolveTheme(
      activeTheme.name
    );

  const customProperties =
    createThemeStyleRecord(
      resolved.tokens
    );

  const style:
    ThemeDocumentStyle =
    Object.freeze({
      ...customProperties,

      colorScheme:
        resolved.metadata
          .colorScheme,
    });

  return Object.freeze({
    themeName:
      resolved.name,

    colorScheme:
      resolved.metadata
        .colorScheme,

    style,
  });
}
