// src/theme/runtime/theme-system.ts

import type {
  ThemeColorScheme,
  ThemeDefinition,
  ThemeMetadata,
  ThemeName,
  ThemeTokens,
} from "../contracts/theme.types";

import {
  validateThemeDefinition,
} from "../validation/theme-validation";

import {
  resolveThemeTokens,
} from "./resolve-theme-tokens";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "./system-default-tokens";

import {
  cloneThemeValue,
  deepFreeze,
} from "../internal/theme-object-utils";


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

  metadata:
  ThemeMetadata & {
    colorScheme:
    ThemeColorScheme;
  };

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY =
  "ui-theme";


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
    new Map<
      ThemeName,
      ThemeDefinition
    >();

  private activeThemeName:
    ThemeName;

  private readonly hasExplicitInitialTheme:
    boolean;

  private readonly persist:
    boolean;

  private readonly storageKey:
    string;


  constructor(
    options: ThemeSystemOptions = {}
  ) {
    this.persist =
      options.persist ?? true;

    this.storageKey =
      options.storageKey ??
      DEFAULT_STORAGE_KEY;


    /*
     * Initial themes are stored before validating inheritance.
     * This makes constructor batches independent from declaration order.
     *
     * Public registerTheme() remains strict and validates inheritance
     * immediately.
     */
    for (
      const theme of
      options.themes ?? []
    ) {
      this.registerThemeInternal(
        theme,
        {},
        false
      );
    }


    if (this.themes.size === 0) {
      throw new Error(
        "ThemeSystem requires at least one registered theme"
      );
    }


    /*
     * Validate every inheritance chain only after the complete initial
     * batch has been stored.
     */
    for (
      const theme of
      this.themes.values()
    ) {
      this.validateInheritanceChain(
        theme
      );
    }


    const initialTheme =
      options.initialTheme;


    if (
      initialTheme !== undefined &&
      !this.themes.has(
        initialTheme
      )
    ) {
      throw new Error(
        `Initial theme "${initialTheme}" is not registered`
      );
    }


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
          this.themes.has(
            storedTheme
          )
          ? storedTheme
          : undefined
      ) ??
      firstTheme;
  }


  registerTheme(
    theme: ThemeDefinition,
    options: RegisterThemeOptions = {}
  ): void {
    this.registerThemeInternal(
      theme,
      options,
      true
    );
  }


  getThemes():
    readonly ThemeDefinition[] {
    return Array.from(
      this.themes.values(),
      createPublicTheme
    );
  }


  getActiveTheme():
    ThemeDefinition {
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


  restoreStoredTheme():
    boolean {
    if (
      this.hasExplicitInitialTheme
    ) {
      return false;
    }


    const storedTheme =
      this.getStoredTheme();


    if (
      !storedTheme ||
      !this.themes.has(
        storedTheme
      ) ||
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
    if (
      !this.themes.has(
        name
      )
    ) {
      throw new Error(
        `Theme "${name}" is not registered`
      );
    }


    this.activeThemeName =
      name;

    this.persistTheme();
  }


  /**
   * Activates the next theme using registration order.
   *
   * Constructor themes preserve their array order.
   * Newly registered themes are appended.
   * Replacing an existing theme preserves its current position.
   * Cycling from the final theme wraps to the first.
   */
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
          theme.name ===
          this.activeThemeName
      );


    const nextTheme =
      themes[
      (
        currentIndex + 1
      ) %
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
      this.themes.get(
        name
      );


    if (!theme) {
      throw new Error(
        `Theme "${name}" does not exist`
      );
    }


    const colorScheme =
      this.resolveThemeColorScheme(
        theme
      );


    const tokens =
      resolveThemeTokens({
        theme,

        themes:
          this.themes,

        defaults:
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
          colorScheme
          ],
      });


    return {
      name:
        theme.name,

      source:
        theme.source,

      metadata: {
        ...(
          theme.metadata
            ? cloneThemeValue(
              theme.metadata
            )
            : {}
        ),

        colorScheme,
      },

      tokens:
        cloneThemeValue(
          tokens
        ),
    };
  }


  /**
   * Registers one normalized theme.
   *
   * Constructor batches defer inheritance validation until every theme
   * has been stored. Public registration validates immediately.
   */
  private registerThemeInternal(
    theme: ThemeDefinition,
    options: RegisterThemeOptions,
    validateInheritance:
      boolean
  ): void {
    const validation =
      validateThemeDefinition(
        theme
      );


    if (!validation.valid) {
      throw new Error(
        validation.diagnostics
          .map(
            (item) =>
              item.message
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

    /*
    * Map.set() preserves insertion order when replacing an existing key.
    * This keeps cycleTheme() order stable across theme replacements.
    */
    this.themes.set(
      storedTheme.name,
      storedTheme
    );


    if (!validateInheritance) {
      return;
    }


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


  /**
   * Resolves the nearest explicit color scheme in the inheritance chain.
   *
   * Root themes must establish a scheme. Derived themes may inherit it
   * or replace it with their own explicit value.
   */
  private resolveThemeColorScheme(
    theme: ThemeDefinition,
    visited =
      new Set<ThemeName>()
  ): ThemeColorScheme {
    const explicitColorScheme =
      theme.metadata
        ?.colorScheme;


    if (explicitColorScheme) {
      return explicitColorScheme;
    }


    if (
      visited.has(
        theme.name
      )
    ) {
      throw new Error(
        `Circular theme inheritance detected while resolving colorScheme for "${theme.name}"`
      );
    }


    visited.add(
      theme.name
    );


    if (!theme.extends) {
      throw new Error(
        `Root theme "${theme.name}" must define metadata.colorScheme`
      );
    }


    const parent =
      this.themes.get(
        theme.extends
      );


    if (!parent) {
      throw new Error(
        `Theme "${theme.name}" extends unknown theme "${theme.extends}"`
      );
    }


    return this.resolveThemeColorScheme(
      parent,
      visited
    );
  }


  private validateInheritanceChain(
    theme: ThemeDefinition,
    visited =
      new Set<ThemeName>()
  ): void {
    if (!theme.extends) {
      return;
    }


    if (
      visited.has(
        theme.name
      )
    ) {
      throw new Error(
        `Circular theme inheritance detected: "${theme.name}"`
      );
    }


    visited.add(
      theme.name
    );


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


  private getStoredTheme():
    ThemeName | null {
    if (
      !this.persist ||
      typeof window ===
      "undefined"
    ) {
      return null;
    }


    try {
      return window.localStorage
        .getItem(
          this.storageKey
        );
    } catch {
      return null;
    }
  }


  private persistTheme():
    void {
    if (
      !this.persist ||
      typeof window ===
      "undefined"
    ) {
      return;
    }


    try {
      window.localStorage
        .setItem(
          this.storageKey,
          this.activeThemeName
        );
    } catch {
      // Theme persistence is best effort.
    }
  }
}