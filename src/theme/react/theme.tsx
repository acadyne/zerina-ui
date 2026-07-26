// src/theme/react/theme.tsx

import React from "react";

import {
  ThemeSystem,
} from "../runtime/theme-system";

import {
  applyThemeStyleDeclarations,
  createThemeStyleDeclarations,
} from "../runtime/theme-style-declarations";

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

  themes?: readonly ThemeDefinition[];
}


interface UIThemeContextValue {
  theme: ThemeDefinition;

  themes: readonly ThemeDefinition[];

  setTheme(
    name: ThemeName
  ): void;

  cycleTheme(): void;
}


const UIThemeContext =
  React.createContext<UIThemeContextValue | null>(
    null
  );


const themeDocumentOwners =
  new WeakMap<Document, symbol>();


const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect;


type ThemeStyleSnapshot = {
  exists: boolean;

  value: string;

  priority: string;
};


type ThemeStyleSnapshots =
  Map<
    string,
    ThemeStyleSnapshot
  >;


function readStyleSnapshots(
  root: HTMLElement,
  properties: readonly string[]
): ThemeStyleSnapshots {
  const snapshots =
    new Map<
      string,
      ThemeStyleSnapshot
    >();


  for (const property of properties) {
    snapshots.set(
      property,
      {
        exists:
          root.style.getPropertyValue(
            property
          ) !== "",

        value:
          root.style.getPropertyValue(
            property
          ),

        priority:
          root.style.getPropertyPriority(
            property
          ),
      }
    );
  }


  return snapshots;
}

function createWrittenStyleSnapshots(
  declarations:
    readonly {
      property: string;

      value: string;

      priority?: string;
    }[]
): ThemeStyleSnapshots {
  const snapshots =
    new Map<
      string,
      ThemeStyleSnapshot
    >();


  for (const declaration of declarations) {
    snapshots.set(
      declaration.property,
      {
        exists:
          true,

        value:
          declaration.value,

        priority:
          declaration.priority ??
          "",
      }
    );
  }


  return snapshots;
}

function mergeStyleSnapshots(
  target: ThemeStyleSnapshots,
  source: ThemeStyleSnapshots
): ThemeStyleSnapshots {
  const merged =
    new Map(
      target
    );


  for (
    const [
      property,
      snapshot,
    ] of source
  ) {
    merged.set(
      property,
      snapshot
    );
  }


  return merged;
}

function removeMissingStyleSnapshots(
  root: HTMLElement,
  previous: ThemeStyleSnapshots,
  next: ThemeStyleSnapshots
): void {
  for (
    const [
      property,
      previousValue,
    ] of previous
  ) {
    if (
      next.has(property)
    ) {
      continue;
    }


    const currentValue =
      root.style.getPropertyValue(
        property
      );

    const currentPriority =
      root.style.getPropertyPriority(
        property
      );


    const currentExists =
      currentValue !== "";


    if (
      currentExists !==
      previousValue.exists ||
      currentValue !==
      previousValue.value ||
      currentPriority !==
      previousValue.priority
    ) {
      continue;
    }


    root.style.removeProperty(
      property
    );
  }
}

function restoreStyleSnapshots(
  root: HTMLElement,
  previous: ThemeStyleSnapshots,
  written: ThemeStyleSnapshots
): void {
  for (
    const [
      property,
      writtenValue,
    ] of written
  ) {
    const currentValue =
      root.style.getPropertyValue(
        property
      );

    const currentPriority =
      root.style.getPropertyPriority(
        property
      );

    const currentExists =
      currentValue !== "";


    if (
      currentExists !==
      writtenValue.exists ||
      currentValue !==
      writtenValue.value ||
      currentPriority !==
      writtenValue.priority
    ) {
      continue;
    }


    const previousValue =
      previous.get(property);


    if (
      !previousValue ||
      !previousValue.exists
    ) {
      root.style.removeProperty(
        property
      );

      continue;
    }


    root.style.setProperty(
      property,
      previousValue.value,
      previousValue.priority
    );
  }
}


