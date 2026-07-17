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


  React.useEffect(() => {
    system.applyTheme();
  }, [system]);


  const [activeTheme, setActiveTheme] =
    React.useState(
      () => system.getActiveTheme()
    );


  const setTheme = React.useCallback(
    (name: string) => {
      system.setTheme(name);

      setActiveTheme(
        system.getActiveTheme()
      );
    },
    [system]
  );


  const value =
    React.useMemo(
      () => ({
        theme: activeTheme,

        themes:
          system.getThemes(),

        setTheme,
      }),
      [
        activeTheme,
        system,
        setTheme,
      ]
    );


  return (
    <UIThemeContext.Provider value={value}>
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