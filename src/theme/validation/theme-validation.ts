// src/theme/validation/theme-validation.ts

import type {
  ThemeDefinition,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
  ThemeSource,
} from "../contracts/theme.types";


const VALID_SOURCES: ThemeSource[] = [
  "builtin",
  "custom",
  "generated",
];


function createDiagnostic(
  level: ThemeValidationDiagnostic["level"],
  code: string,
  message: string,
  path?: string
): ThemeValidationDiagnostic {
  return {
    level,
    code,
    message,
    path,
  };
}


function validateIdentity(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  const diagnostics: ThemeValidationDiagnostic[] = [];

  if (!theme.name || theme.name.trim().length === 0) {
    diagnostics.push(
      createDiagnostic(
        "error",
        "theme.identity.missing",
        "Theme name is required.",
        "name"
      )
    );
  }

  return diagnostics;
}


function validateSource(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  if (!VALID_SOURCES.includes(theme.source)) {
    return [
      createDiagnostic(
        "error",
        "theme.source.invalid",
        `Invalid theme source: ${String(theme.source)}.`,
        "source"
      ),
    ];
  }

  return [];
}


function validateTokens(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  const diagnostics: ThemeValidationDiagnostic[] = [];

  if (!theme.tokens) {
    return diagnostics;
  }

  if (theme.tokens.extensions) {
    diagnostics.push(
      createDiagnostic(
        "warning",
        "theme.tokens.extensions",
        "Theme contains application extension tokens.",
        "tokens.extensions"
      )
    );
  }

  return diagnostics;
}


function validateInheritance(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  const diagnostics: ThemeValidationDiagnostic[] = [];

  /**
   * La existencia del parent y ciclos dependen del registro completo
   * de temas. Eso pertenece a ThemeSystem.
   *
   * Aquí solo validamos la declaración.
   */

  if (theme.extends && theme.extends === theme.name) {
    diagnostics.push(
      createDiagnostic(
        "error",
        "theme.inheritance.self_reference",
        "A theme cannot extend itself.",
        "extends"
      )
    );
  }

  return diagnostics;
}


export function validateThemeDefinition(
  theme: ThemeDefinition
): ThemeValidationResult {
  const diagnostics: ThemeValidationDiagnostic[] = [
    ...validateIdentity(theme),
    ...validateSource(theme),
    ...validateTokens(theme),
    ...validateInheritance(theme),
  ];

  return {
    valid: diagnostics.every(
      (diagnostic) => diagnostic.level !== "error"
    ),
    diagnostics,
  };
}