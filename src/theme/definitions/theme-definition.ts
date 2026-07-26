// src/theme/definitions/theme-definition.ts

import type {
  ThemeDefinition,
  ThemeName,
  ThemeSource,
  ThemeTokens,
  ThemeMetadata,
} from "../contracts/theme.types";

import {
  validateThemeDefinition,
} from "../validation/theme-validation";

export interface CreateThemeDefinitionInput {
  name: ThemeName;

  source: ThemeSource;

  metadata?: ThemeMetadata;

  extends?: ThemeName;

  tokens?: ThemeTokens;
}

/**
 * Creates a validated, structurally independent ThemeDefinition.
 *
 * This function:
 * - validates the definition structure
 * - normalizes theme data into a new object graph
 *
 * This function does not:
 * - resolve inheritance
 * - verify that an inherited theme is registered
 * - apply CSS variables
 * - activate themes
 */
export function createThemeDefinition(
  input: CreateThemeDefinitionInput
): ThemeDefinition {
  const validation =
    validateThemeDefinition({
      name: input.name,
      source: input.source,
      metadata: input.metadata,
      extends: input.extends,
      tokens: input.tokens,
    });


  if (!validation.valid) {
    throw new Error(
      validation.diagnostics
        .map(
          (diagnostic) =>
            diagnostic.message
        )
        .join("\n")
    );
  }


  return validation.value;
}