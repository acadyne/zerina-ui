// src/theme/runtime/theme-style-declarations.ts

import {
  THEME_TOKEN_MANIFEST,
} from "../contracts/theme-token-contract";

import type {
  ResolvedThemeTokens,
  ThemeTokenCSSVariable,
} from "../contracts/theme.types";

export interface StyleDeclaration {
  property: string;

  value: string;

  priority?: string;
}

export interface ThemeStyleDeclaration
  extends StyleDeclaration {
  property:
    ThemeTokenCSSVariable;
}

export type ThemeStyleRecord =
  Readonly<
    Record<
      ThemeTokenCSSVariable,
      string
    >
  >;

interface RuntimeThemeTokenDescriptor {
  readonly kind:
    | "string"
    | "fontWeight";

  readonly cssVariable:
    ThemeTokenCSSVariable;
}

interface RuntimeThemeTokenManifest {
  readonly [key: string]:
    | RuntimeThemeTokenDescriptor
    | RuntimeThemeTokenManifest;
}

type TokenRecord =
  Record<string, unknown>;

/*
 * Runtime view of the canonical manifest.
 *
 * This does not duplicate token paths or CSS variables. It only gives
 * the recursive walker a stable index-signature representation while
 * preserving the exact ThemeTokenCSSVariable union at every leaf.
 */
const RUNTIME_THEME_TOKEN_MANIFEST:
  RuntimeThemeTokenManifest =
    THEME_TOKEN_MANIFEST;

function isRuntimeThemeTokenDescriptor(
  node:
    | RuntimeThemeTokenDescriptor
    | RuntimeThemeTokenManifest
): node is RuntimeThemeTokenDescriptor {
  return (
    "kind" in node &&
    "cssVariable" in node
  );
}

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

function appendThemeStyleDeclarations(
  manifest:
    RuntimeThemeTokenManifest,
  tokens:
    TokenRecord,
  path:
    readonly string[],
  declarations:
    ThemeStyleDeclaration[]
): void {
  for (
    const [
      key,
      node,
    ] of Object.entries(
      manifest
    )
  ) {
    const nextPath = [
      ...path,
      key,
    ];

    const value =
      tokens[key];

    if (
      isRuntimeThemeTokenDescriptor(
        node
      )
    ) {
      if (value === undefined) {
        throw new Error(
          `Resolved theme token "${nextPath.join(
            "."
          )}" is missing.`
        );
      }

      declarations.push({
        property:
          node.cssVariable,

        value:
          String(value),
      });

      continue;
    }

    appendThemeStyleDeclarations(
      node,
      readTokenRecord(
        value,
        nextPath.join(".")
      ),
      nextPath,
      declarations
    );
  }
}

export function createThemeStyleDeclarations(
  tokens:
    ResolvedThemeTokens
): readonly ThemeStyleDeclaration[] {
  const declarations:
    ThemeStyleDeclaration[] = [];

  /*
   * ResolvedThemeTokens es más específico que el registro recursivo interno.
   * El manifiesto controla las claves y readTokenRecord valida cada rama.
   */
  appendThemeStyleDeclarations(
    RUNTIME_THEME_TOKEN_MANIFEST,
    tokens as unknown as
      TokenRecord,
    [],
    declarations
  );

  return declarations;
}

export function createThemeStyleRecord(
  tokens:
    ResolvedThemeTokens
): ThemeStyleRecord {
  const record =
    {} as Record<
      ThemeTokenCSSVariable,
      string
    >;

  for (
    const declaration of
    createThemeStyleDeclarations(
      tokens
    )
  ) {
    record[
      declaration.property
    ] =
      declaration.value;
  }

  return Object.freeze(
    record
  );
}

export function applyThemeStyleDeclarations(
  root: HTMLElement,
  declarations:
    readonly StyleDeclaration[]
): void {
  for (
    const declaration of
    declarations
  ) {
    root.style.setProperty(
      declaration.property,
      declaration.value,
      declaration.priority
    );
  }
}
