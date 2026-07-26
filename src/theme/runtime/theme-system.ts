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
  SYSTEM_DEFAULT_TOKENS,
} from "./system-default-tokens";

import {
  cloneThemeValue,
  deepFreeze,
} from "../internal/theme-object-utils";

import {
  applyThemeStyleDeclarations,
  createThemeStyleDeclarations,
} from "./theme-style-declarations";

export interface ThemeSystemOptions {
  initialTheme?: ThemeName;

  persist?: boolean;

  storageKey?: string;

  themes?: readonly ThemeDefinition[];

  /**
   * Controls whether the constructor may read the persisted theme.
   *
   * Defaults to true for direct ThemeSystem usage.
   * UIThemeProvider disables this during its initial render so
   * the server and the hydrating client select the same theme.
   */
  readStoredThemeOnInit?: boolean;
}

export interface RegisterThemeOptions {
  /**
   * Allows an existing theme definition to be replaced.
   *
   * Defaults to false.
   */
  replace?: boolean;
}



export interface ResolvedTheme {
  name: ThemeName;

  source: ThemeDefinition["source"];

  metadata?: ThemeDefinition["metadata"];

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY = "ui-theme";


function createStoredTheme(
  theme: ThemeDefinition
): ThemeDefinition {
  return deepFreeze(
    cloneThemeValue(theme)
  );
}


function createPublicTheme(
  theme: ThemeDefinition
): ThemeDefinition {
  return cloneThemeValue(theme);
}


export class ThemeSystem {
  private readonly themes =
    new Map<ThemeName, ThemeDefinition>();

  private activeThemeName: ThemeName;

  private readonly hasExplicitInitialTheme: boolean;

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


    if (this.themes.size === 0) {
      throw new Error(
        "ThemeSystem requires at least one registered theme"
      );
    }


    const initialTheme =
      options.initialTheme &&
        this.themes.has(
          options.initialTheme
        )
        ? options.initialTheme
        : undefined;


    this.hasExplicitInitialTheme =
      initialTheme !== undefined;


    const shouldReadStoredTheme =
      options.readStoredThemeOnInit ??
      true;


    const storedTheme =
      !this.hasExplicitInitialTheme &&
        shouldReadStoredTheme
        ? this.getStoredTheme()
        : null;


    const firstTheme =
      this.themes
        .keys()
        .next()
        .value;


    if (!firstTheme) {
      throw new Error(
        "ThemeSystem could not resolve an initial theme"
      );
    }


    this.activeThemeName =
      initialTheme ??
      (
        storedTheme &&
          this.themes.has(storedTheme)
          ? storedTheme
          : undefined
      ) ??
      firstTheme;
  }


  registerTheme(
    theme: ThemeDefinition,
    options: RegisterThemeOptions = {}
  ): void {
    const validation =
      validateThemeDefinition(
        theme
      );


    if (!validation.valid) {
      throw new Error(
        validation.diagnostics
          .map(
            (item) => item.message
          )
          .join("\n")
      );
    }


    const storedTheme =
      createStoredTheme(
        validation.value
      );


    const previousTheme =
      this.themes.get(
        storedTheme.name
      );


    if (
      previousTheme &&
      options.replace !== true
    ) {
      throw new Error(
        `Theme "${storedTheme.name}" is already registered. Pass { replace: true } to replace it.`
      );
    }


    this.themes.set(
      storedTheme.name,
      storedTheme
    );


    try {
      this.validateInheritanceChain(
        storedTheme
      );
    } catch (error) {
      if (previousTheme) {
        this.themes.set(
          storedTheme.name,
          previousTheme
        );
      } else {
        this.themes.delete(
          storedTheme.name
        );
      }


      throw error;
    }
  }


  getThemes(): readonly ThemeDefinition[] {
    return Array.from(
      this.themes.values(),
      createPublicTheme
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


    return createPublicTheme(
      theme
    );
  }


  restoreStoredTheme(): boolean {
    if (
      this.hasExplicitInitialTheme
    ) {
      return false;
    }


    const storedTheme =
      this.getStoredTheme();


    if (
      !storedTheme ||
      !this.themes.has(storedTheme) ||
      storedTheme ===
      this.activeThemeName
    ) {
      return false;
    }


    this.activeThemeName =
      storedTheme;


    return true;
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
      Array.from(
        this.themes.values()
      );


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


    const tokens =
      resolveThemeTokens({
        theme,

        themes: this.themes,

        defaults:
          SYSTEM_DEFAULT_TOKENS,
      });


    return {
      name: theme.name,

      source: theme.source,

      metadata:
        theme.metadata
          ? cloneThemeValue(
            theme.metadata
          )
          : undefined,

      tokens:
        cloneThemeValue(tokens),
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


    applyThemeStyleDeclarations(
      root,
      createThemeStyleDeclarations(
        resolved.tokens
      )
    );


    root.style.colorScheme =
      resolved.metadata?.colorScheme ??
      "";
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

  private getStoredTheme(): ThemeName | null {
    if (
      !this.persist ||

      typeof window === "undefined"
    ) {
      return null;
    }


    try {
      return window.localStorage.getItem(
        this.storageKey
      );
    } catch {
      return null;
    }
  }


  private persistTheme(): void {
    if (
      !this.persist ||

      typeof window === "undefined"
    ) {
      return;
    }


    try {
      window.localStorage.setItem(
        this.storageKey,

        this.activeThemeName
      );
    } catch {
      // Theme persistence is best effort.
    }
  }
}
