// src/theme/runtime/theme-style-declarations.ts

import type {
  ThemeTokens,
} from "../contracts/theme.types";


export interface ThemeStyleDeclaration {
  property: string;

  value: string;
}


function toCSSVariableSegment(
  value: string
): string {
  return value.replace(
    /[A-Z]/g,
    (character) =>
      `-${character.toLowerCase()}`
  );
}


function pushDeclaration(
  declarations: ThemeStyleDeclaration[],
  name: string,
  value: unknown
): void {
  if (value === undefined) {
    return;
  }

  declarations.push({
    property: `--ui-${name}`,
    value: String(value),
  });
}


export function createThemeStyleDeclarations(
  tokens: ThemeTokens
): readonly ThemeStyleDeclaration[] {
  const declarations:
    ThemeStyleDeclaration[] = [];


  if (tokens.color) {
    pushDeclaration(
      declarations,
      "primary",
      tokens.color.primary
    );

    pushDeclaration(
      declarations,
      "primary-hover",
      tokens.color.primaryHover
    );

    pushDeclaration(
      declarations,
      "primary-contrast",
      tokens.color.primaryContrast
    );

    pushDeclaration(
      declarations,
      "secondary",
      tokens.color.secondary
    );

    pushDeclaration(
      declarations,
      "secondary-hover",
      tokens.color.secondaryHover
    );

    pushDeclaration(
      declarations,
      "secondary-contrast",
      tokens.color.secondaryContrast
    );

    pushDeclaration(
      declarations,
      "success",
      tokens.color.success
    );

    pushDeclaration(
      declarations,
      "success-strong",
      tokens.color.successStrong
    );

    pushDeclaration(
      declarations,
      "success-contrast",
      tokens.color.successContrast
    );

    pushDeclaration(
      declarations,
      "warning",
      tokens.color.warning
    );

    pushDeclaration(
      declarations,
      "warning-strong",
      tokens.color.warningStrong
    );

    pushDeclaration(
      declarations,
      "warning-contrast",
      tokens.color.warningContrast
    );

    pushDeclaration(
      declarations,
      "danger",
      tokens.color.danger
    );

    pushDeclaration(
      declarations,
      "danger-hover",
      tokens.color.dangerHover
    );

    pushDeclaration(
      declarations,
      "danger-contrast",
      tokens.color.dangerContrast
    );
  }


  if (tokens.surface) {
    pushDeclaration(
      declarations,
      "bg",
      tokens.surface.bg
    );

    pushDeclaration(
      declarations,
      "surface",
      tokens.surface.surface
    );

    pushDeclaration(
      declarations,
      "surface-2",
      tokens.surface.surface2
    );

    pushDeclaration(
      declarations,
      "surface-3",
      tokens.surface.surface3
    );

    pushDeclaration(
      declarations,
      "surface-hover",
      tokens.surface.surfaceHover
    );
  }


  if (tokens.text) {
    pushDeclaration(
      declarations,
      "text",
      tokens.text.text
    );

    pushDeclaration(
      declarations,
      "text-muted",
      tokens.text.textMuted
    );

    pushDeclaration(
      declarations,
      "text-soft",
      tokens.text.textSoft
    );

    pushDeclaration(
      declarations,
      "text-inverse",
      tokens.text.textInverse
    );
  }


  if (tokens.border) {
    pushDeclaration(
      declarations,
      "border",
      tokens.border.border
    );

    pushDeclaration(
      declarations,
      "border-strong",
      tokens.border.borderStrong
    );
  }


  if (tokens.radius) {
    for (
      const [
        key,
        value,
      ] of Object.entries(tokens.radius)
    ) {
      pushDeclaration(
        declarations,
        `radius-${key}`,
        value
      );
    }
  }


  if (tokens.shadow) {
    for (
      const [
        key,
        value,
      ] of Object.entries(tokens.shadow)
    ) {
      pushDeclaration(
        declarations,
        `shadow-${toCSSVariableSegment(key)}`,
        value
      );
    }
  }


  if (tokens.typography?.fontSize) {
    for (
      const [
        key,
        value,
      ] of Object.entries(
        tokens.typography.fontSize
      )
    ) {
      pushDeclaration(
        declarations,
        `font-size-${key}`,
        value
      );
    }
  }


  if (tokens.typography?.fontWeight) {
    for (
      const [
        key,
        value,
      ] of Object.entries(
        tokens.typography.fontWeight
      )
    ) {
      pushDeclaration(
        declarations,
        `font-weight-${key}`,
        value
      );
    }
  }


  if (tokens.control?.height) {
    for (
      const [
        key,
        value,
      ] of Object.entries(
        tokens.control.height
      )
    ) {
      pushDeclaration(
        declarations,
        `control-h-${key}`,
        value
      );
    }
  }


  if (tokens.interaction) {
    pushDeclaration(
      declarations,
      "interaction-overlay",
      tokens.interaction.overlay
    );

    pushDeclaration(
      declarations,
      "interaction-focus-ring",
      tokens.interaction.focusRing
    );
  }


  return declarations;
}


export function applyThemeStyleDeclarations(
  root: HTMLElement,
  declarations:
    readonly ThemeStyleDeclaration[]
): void {
  for (const declaration of declarations) {
    root.style.setProperty(
      declaration.property,
      declaration.value
    );
  }
}