// src/theme/theme.tsx
import React from "react";

export type BuiltInUIThemeMode =
  | "light"
  | "dark"
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "retro-futurist"
  | "sepia-retro";

export type UIThemeMode = BuiltInUIThemeMode | (string & {});

export type UIThemeListMode = "extend" | "replace";

export type UIThemeListConfig =
  | UIThemeMode[]
  | {
      /**
       * extend: AVAILABLE_THEMES + custom
       * replace: solo custom
       *
       * Si no se define, el modo por defecto es "extend".
       */
      mode?: UIThemeListMode;
      custom?: UIThemeMode[];
    };

type SetThemeAction = UIThemeMode | ((prevTheme: UIThemeMode) => UIThemeMode);

type UIThemeContextValue = {
  theme: UIThemeMode;
  themes: UIThemeMode[];
  setTheme: (action: SetThemeAction) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
};

const UIThemeContext = React.createContext<UIThemeContextValue | null>(null);

const STORAGE_KEY = "ui-theme";

export const AVAILABLE_THEMES: BuiltInUIThemeMode[] = [
  "light",
  "dark",
  "spring",
  "summer",
  "autumn",
  "winter",
  "retro-futurist",
  "sepia-retro",
];

function isValidTheme(value: string | null): value is UIThemeMode {
  return typeof value === "string" && value.trim().length > 0;
}

function getInitialTheme(defaultTheme: UIThemeMode = "dark"): UIThemeMode {
  if (typeof window === "undefined") return defaultTheme;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isValidTheme(stored)) return stored;

  return defaultTheme;
}

function getColorScheme(theme: UIThemeMode): "light" | "dark" {
  switch (theme) {
    case "light":
    case "spring":
    case "summer":
      return "light";
    default:
      return "dark";
  }
}

function uniqueThemes(themes: UIThemeMode[]): UIThemeMode[] {
  return Array.from(new Set(themes));
}

export function resolveThemeList(
  config?: UIThemeListConfig
): UIThemeMode[] {
  if (!config) {
    return AVAILABLE_THEMES;
  }

  /**
   * Compatibilidad con la API anterior:
   *
   * themes={["dark", "light", "mi-tema"]}
   *
   * Se interpreta como "replace" porque antes esa lista era la lista completa
   * disponible para cycleTheme().
   */
  if (Array.isArray(config)) {
    return uniqueThemes(config);
  }

  const mode = config.mode ?? "extend";
  const custom = config.custom ?? [];

  if (mode === "replace") {
    return uniqueThemes(custom);
  }

  return uniqueThemes([...AVAILABLE_THEMES, ...custom]);
}

export interface UIThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: UIThemeMode;

  /**
   * Configura los temas disponibles para cycleTheme().
   *
   * Formas soportadas:
   *
   * 1. Sin themes:
   *    usa AVAILABLE_THEMES.
   *
   * 2. Array:
   *    reemplaza la lista completa.
   *
   *    themes={["dark", "light", "mi-tema"]}
   *
   * 3. Objeto con mode: "extend":
   *    AVAILABLE_THEMES + custom.
   *
   *    themes={{
   *      mode: "extend",
   *      custom: ["sinapsis", "paper-ink"]
   *    }}
   *
   * 4. Objeto con mode: "replace":
   *    solo custom.
   *
   *    themes={{
   *      mode: "replace",
   *      custom: ["sinapsis", "paper-ink"]
   *    }}
   */
  themes?: UIThemeListConfig;

  /**
   * Si está en true, ignora localStorage al montar.
   * Útil cuando quieres forzar el defaultTheme en una app.
   */
  ignoreStoredTheme?: boolean;
}

export const UIThemeProvider: React.FC<UIThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
  themes,
  ignoreStoredTheme = false,
}) => {
  const availableThemes = React.useMemo<UIThemeMode[]>(() => {
    return resolveThemeList(themes);
  }, [themes]);

  const [theme, setThemeState] = React.useState<UIThemeMode>(() => {
    if (ignoreStoredTheme) return defaultTheme;
    return getInitialTheme(defaultTheme);
  });

  const setTheme = React.useCallback((action: SetThemeAction) => {
    setThemeState((prevTheme) => {
      const nextTheme =
        typeof action === "function" ? action(prevTheme) : action;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      }

      return nextTheme;
    });
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const cycleTheme = React.useCallback(() => {
    setTheme((prevTheme) => {
      if (!availableThemes.length) {
        return defaultTheme;
      }

      const currentIndex = availableThemes.indexOf(prevTheme);
      const safeIndex = currentIndex >= 0 ? currentIndex : -1;
      const nextIndex = (safeIndex + 1) % availableThemes.length;

      return availableThemes[nextIndex] ?? defaultTheme;
    });
  }, [availableThemes, defaultTheme, setTheme]);

  React.useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-ui-theme", theme);
    root.style.colorScheme = getColorScheme(theme);
  }, [theme]);

  const value = React.useMemo<UIThemeContextValue>(
    () => ({
      theme,
      themes: availableThemes,
      setTheme,
      toggleTheme,
      cycleTheme,
    }),
    [theme, availableThemes, setTheme, toggleTheme, cycleTheme]
  );

  return (
    <UIThemeContext.Provider value={value}>
      {children}
    </UIThemeContext.Provider>
  );
};

export function useUITheme() {
  const ctx = React.useContext(UIThemeContext);

  if (!ctx) {
    throw new Error("useUITheme must be used inside <UIThemeProvider />");
  }

  return ctx;
}