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


export interface ResolvedTheme {
  name: ThemeName;

  source: ThemeDefinition["source"];

  metadata?: ThemeDefinition["metadata"];

  tokens: ThemeTokens;
}


const DEFAULT_STORAGE_KEY = "ui-theme";


function cloneValue<T>(
  value: T,
  seen = new WeakMap<object, unknown>()
): T {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }


  const existingClone =
    seen.get(value);


  if (existingClone) {
    return existingClone as T;
  }


  if (value instanceof Date) {
    return new Date(
      value.getTime()
    ) as T;
  }


  if (Array.isArray(value)) {
    const clone: unknown[] = [];


    seen.set(
      value,
      clone
    );


    for (const item of value) {
      clone.push(
        cloneValue(
          item,
          seen
        )
      );
    }


    return clone as T;
  }


  const clone =
    Object.create(
      Object.getPrototypeOf(value)
    ) as object;


  seen.set(
    value,
    clone
  );


  for (
    const key of Reflect.ownKeys(value)
  ) {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );


    if (!descriptor) {
      continue;
    }


    if ("value" in descriptor) {
      Object.defineProperty(
        clone,
        key,
        {
          value: cloneValue(
            descriptor.value,
            seen
          ),

          enumerable:
            descriptor.enumerable,

          writable: true,

          configurable: true,
        }
      );

      continue;
    }


    Object.defineProperty(
      clone,
      key,
      {
        ...descriptor,

        configurable: true,
      }
    );
  }


  return clone as T;
}


function createStoredTheme(
  theme: ThemeDefinition
): ThemeDefinition {
  return deepFreeze(
    cloneValue(theme)
  );
}


function createPublicTheme(
  theme: ThemeDefinition
): ThemeDefinition {
  return cloneValue(theme);
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
    theme: ThemeDefinition
  ): void {
    const storedTheme =
      createStoredTheme(theme);


    const validation =
      validateThemeDefinition(
        storedTheme
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


    const previousTheme =
      this.themes.get(
        storedTheme.name
      );


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


    if (tokens.typography?.fontSize) {
      for (const [
        key,
        value,
      ] of Object.entries(
        tokens.typography.fontSize
      )) {
        set(
          `font-size-${key}`,
          value
        );
      }
    }


    if (tokens.typography?.fontWeight) {
      for (const [
        key,
        value,
      ] of Object.entries(
        tokens.typography.fontWeight
      )) {
        set(
          `font-weight-${key}`,
          value
        );
      }
    }


    if (tokens.control?.height) {
      for (const [
        key,
        value,
      ] of Object.entries(
        tokens.control.height
      )) {
        set(
          `control-h-${key}`,
          value
        );
      }
    }


    if (tokens.interaction) {
      set(
        "interaction-overlay",
        tokens.interaction.overlay
      );

      set(
        "interaction-focus-ring",
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
