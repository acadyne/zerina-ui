// src/theme/runtime/resolve-theme-tokens.ts

import type {
  ThemeDefinition,
  ThemeTokens,
  ThemeName,
} from "../contracts/theme.types";


function mergeTokens(
  base: ThemeTokens,
  override: ThemeTokens
): ThemeTokens {
  return {
    color: {
      ...base.color,
      ...override.color,
    },

    surface: {
      ...base.surface,
      ...override.surface,
    },

    text: {
      ...base.text,
      ...override.text,
    },

    border: {
      ...base.border,
      ...override.border,
    },

    radius: {
      ...base.radius,
      ...override.radius,
    },

    shadow: {
      ...base.shadow,
      ...override.shadow,
    },

    typography: {
      fontSize: {
        ...base.typography?.fontSize,
        ...override.typography?.fontSize,
      },

      fontWeight: {
        ...base.typography?.fontWeight,
        ...override.typography?.fontWeight,
      },
    },

    extensions: {
      ...base.extensions,
      ...override.extensions,
    },
  };
}


export interface ResolveThemeTokensOptions {
  theme: ThemeDefinition;

  themes: Map<ThemeName, ThemeDefinition>;

  defaults?: ThemeTokens;
}


export function resolveThemeTokens({
  theme,
  themes,
  defaults = {},
}: ResolveThemeTokensOptions): ThemeTokens {
  const inheritedTokens = theme.extends
    ? resolveParentThemeTokens(
        theme.extends,
        themes,
        defaults
      )
    : {};


  return mergeTokens(
    mergeTokens(
      defaults,
      inheritedTokens
    ),
    theme.tokens ?? {}
  );
}


function resolveParentThemeTokens(
  parentName: ThemeName,
  themes: Map<ThemeName, ThemeDefinition>,
  defaults: ThemeTokens
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
    defaults,
  });
}