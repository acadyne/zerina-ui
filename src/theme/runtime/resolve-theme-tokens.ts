// src/theme/runtime/resolve-theme-tokens.ts

import type {
  ThemeDefinition,
  ThemeTokens,
} from "../contracts/theme.types";


function mergeTokens(
  inherited: ThemeTokens,
  explicit: ThemeTokens
): ThemeTokens {
  return {
    color: {
      ...inherited.color,
      ...explicit.color,
    },

    surface: {
      ...inherited.surface,
      ...explicit.surface,
    },

    text: {
      ...inherited.text,
      ...explicit.text,
    },

    border: {
      ...inherited.border,
      ...explicit.border,
    },

    radius: {
      ...inherited.radius,
      ...explicit.radius,
    },

    shadow: {
      ...inherited.shadow,
      ...explicit.shadow,
    },

    typography: {
      fontSize: {
        ...inherited.typography?.fontSize,
        ...explicit.typography?.fontSize,
      },

      fontWeight: {
        ...inherited.typography?.fontWeight,
        ...explicit.typography?.fontWeight,
      },
    },

    extensions: {
      ...inherited.extensions,
      ...explicit.extensions,
    },
  };
}


export interface ResolveThemeTokensOptions {
  theme: ThemeDefinition;

  themes: Map<string, ThemeDefinition>;

  defaults?: ThemeTokens;
}


export function resolveThemeTokens(
  options: ResolveThemeTokensOptions
): ThemeTokens {
  const {
    theme,
    themes,
    defaults = {},
  } = options;


  const parentTokens =
    theme.extends
      ? resolveParentTokens(
          theme.extends,
          themes
        )
      : {};


  return mergeTokens(
    mergeTokens(
      defaults,
      parentTokens
    ),
    theme.tokens ?? {}
  );
}


function resolveParentTokens(
  parentName: string,
  themes: Map<string, ThemeDefinition>
): ThemeTokens {
  const parent =
    themes.get(parentName);


  if (!parent) {
    throw new Error(
      `Theme "${parentName}" does not exist`
    );
  }


  return resolveThemeTokens({
    theme: parent,
    themes,
  });
}