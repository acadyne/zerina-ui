// src/theme/ssr/theme-document-state.ts

import type {
  ThemeColorScheme,
  ThemeDefinition,
  ThemeName,
} from "../contracts/theme.types";

import {
  BUILT_IN_THEMES,
} from "../built-in";

import {
  ThemeSystem,
} from "../runtime/theme-system";

import {
  createThemeStyleDeclarations,
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
  `--ui-${string}`;


export type ThemeDocumentStyle = {
  colorScheme: ThemeColorScheme;
} & Readonly<
  Record<
    ThemeDocumentCustomProperty,
    string
  >
>;


export interface ThemeDocumentState {
  /**
   * Value for the data-ui-theme attribute on the document root.
   */
  themeName: ThemeName;

  /**
   * Effective color scheme resolved through theme inheritance.
   */
  colorScheme: ThemeColorScheme;

  /**
   * React-compatible inline style object for the document root.
   */
  style: ThemeDocumentStyle;
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


  const customProperties:
    Record<
      ThemeDocumentCustomProperty,
      string
    > = {};


  const declarations =
    createThemeStyleDeclarations(
      resolved.tokens
    );


  for (const declaration of declarations) {
    customProperties[
      declaration.property as
        ThemeDocumentCustomProperty
    ] =
      declaration.value;
  }


  const style:
    ThemeDocumentStyle = {
      ...customProperties,

      colorScheme:
        resolved.metadata
          .colorScheme,
    };


  return Object.freeze({
    themeName:
      resolved.name,

    colorScheme:
      resolved.metadata
        .colorScheme,

    style:
      Object.freeze(
        style
      ),
  });
}