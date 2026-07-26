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

    control: {
      height: {
        ...base.control?.height,
        ...override.control?.height,
      },
    },

    interaction: {
      ...base.interaction,
      ...override.interaction,
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
  return resolveThemeTokensInternal({
    theme,
    themes,
    defaults,
    path: [],
  });
}


interface ResolveThemeTokensInternalOptions
  extends ResolveThemeTokensOptions {
  path: ThemeName[];
}


function resolveThemeTokensInternal({
  theme,
  themes,
  defaults = {},
  path,
}: ResolveThemeTokensInternalOptions): ThemeTokens {
  const cycleStartIndex =
    path.indexOf(theme.name);


  if (cycleStartIndex >= 0) {
    const cyclePath = [
      ...path.slice(
        cycleStartIndex
      ),

      theme.name,
    ];


    throw new Error(
      `Circular theme inheritance detected: ${cyclePath
        .map(
          (name) =>
            `"${name}"`
        )
        .join(" -> ")}`
    );
  }


  const nextPath = [
    ...path,
    theme.name,
  ];


  const inheritedTokens = theme.extends
    ? resolveParentThemeTokens(
        theme.extends,
        themes,
        defaults,
        nextPath
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
  defaults: ThemeTokens,
  path: ThemeName[]
): ThemeTokens {
  const parent =
    themes.get(parentName);


  if (!parent) {
    throw new Error(
      `Theme "${parentName}" does not exist`
    );
  }


  return resolveThemeTokensInternal({
    theme: parent,
    themes,
    defaults,
    path,
  });
}

