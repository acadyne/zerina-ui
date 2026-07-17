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
  ThemeName,
} from "../contracts/theme.types";


export interface UIThemeProviderProps {
  children: React.ReactNode;

  initialTheme?: ThemeName;

  persist?: boolean;

  storageKey?: string;

  themes?: ThemeDefinition[];
}


interface UIThemeContextValue {
  theme: ThemeDefinition;

  themes: ThemeDefinition[];

  setTheme(
    name: ThemeName
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
  const systemRef =
    React.useRef<ThemeSystem | null>(null);


  if (!systemRef.current) {
    systemRef.current =
      new ThemeSystem({
        initialTheme,
        persist,
        storageKey,
        themes:
          themes ??
          BUILT_IN_THEMES,
      });
  }


  const system =
    systemRef.current;


  const [theme, setThemeState] =
    React.useState<ThemeDefinition>(
      () =>
        system.getActiveTheme()
    );


  React.useEffect(() => {
    system.applyTheme();

    setThemeState(
      system.getActiveTheme()
    );
  }, [system]);


  const setTheme =
    React.useCallback(
      (name: ThemeName) => {
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

        themes:
          system.getThemes(),

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