// src/theme/runtime/theme-system.ts

import type {
  ThemeDefinition,
  ThemeTokens,
  ThemeName,
} from "../contracts/theme.types";

import {
  validateThemeDefinition,
} from "../validation/theme-validation";

import {
  resolveThemeTokens,
} from "./resolve-theme-tokens";

import {
  BASE_DARK_TOKENS,
} from "./system-default-tokens";


export interface ThemeSystemOptions {
  initialTheme?: ThemeName;

  persist?: boolean;

  storageKey?: string;

  themes?: ThemeDefinition[];
}


export interface ResolvedTheme {
  name: ThemeName;

  source: ThemeDefinition["source"];

  metadata?: ThemeDefinition["metadata"];

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY = "ui-theme";


export class ThemeSystem {
  private readonly themes =
    new Map<ThemeName, ThemeDefinition>();

  private activeThemeName: ThemeName;

  private readonly persist: boolean;

  private readonly storageKey: string;


  constructor(
    options: ThemeSystemOptions = {}
  ) {
    this.persist =
      options.persist ?? true;

    this.storageKey =
      options.storageKey ??
      DEFAULT_STORAGE_KEY;


    for (const theme of options.themes ?? []) {
      this.registerTheme(theme);
    }


    const storedTheme =
      this.getStoredTheme();


    this.activeThemeName =
      options.initialTheme ??
      (
        storedTheme &&
          this.themes.has(storedTheme)
          ? storedTheme
          : undefined
      ) ??
      this.themes.keys().next().value ??
      "light";
  }


  registerTheme(
    theme: ThemeDefinition
  ): void {
    const validation =
      validateThemeDefinition(theme);


    if (!validation.valid) {
      throw new Error(
        validation.diagnostics
          .map(
            (item) => item.message
          )
          .join("\n")
      );
    }


    const previousTheme =
      this.themes.get(theme.name);


    this.themes.set(
      theme.name,
      theme
    );


    try {
      this.validateInheritanceChain(theme);
    } catch (error) {
      if (previousTheme) {
        this.themes.set(
          theme.name,
          previousTheme
        );
      } else {
        this.themes.delete(
          theme.name
        );
      }

      throw error;
    }
  }


  getThemes(): ThemeDefinition[] {
    return Array.from(
      this.themes.values()
    );
  }


  getActiveTheme(): ThemeDefinition {
    const theme =
      this.themes.get(
        this.activeThemeName
      );


    if (!theme) {
      throw new Error(
        `Theme "${this.activeThemeName}" does not exist`
      );
    }


    return theme;
  }


  setTheme(
    name: ThemeName
  ): void {
    if (!this.themes.has(name)) {
      throw new Error(
        `Theme "${name}" is not registered`
      );
    }


    this.activeThemeName = name;

    this.applyTheme();

    this.persistTheme();
  }


  cycleTheme(): void {
    const themes =
      this.getThemes();


    if (!themes.length) {
      return;
    }


    const currentIndex =
      themes.findIndex(
        (theme) =>
          theme.name === this.activeThemeName
      );


    const nextTheme =
      themes[
      (currentIndex + 1) %
      themes.length
      ];


    if (!nextTheme) {
      return;
    }


    this.setTheme(
      nextTheme.name
    );
  }


  resolveTheme(
    name: ThemeName
  ): ResolvedTheme {
    const theme =
      this.themes.get(name);


    if (!theme) {
      throw new Error(
        `Theme "${name}" does not exist`
      );
    }


    return {
      name: theme.name,

      source: theme.source,

      metadata: theme.metadata,

      tokens: resolveThemeTokens({
        theme,

        themes: this.themes,

        defaults: BASE_DARK_TOKENS,
      }),
    };
  }


  applyTheme(): void {
    if (
      typeof document === "undefined"
    ) {
      return;
    }


    const resolved =
      this.resolveTheme(
        this.activeThemeName
      );


    const root =
      document.documentElement;


    root.dataset.uiTheme =
      resolved.name;


    this.applyTokens(
      resolved.tokens
    );


    if (resolved.metadata?.colorScheme) {
      root.style.colorScheme =
        resolved.metadata.colorScheme;
    }
  }


