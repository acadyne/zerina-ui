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
  if (
    theme.name &&
    theme.name.trim().length > 0
  ) {
    return [];
  }


  return [
    createDiagnostic(
      "error",
      "theme.identity.missing",
      "Theme name is required.",
      "name"
    ),
  ];
}


function validateSource(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  if (
    VALID_SOURCES.includes(theme.source)
  ) {
    return [];
  }


  return [
    createDiagnostic(
      "error",
      "theme.source.invalid",
      `Invalid theme source: ${String(theme.source)}.`,
      "source"
    ),
  ];
}

function validateMetadata(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  const icon =
    theme.metadata?.icon;

  if (
    icon === undefined ||
    icon.trim().length > 0
  ) {
    return [];
  }

  return [
    createDiagnostic(
      "error",
      "theme.metadata.icon.empty",
      "Theme icon name cannot be empty.",
      "metadata.icon"
    ),
  ];
}


function validateInheritance(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  if (
    !theme.extends ||
    theme.extends !== theme.name
  ) {
    return [];
  }


  return [
    createDiagnostic(
      "error",
      "theme.inheritance.self_reference",
      "A theme cannot extend itself.",
      "extends"
    ),
  ];
}


export function validateThemeDefinition(
  theme: ThemeDefinition
): ThemeValidationResult {
  const diagnostics = [
    ...validateIdentity(theme),
    ...validateSource(theme),
    ...validateInheritance(theme),
    ...validateMetadata(theme),
  ];


  return {
    valid: diagnostics.every(
      (diagnostic) =>
        diagnostic.level !== "error"
    ),

    diagnostics,
  };
}