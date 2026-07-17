// src/theme/runtime/theme-system.ts

import type {
  ThemeDefinition,
  ThemeTokens,
} from "../contracts/theme.types";

import {
  validateThemeDefinition,
} from "../validation/theme-validation";

import {
  BUILT_IN_THEMES,
} from "../built-in/themes";


export interface ThemeSystemOptions {
  initialTheme?: string;

  persist?: boolean;

  storageKey?: string;
}


export interface ResolvedTheme {
  name: string;

  source: ThemeDefinition["source"];

  metadata?: ThemeDefinition["metadata"];

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY = "ui-theme";


export class ThemeSystem {
  private themes = new Map<string, ThemeDefinition>();

  private activeThemeName: string;

  private readonly persist: boolean;

  private readonly storageKey: string;


  constructor(
    options: ThemeSystemOptions = {}
  ) {
    this.persist = options.persist ?? true;

    this.storageKey =
      options.storageKey ?? DEFAULT_STORAGE_KEY;


    for (const theme of BUILT_IN_THEMES) {
      this.registerTheme(theme);
    }


    this.activeThemeName =
      options.initialTheme ??
      this.getStoredTheme() ??
      BUILT_IN_THEMES[0]?.name ??
      "light";


    this.applyActiveTheme();
  }


  registerTheme(
    theme: ThemeDefinition
  ): void {
    const result =
      validateThemeDefinition(theme);


    if (!result.valid) {
      throw new Error(
        result.diagnostics
          .map((item) => item.message)
          .join("\n")
      );
    }


    this.themes.set(
      theme.name,
      theme
    );
  }


  getThemes(): ThemeDefinition[] {
    return Array.from(
      this.themes.values()
    );
  }


  getActiveTheme(): ThemeDefinition {
    const theme =
      this.themes.get(this.activeThemeName);


    if (!theme) {
      throw new Error(
        `Theme "${this.activeThemeName}" not found`
      );
    }


    return theme;
  }


  setTheme(
    name: string
  ): void {
    if (!this.themes.has(name)) {
      throw new Error(
        `Theme "${name}" is not registered`
      );
    }


    this.activeThemeName = name;

    this.applyActiveTheme();

    this.persistTheme();
  }


  resolveTheme(
    name: string
  ): ResolvedTheme {
    const theme =
      this.themes.get(name);


    if (!theme) {
      throw new Error(
        `Theme "${name}" is not registered`
      );
    }


    return {
      name: theme.name,
      source: theme.source,
      metadata: theme.metadata,
      tokens: this.resolveTokens(theme),
    };
  }


  private resolveTokens(
    theme: ThemeDefinition
  ): ThemeTokens {
    const parentTokens =
      theme.extends
        ? this.resolveTheme(theme.extends).tokens
        : {};


    return {
      ...parentTokens,
      ...theme.tokens,
    };
  }


  private applyActiveTheme(): void {
    if (typeof document === "undefined") {
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


  private applyTokens(
    tokens: ThemeTokens,
    prefix = "ui"
  ): void {
    if (typeof document === "undefined") {
      return;
    }


    const root =
      document.documentElement;


    const flatten =
      (
        value: unknown,
        path: string[] = []
      ): void => {

        if (
          value === null ||
          typeof value !== "object"
        ) {
          root.style.setProperty(
            `--${prefix}-${path.join("-")}`,
            String(value)
          );

          return;
        }


        for (const [
          key,
          child,
        ] of Object.entries(value)) {
          flatten(
            child,
            [...path, key]
          );
        }
      };


    flatten(tokens);
  }


  private getStoredTheme(): string | null {
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