// src/theme/react/theme.tsx

import React from "react";

import {
  ThemeSystem,
} from "../runtime/theme-system";

import {
  BUILT_IN_THEMES,
} from "../built-in";

import type {
  ThemeDefinition,
} from "../contracts/theme.types";


export interface UIThemeProviderProps {
  children: React.ReactNode;

  initialTheme?: string;

  persist?: boolean;

  storageKey?: string;

  themes?: ThemeDefinition[];
}


interface UIThemeContextValue {
  theme: ThemeDefinition;

  themes: ThemeDefinition[];

  setTheme(
    name: string
  ): void;

  cycleTheme(): void;
}


const UIThemeContext =
  React.createContext<UIThemeContextValue | null>(
    null
  );


export const UIThemeProvider: React.FC<
  UIThemeProviderProps
> = ({
  children,
  initialTheme,
  persist = true,
  storageKey,
  themes,
}) => {
  const system =
    React.useMemo(
      () =>
        new ThemeSystem({
          initialTheme,
          persist,
          storageKey,
          themes:
            themes ??
            BUILT_IN_THEMES,
        }),
      [
        initialTheme,
        persist,
        storageKey,
        themes,
      ]
    );


  const [theme, setThemeState] =
    React.useState(
      () => system.getActiveTheme()
    );


  React.useEffect(() => {
    system.applyTheme();

    setThemeState(
      system.getActiveTheme()
    );
  }, [system]);


  const setTheme =
    React.useCallback(
      (name: string) => {
        system.setTheme(name);

        setThemeState(
          system.getActiveTheme()
        );
      },
      [system]
    );


  const cycleTheme =
    React.useCallback(
      () => {
        system.cycleTheme();

        setThemeState(
          system.getActiveTheme()
        );
      },
      [system]
    );


  const value =
    React.useMemo(
      () => ({
        theme,
        themes: system.getThemes(),
        setTheme,
        cycleTheme,
      }),
      [
        theme,
        system,
        setTheme,
        cycleTheme,
      ]
    );


  return (
    <UIThemeContext.Provider
      value={value}
    >
      {children}
    </UIThemeContext.Provider>
  );
};


export function useUITheme() {
  const context =
    React.useContext(
      UIThemeContext
    );


  if (!context) {
    throw new Error(
      "useUITheme must be used inside <UIThemeProvider />"
    );
  }


  return context;
}