function resolveThemeDeclarations(
  system: ThemeSystem,
  name: ThemeName
) {
  const resolved =
    system.resolveTheme(
      name
    );


  const declarations =
    createThemeStyleDeclarations(
      resolved.tokens
    );


  return {
    resolved,
    declarations,
  };
}

function getThemeOwnedProperties(
  system: ThemeSystem
): readonly string[] {
  const properties =
    new Set<string>();


  for (
    const theme of system.getThemes()
  ) {
    const {
      declarations,
    } =
      resolveThemeDeclarations(
        system,
        theme.name
      );


    for (
      const declaration of declarations
    ) {
      properties.add(
        declaration.property
      );
    }
  }


  return Array.from(
    properties
  );
}

export const UIThemeProvider: React.FC<
  UIThemeProviderProps
> = ({
  children,
  initialTheme,
  persist = true,
  storageKey,
  themes,
}) => {
    const parentThemeContext =
      React.useContext(
        UIThemeContext
      );


    if (parentThemeContext) {
      throw new Error(
        "UIThemeProvider cannot be nested because it owns the global document theme."
      );
    }


    const [documentOwner] =
      React.useState(
        () =>
          Symbol(
            "UIThemeProvider"
          )
      );


    const ownedDocumentRef =
      React.useRef<Document | null>(
        null
      );


    const previousThemeRef =
      React.useRef<
        string | null
      >(null);


    const previousColorSchemeRef =
      React.useRef<
        ThemeStyleSnapshot | null
      >(null);


    const previousStylesRef =
      React.useRef<
        ThemeStyleSnapshots | null
      >(null);


    const writtenThemeRef =
      React.useRef<
        string | null
      >(null);


    const writtenColorSchemeRef =
      React.useRef<
        ThemeStyleSnapshot | null
      >(null);

    // All CSS properties written by this provider
    // during its lifetime.
    const ownedStylesRef =
      React.useRef<
        ThemeStyleSnapshots | null
      >(null);

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

          readStoredThemeOnInit:
            false,
        });
    }


    const system =
      systemRef.current;


    const [theme, setThemeState] =
      React.useState<ThemeDefinition>(
        () =>
          system.getActiveTheme()
      );


    useIsomorphicLayoutEffect(() => {
      if (
        typeof document === "undefined"
      ) {
        return;
      }


      const activeOwner =
        themeDocumentOwners.get(
          document
        );


      if (
        activeOwner &&
        activeOwner !== documentOwner
      ) {
        throw new Error(
          "Only one UIThemeProvider can own the global document theme."
        );
      }


      const root =
        document.documentElement;


      const changed =
        system.restoreStoredTheme();


      // Initial snapshot only.
      // Properties introduced by later theme changes
      // are captured before application.
      const properties =
        getThemeOwnedProperties(
          system
        );


      themeDocumentOwners.set(
        document,
        documentOwner
      );


      ownedDocumentRef.current =
        document;


      previousThemeRef.current =
        root.dataset.uiTheme ??
        null;


      previousColorSchemeRef.current =
      {
        exists:
          root.style.getPropertyValue(
            "color-scheme"
          ) !== "",

        value:
          root.style.getPropertyValue(
            "color-scheme"
          ),

        priority:
          root.style.getPropertyPriority(
            "color-scheme"
          ),
      };


      previousStylesRef.current =
        readStyleSnapshots(
          root,
          properties
        );


      if (changed) {
        setThemeState(
          system.getActiveTheme()
        );
      }


      return () => {
        if (
          !ownedDocumentRef.current ||
          themeDocumentOwners.get(
            document
          ) !== documentOwner
        ) {
          return;
        }


        const ownedRoot =
          document.documentElement;


        if (
          ownedRoot.dataset.uiTheme ===
          writtenThemeRef.current
        ) {
          if (
            previousThemeRef.current ===
            null
          ) {
            delete ownedRoot.dataset.uiTheme;
          } else {
            ownedRoot.dataset.uiTheme =
              previousThemeRef.current;
          }
        }


        const currentColorScheme =
        {
          exists:
            ownedRoot.style.getPropertyValue(
              "color-scheme"
            ) !== "",

          value:
            ownedRoot.style.getPropertyValue(
              "color-scheme"
            ),

          priority:
            ownedRoot.style.getPropertyPriority(
              "color-scheme"
            ),
        };


        if (
          writtenColorSchemeRef.current &&
          currentColorScheme.exists ===
          writtenColorSchemeRef.current.exists &&
          currentColorScheme.value ===
          writtenColorSchemeRef.current.value &&
          currentColorScheme.priority ===
          writtenColorSchemeRef.current.priority
        ) {
          const previous =
            previousColorSchemeRef.current;


          if (
            previous &&
            previous.exists
          ) {
            ownedRoot.style.setProperty(
              "color-scheme",
              previous.value,
              previous.priority
            );
          } else {
            ownedRoot.style.removeProperty(
              "color-scheme"
            );
          }
        }


        if (
          previousStylesRef.current &&
          ownedStylesRef.current
        ) {
          restoreStyleSnapshots(
            ownedRoot,
            previousStylesRef.current,
            ownedStylesRef.current
          );
        }


        themeDocumentOwners.delete(
          document
        );


        ownedDocumentRef.current =
          null;


        previousThemeRef.current =
          null;

        previousColorSchemeRef.current =
          null;

        previousStylesRef.current =
          null;

        writtenThemeRef.current =
          null;

        writtenColorSchemeRef.current =
          null;

        ownedStylesRef.current =
          null;
      };
    }, [
      documentOwner,
      system,
    ]);


    useIsomorphicLayoutEffect(() => {
      if (
        typeof document === "undefined"
      ) {
        return;
      }


      if (
        themeDocumentOwners.get(
          document
        ) !== documentOwner
      ) {
        return;
      }


      const root =
        document.documentElement;


      const {
        resolved,
        declarations,
      } =
        resolveThemeDeclarations(
          system,
          theme.name
        );


      const nextWrittenStyles =
        createWrittenStyleSnapshots(
          declarations
        );


      if (
        previousStylesRef.current
      ) {
        for (
          const property of nextWrittenStyles.keys()
        ) {
          if (
            previousStylesRef.current.has(
              property
            )
          ) {
            continue;
          }


          const snapshot =
            readStyleSnapshots(
              root,
              [
                property,
              ]
            ).get(
              property
            );


          if (snapshot) {
            previousStylesRef.current.set(
              property,
              snapshot
            );
          }
        }
      }

      applyThemeStyleDeclarations(
        root,
        declarations
      );


      root.dataset.uiTheme =
        resolved.name;


      if (
        resolved.metadata?.colorScheme
      ) {
        root.style.setProperty(
          "color-scheme",
          resolved.metadata.colorScheme
        );
      } else {
        root.style.removeProperty(
          "color-scheme"
        );
      }


      writtenThemeRef.current =
        resolved.name;


      writtenColorSchemeRef.current =
      {
        exists:
          resolved.metadata?.colorScheme !==
          undefined,

        value:
          resolved.metadata?.colorScheme ??
          "",

        priority:
          "",
      };

      if (
        ownedStylesRef.current
      ) {
        removeMissingStyleSnapshots(
          root,
          ownedStylesRef.current,
          nextWrittenStyles
        );
      }


      ownedStylesRef.current =
        mergeStyleSnapshots(
          ownedStylesRef.current ??
          new Map<
            string,
            ThemeStyleSnapshot
          >(),

          nextWrittenStyles
        );
    }, [
      documentOwner,
      system,
      theme,
    ]);


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