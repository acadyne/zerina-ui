// src/theme/runtime/resolve-theme-tokens.ts

import type {
  ResolvedStandardThemeTokens,
  ThemeTokenManifestBranch,
  ThemeTokenManifestNode,
} from "../contracts/theme-token-contract";

import {
  isThemeTokenDescriptor,
  THEME_TOKEN_MANIFEST,
} from "../contracts/theme-token-contract";

import type {
  ResolvedThemeTokens,
  ThemeDefinition,
  ThemeName,
  ThemeTokens,
} from "../contracts/theme.types";

type TokenRecord =
  Record<string, unknown>;

function readTokenRecord(
  value: unknown,
  path: string
): TokenRecord {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      `Resolved theme token branch "${path}" is missing or invalid.`
    );
  }

  return value as TokenRecord;
}

function mergeStandardTokenBranch(
  manifest:
    ThemeTokenManifestBranch,
  base: TokenRecord,
  override:
    TokenRecord | undefined,
  path: readonly string[]
): TokenRecord {
  const result:
    TokenRecord = {};

  for (
    const [
      key,
      node,
    ] of Object.entries(
      manifest
    ) as Array<
      [
        string,
        ThemeTokenManifestNode,
      ]
    >
  ) {
    const nextPath = [
      ...path,
      key,
    ];

    const baseValue =
      base[key];

    const overrideValue =
      override?.[key];

    if (
      isThemeTokenDescriptor(
        node
      )
    ) {
      const resolvedValue =
        overrideValue !== undefined
          ? overrideValue
          : baseValue;

      if (
        resolvedValue === undefined
      ) {
        throw new Error(
          `Resolved theme token "${nextPath.join(
            "."
          )}" is missing.`
        );
      }

      result[key] =
        resolvedValue;

      continue;
    }

    result[key] =
      mergeStandardTokenBranch(
        node,
        readTokenRecord(
          baseValue,
          nextPath.join(".")
        ),
        overrideValue ===
          undefined
          ? undefined
          : readTokenRecord(
              overrideValue,
              nextPath.join(".")
            ),
        nextPath
      );
  }

  return result;
}

function mergeStandardTokens(
  base: ResolvedThemeTokens,
  override: ThemeTokens
): ResolvedStandardThemeTokens {
  /*
   * Las formas públicas son más específicas que el registro recursivo.
   * El manifiesto gobierna las claves y el walker valida las ramas anidadas.
   */
  return mergeStandardTokenBranch(
    THEME_TOKEN_MANIFEST,
    base as unknown as
      TokenRecord,
    override as unknown as
      TokenRecord,
    []
  ) as ResolvedStandardThemeTokens;
}

function mergeResolvedThemeTokens(
  base: ResolvedThemeTokens,
  override: ThemeTokens
): ResolvedThemeTokens {
  return {
    ...mergeStandardTokens(
      base,
      override
    ),

    extensions: {
      ...base.extensions,
      ...override.extensions,
    },
  };
}

export interface ResolveThemeTokensOptions {
  theme: ThemeDefinition;

  themes:
    ReadonlyMap<
      ThemeName,
      ThemeDefinition
    >;

  defaults:
    ResolvedThemeTokens;
}

export function resolveThemeTokens({
  theme,
  themes,
  defaults,
}: ResolveThemeTokensOptions):
  ResolvedThemeTokens {
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
  defaults,
  path,
}: ResolveThemeTokensInternalOptions):
  ResolvedThemeTokens {
  const cycleStartIndex =
    path.indexOf(
      theme.name
    );

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

  const inheritedTokens =
    theme.extends
      ? resolveParentThemeTokens(
          theme.extends,
          themes,
          defaults,
          nextPath
        )
      : defaults;

  return mergeResolvedThemeTokens(
    inheritedTokens,
    theme.tokens ?? {}
  );
}

function resolveParentThemeTokens(
  parentName: ThemeName,
  themes:
    ReadonlyMap<
      ThemeName,
      ThemeDefinition
    >,
  defaults:
    ResolvedThemeTokens,
  path: ThemeName[]
): ResolvedThemeTokens {
  const parent =
    themes.get(
      parentName
    );

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
