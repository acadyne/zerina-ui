// src/theme/react/theme.tsx

import React from "react";

import {
  ThemeSystem,
  type ResolvedTheme,
} from "../runtime/theme-system";

import {
  applyThemeStyleDeclarations,
  createThemeStyleDeclarations,
  type StyleDeclaration,
} from "../runtime/theme-style-declarations";

import {
  BUILT_IN_THEMES,
} from "../built-in";

import type {
  ThemeDefinition,
  ThemeName,
} from "../contracts/theme.types";


/**
 * Configuration props are immutable for the provider lifetime.
 *
 * Remount UIThemeProvider to change the theme registry, persistence
 * configuration, storage key, or initial theme.
 */
export interface UIThemeProviderProps {
  children: React.ReactNode;

  initialTheme?: ThemeName;

  persist?: boolean;

  storageKey?: string;

  themes?: readonly ThemeDefinition[];
}


interface UIThemeProviderConfiguration {
  initialTheme?: ThemeName;

  persist: boolean;

  storageKey?: string;

  themes: readonly ThemeDefinition[];
}

interface UIThemeContextValue {
  /**
   * Original registered definition of the active theme.
   */
  theme: ThemeDefinition;

  /**
   * Fully resolved active theme.
   *
   * Includes inherited values, scheme defaults and resolved
   * extension tokens.
   */
  resolvedTheme: ResolvedTheme;

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


type OwnedThemeStyle = {
  previous: ThemeStyleSnapshot;

  written: ThemeStyleSnapshot;
};


type OwnedThemeStyles =
  Map<
    string,
    OwnedThemeStyle
  >;


/**
 * Checks whether an inline CSS declaration is present.
 *
 * Reading only getPropertyValue() is insufficient because an existing
 * declaration may serialize to an empty string.
 */
function hasInlineStyleProperty(
  style: CSSStyleDeclaration,
  property: string
): boolean {
  for (
    let index = 0;
    index < style.length;
    index += 1
  ) {
    if (
      style.item(index) ===
      property
    ) {
      return true;
    }
  }


  return false;
}


/**
 * Captures the complete inline state of one CSS property.
 */
function readStyleSnapshot(
  root: HTMLElement,
  property: string
): ThemeStyleSnapshot {
  return {
    exists:
      hasInlineStyleProperty(
        root.style,
        property
      ),

    value:
      root.style.getPropertyValue(
        property
      ),

    priority:
      root.style.getPropertyPriority(
        property
      ),
  };
}


/**
 * Compares both the value and the structural presence of a declaration.
 */
function styleSnapshotsMatch(
  left: ThemeStyleSnapshot,
  right: ThemeStyleSnapshot
): boolean {
  return (
    left.exists ===
    right.exists &&
    left.value ===
    right.value &&
    left.priority ===
    right.priority
  );
}


/**
 * Restores a previously captured inline declaration.
 */
function restoreStyleSnapshot(
  root: HTMLElement,
  property: string,
  snapshot: ThemeStyleSnapshot
): void {
  if (!snapshot.exists) {
    root.style.removeProperty(
      property
    );

    return;
  }


  root.style.setProperty(
    property,
    snapshot.value,
    snapshot.priority
  );
}


/**
 * Synchronizes the inline properties currently owned by the provider.
 *
 * The order is significant:
 * 1. Release properties absent from the next theme.
 * 2. Capture the DOM before acquiring new properties.
 * 3. Apply the next declarations.
 * 4. Read the browser-serialized values.
 * 5. Update the current ownership map.
 */
function applyOwnedStyleDeclarations(
  root: HTMLElement,
  ownedStyles: OwnedThemeStyles,
  declarations:
    readonly StyleDeclaration[]
): void {
  const nextDeclarations =
    new Map<
      string,
      StyleDeclaration
    >();


  for (const declaration of declarations) {
    nextDeclarations.set(
      declaration.property,
      declaration
    );
  }


  /*
   * Release properties that the next theme no longer declares.
   *
   * The previous value is restored only when the DOM still contains
   * the last value written by this provider. External mutations are
   * preserved.
   */
  for (
    const [
      property,
      ownership,
    ] of Array.from(
      ownedStyles.entries()
    )
  ) {
    if (
      nextDeclarations.has(
        property
      )
    ) {
      continue;
    }


    const current =
      readStyleSnapshot(
        root,
        property
      );


    if (
      styleSnapshotsMatch(
        current,
        ownership.written
      )
    ) {
      restoreStyleSnapshot(
        root,
        property,
        ownership.previous
      );
    }


    ownedStyles.delete(
      property
    );
  }


  /*
   * Capture properties immediately before acquiring them.
   *
   * This also handles properties that were previously released and
   * later acquired again after an external actor modified the DOM.
   */
  const acquiredStyles =
    new Map<
      string,
      ThemeStyleSnapshot
    >();


  for (
    const property of
    nextDeclarations.keys()
  ) {
    if (
      ownedStyles.has(
        property
      )
    ) {
      continue;
    }


    acquiredStyles.set(
      property,
      readStyleSnapshot(
        root,
        property
      )
    );
  }


  applyThemeStyleDeclarations(
    root,
    Array.from(
      nextDeclarations.values()
    )
  );


  /*
   * Read the declarations back from the DOM because the browser may
   * normalize their serialized values.
   */
  for (
    const property of
    nextDeclarations.keys()
  ) {
    const existingOwnership =
      ownedStyles.get(
        property
      );


    const previous =
      existingOwnership?.previous ??
      acquiredStyles.get(
        property
      );


    if (!previous) {
      throw new Error(
        `UIThemeProvider could not acquire inline property "${property}".`
      );
    }


    ownedStyles.set(
      property,
      {
        previous,

        written:
          readStyleSnapshot(
            root,
            property
          ),
      }
    );
  }
}


/**
 * Releases every property currently owned by the provider.
 *
 * A property is restored only when its current DOM value still matches
 * the last value written by the provider.
 */
function releaseOwnedStyleDeclarations(
  root: HTMLElement,
  ownedStyles: OwnedThemeStyles
): void {
  for (
    const [
      property,
      ownership,
    ] of ownedStyles
  ) {
    const current =
      readStyleSnapshot(
        root,
        property
      );


    if (
      styleSnapshotsMatch(
        current,
        ownership.written
      )
    ) {
      restoreStyleSnapshot(
        root,
        property,
        ownership.previous
      );
    }
  }


  ownedStyles.clear();
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

/**
 * Rejects configuration changes that the existing ThemeSystem instance
 * cannot apply safely.
 */
function assertImmutableProviderConfiguration(
  initial:
    UIThemeProviderConfiguration,
  current:
    UIThemeProviderConfiguration
): void {
  const changedProperties:
    string[] = [];


  if (
    initial.initialTheme !==
    current.initialTheme
  ) {
    changedProperties.push(
      "initialTheme"
    );
  }


  if (
    initial.persist !==
    current.persist
  ) {
    changedProperties.push(
      "persist"
    );
  }


  if (
    initial.storageKey !==
    current.storageKey
  ) {
    changedProperties.push(
      "storageKey"
    );
  }


  /*
   * themes is mount-only configuration. Requiring a stable reference
   * avoids silently accepting a registry that ThemeSystem will not use.
   */
  if (
    initial.themes !==
    current.themes
  ) {
    changedProperties.push(
      "themes"
    );
  }


  if (
    changedProperties.length ===
    0
  ) {
    return;
  }


  throw new Error(
    `UIThemeProvider configuration cannot change after mount: ${changedProperties.join(
      ", "
    )}. Remount UIThemeProvider to apply a new configuration.`
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


    const writtenThemeRef =
      React.useRef<
        string | null
      >(null);


    const ownedStylesRef =
      React.useRef<OwnedThemeStyles>(
        new Map()
      );


    const currentConfiguration:
      UIThemeProviderConfiguration = {
      initialTheme,

      persist,

      storageKey,

      themes:
        themes ??
        BUILT_IN_THEMES,
    };


    const initialConfigurationRef =
      React.useRef<
        UIThemeProviderConfiguration | null
      >(null);


    if (
      initialConfigurationRef.current ===
      null
    ) {
      initialConfigurationRef.current =
        currentConfiguration;
    } else {
      assertImmutableProviderConfiguration(
        initialConfigurationRef.current,
        currentConfiguration
      );
    }


    const initialConfiguration =
      initialConfigurationRef.current;


    const systemRef =
      React.useRef<ThemeSystem | null>(
        null
      );


    if (!systemRef.current) {
      systemRef.current =
        new ThemeSystem({
          initialTheme:
            initialConfiguration
              .initialTheme,

          persist:
            initialConfiguration
              .persist,

          storageKey:
            initialConfiguration
              .storageKey,

          themes:
            initialConfiguration
              .themes,

          readStoredThemeOnInit:
            false,
        });
    }


    const system =
      systemRef.current;


    const [
      theme,
      setThemeState,
    ] =
      React.useState<ThemeDefinition>(
        () =>
          system.getActiveTheme()
      );

    const resolvedTheme =
      React.useMemo(
        () =>
          system.resolveTheme(
            theme.name
          ),
        [
          system,
          theme.name,
        ]
      );


    /*
     * This effect owns the document lifecycle.
     *
     * Theme values are applied by the following effect, after this
     * provider has successfully acquired document ownership.
     */
    useIsomorphicLayoutEffect(() => {
      if (
        typeof document ===
        "undefined"
      ) {
        return;
      }


      const activeOwner =
        themeDocumentOwners.get(
          document
        );


      if (
        activeOwner &&
        activeOwner !==
        documentOwner
      ) {
        throw new Error(
          "Only one UIThemeProvider can own the global document theme."
        );
      }


      const root =
        document.documentElement;


      const changed =
        system.restoreStoredTheme();


      themeDocumentOwners.set(
        document,
        documentOwner
      );


      ownedDocumentRef.current =
        document;


      previousThemeRef.current =
        root.dataset.uiTheme ??
        null;


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
          ownedDocumentRef.current
            .documentElement;


        /*
         * data-ui-theme is owned for the complete provider lifetime.
         * An external mutation is preserved when it no longer matches
         * the last value written by this provider.
         */
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


        releaseOwnedStyleDeclarations(
          ownedRoot,
          ownedStylesRef.current
        );


        themeDocumentOwners.delete(
          document
        );


        ownedDocumentRef.current =
          null;


        previousThemeRef.current =
          null;


        writtenThemeRef.current =
          null;
      };
    }, [
      documentOwner,
      system,
    ]);


    /*
     * This effect synchronizes the active theme with the owned document.
     *
     * color-scheme participates in the same ownership mechanism as the
     * generated custom properties.
     */
    useIsomorphicLayoutEffect(() => {
      if (
        typeof document ===
        "undefined"
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


      const activeTheme =
        system.getActiveTheme();


      const {
        resolved,
        declarations,
      } =
        resolveThemeDeclarations(
          system,
          activeTheme.name
        );


      const inlineDeclarations:
        StyleDeclaration[] = [
          ...declarations,
        ];


      if (
        resolved.metadata
          ?.colorScheme
      ) {
        inlineDeclarations.push({
          property:
            "color-scheme",

          value:
            resolved.metadata
              .colorScheme,
        });
      }


      applyOwnedStyleDeclarations(
        root,
        ownedStylesRef.current,
        inlineDeclarations
      );


      root.dataset.uiTheme =
        resolved.name;


      writtenThemeRef.current =
        resolved.name;
    }, [
      documentOwner,
      system,
      theme,
    ]);


    const setTheme =
      React.useCallback(
        (name: ThemeName) => {
          system.setTheme(
            name
          );


          setThemeState(
            system.getActiveTheme()
          );
        },
        [
          system,
        ]
      );


    const cycleTheme =
      React.useCallback(
        () => {
          system.cycleTheme();


          setThemeState(
            system.getActiveTheme()
          );
        },
        [
          system,
        ]
      );


    const value =
      React.useMemo(
        () => ({
          theme,

          resolvedTheme,

          themes:
            system.getThemes(),

          setTheme,

          cycleTheme,
        }),
        [
          theme,
          resolvedTheme,
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