  private validateInheritanceChain(
    theme: ThemeDefinition,

    visited = new Set<ThemeName>()
  ): void {
    if (!theme.extends) {
      return;
    }


    if (visited.has(theme.name)) {
      throw new Error(
        `Circular theme inheritance detected: "${theme.name}"`
      );
    }


    visited.add(theme.name);


    const parent =
      this.themes.get(
        theme.extends
      );


    if (!parent) {
      throw new Error(
        `Theme "${theme.name}" extends unknown theme "${theme.extends}"`
      );
    }


    this.validateInheritanceChain(
      parent,

      visited
    );
  }


  private applyTokens(
    tokens: ThemeTokens
  ): void {
    if (
      typeof document === "undefined"
    ) {
      return;
    }

    const root =
      document.documentElement;


    const set = (
      name: string,
      value: unknown
    ) => {
      if (value === undefined) {
        return;
      }

      root.style.setProperty(
        `--ui-${name}`,
        String(value)
      );
    };


    if (tokens.color) {
      set(
        "primary",
        tokens.color.primary
      );

      set(
        "primary-hover",
        tokens.color.primaryHover
      );

      set(
        "primary-contrast",
        tokens.color.primaryContrast
      );

      set(
        "secondary",
        tokens.color.secondary
      );

      set(
        "secondary-hover",
        tokens.color.secondaryHover
      );

      set(
        "secondary-contrast",
        tokens.color.secondaryContrast
      );

      set(
        "success",
        tokens.color.success
      );

      set(
        "success-strong",
        tokens.color.successStrong
      );

      set(
        "success-contrast",
        tokens.color.successContrast
      );

      set(
        "warning",
        tokens.color.warning
      );

      set(
        "warning-strong",
        tokens.color.warningStrong
      );

      set(
        "warning-contrast",
        tokens.color.warningContrast
      );

      set(
        "danger",
        tokens.color.danger
      );

      set(
        "danger-hover",
        tokens.color.dangerHover
      );

      set(
        "danger-contrast",
        tokens.color.dangerContrast
      );
    }


    if (tokens.surface) {
      set("bg", tokens.surface.bg);
      set("surface", tokens.surface.surface);
      set("surface-2", tokens.surface.surface2);
      set("surface-3", tokens.surface.surface3);
      set(
        "surface-hover",
        tokens.surface.surfaceHover
      );
    }


    if (tokens.text) {
      set("text", tokens.text.text);
      set("text-muted", tokens.text.textMuted);
      set("text-soft", tokens.text.textSoft);
      set(
        "text-inverse",
        tokens.text.textInverse
      );
    }


    if (tokens.border) {
      set(
        "border",
        tokens.border.border
      );

      set(
        "border-strong",
        tokens.border.borderStrong
      );
    }


    if (tokens.radius) {
      for (const [
        key,
        value,
      ] of Object.entries(tokens.radius)) {
        set(
          `radius-${key}`,
          value
        );
      }
    }


    if (tokens.shadow) {
      for (const [
        key,
        value,
      ] of Object.entries(tokens.shadow)) {
        set(
          `shadow-${key}`,
          value
        );
      }
    }


    if (tokens.interaction) {
      set(
        "overlay",
        tokens.interaction.overlay
      );

      set(
        "focus-ring",
        tokens.interaction.focusRing
      );
    }
  }

  private getStoredTheme(): ThemeName | null {
    if (
      !this.persist ||

      typeof window === "undefined"
    ) {
      return null;
    }


    return window.localStorage.getItem(
      this.storageKey
    );
  }


  private persistTheme(): void {
    if (
      !this.persist ||

      typeof window === "undefined"
    ) {
      return;
    }


    window.localStorage.setItem(
      this.storageKey,

      this.activeThemeName
    );
  }
}