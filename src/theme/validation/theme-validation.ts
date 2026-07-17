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


const PRIVATE_TOKEN_PREFIXES = [
  "private",
  "internal",
];


const INFRASTRUCTURE_TOKEN_PREFIXES = [
  "layer",
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


function validateInheritance(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  if (!theme.extends) {
    return [];
  }


  if (theme.extends !== theme.name) {
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


function validateTokenKeys(
  value: unknown,
  path: string[] = []
): ThemeValidationDiagnostic[] {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return [];
  }


  const diagnostics: ThemeValidationDiagnostic[] = [];


  for (const [
    key,
    child,
  ] of Object.entries(value)) {
    const nextPath = [
      ...path,
      key,
    ];


    if (
      PRIVATE_TOKEN_PREFIXES.some(
        (prefix) =>
          key.startsWith(prefix)
      )
    ) {
      diagnostics.push(
        createDiagnostic(
          "error",
          "theme.tokens.private",
          "Private tokens cannot be exposed through themes.",
          nextPath.join(".")
        )
      );
    }


    if (
      INFRASTRUCTURE_TOKEN_PREFIXES.some(
        (prefix) =>
          key.startsWith(prefix)
      )
    ) {
      diagnostics.push(
        createDiagnostic(
          "warning",
          "theme.tokens.infrastructure",
          "Infrastructure tokens are not normal theme customization.",
          nextPath.join(".")
        )
      );
    }


    diagnostics.push(
      ...validateTokenKeys(
        child,
        nextPath
      )
    );
  }


  return diagnostics;
}


function validateTokens(
  theme: ThemeDefinition
): ThemeValidationDiagnostic[] {
  if (!theme.tokens) {
    return [];
  }


  const diagnostics =
    validateTokenKeys(
      theme.tokens
    );


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
      (diagnostic) =>
        diagnostic.level !== "error"
    ),

    diagnostics,
  };
}