// src/theme/runtime/theme-system.ts

import type {
  ThemeDefinition,
  ThemeTokens,
} from "../contracts/theme.types";

import {
  validateThemeDefinition,
} from "../validation/theme-validation";

import {
  resolveThemeTokens,
} from "./resolve-theme-tokens";

import {
  SYSTEM_DEFAULT_TOKENS,
} from "./system-default-tokens";


export interface ThemeSystemOptions {
  initialTheme?: string;

  persist?: boolean;

  storageKey?: string;

  themes?: ThemeDefinition[];
}


export interface ResolvedTheme {
  name: string;

  source: ThemeDefinition["source"];

  metadata?: ThemeDefinition["metadata"];

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY = "ui-theme";


export class ThemeSystem {
  private readonly themes =
    new Map<string, ThemeDefinition>();

  private activeThemeName: string;

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


    this.activeThemeName =
      options.initialTheme ??
      this.getStoredTheme() ??
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
    name: string
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


    const nextIndex =
      (currentIndex + 1) %
      themes.length;


    const nextTheme =
      themes[nextIndex];


    if (!nextTheme) {
      return;
    }


    this.setTheme(
      nextTheme.name
    );
  }


  resolveTheme(
    name: string
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
        defaults: SYSTEM_DEFAULT_TOKENS,
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
    visited = new Set<string>()
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
    tokens: ThemeTokens,
    path: string[] = []
  ): void {
    if (
      typeof document === "undefined"
    ) {
      return;
    }


    for (const [
      key,
      value,
    ] of Object.entries(tokens)) {
      const nextPath = [
        ...path,
        key,
      ];


      if (
        value !== null &&
        typeof value === "object"
      ) {
        this.applyTokens(
          value as ThemeTokens,
          nextPath
        );

        continue;
      }


      document.documentElement.style.setProperty(
        `--ui-${nextPath.join("-")}`,
        String(value)
      );
    }
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