// src/theme/definitions/theme-definition.ts

import type {
  ThemeDefinition,
  ThemeName,
  ThemeSource,
  ThemeTokens,
  ThemeMetadata,
} from "../contracts/theme.types";


export interface CreateThemeDefinitionInput {
  name: ThemeName;

  source: ThemeSource;

  metadata?: ThemeMetadata;

  extends?: ThemeName;

  tokens?: ThemeTokens;
}


/**
 * Creates a declarative ThemeDefinition entity.
 *
 * This function does not:
 * - validate theme integrity
 * - resolve inheritance
 * - apply CSS variables
 * - activate themes
 */
export function createThemeDefinition(
  input: CreateThemeDefinitionInput
): ThemeDefinition {
  return {
    name: input.name,
    source: input.source,
    metadata: input.metadata,
    extends: input.extends,
    tokens: input.tokens,
  };
}