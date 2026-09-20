// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BUILT_IN_THEMES,
  ThemeSystem,
  createThemeDocumentState,
} from "../../src/theme";

import {
  createThemeStyleDeclarations,
} from "../../src/theme/runtime/theme-style-declarations";


describe(
  "createThemeDocumentState",
  () => {
    it(
      "works without accessing window, document or localStorage",
      () => {
        const originalWindow =
          Object.getOwnPropertyDescriptor(
            globalThis,
            "window",
          );

        const originalDocument =
          Object.getOwnPropertyDescriptor(
            globalThis,
            "document",
          );

        const originalLocalStorage =
          Object.getOwnPropertyDescriptor(
            globalThis,
            "localStorage",
          );


        const throwOnAccess = (
          name: string,
        ) => ({
          configurable: true,

          get() {
            throw new Error(
              `${name} was accessed`,
            );
          },
        });


        Object.defineProperty(
          globalThis,
          "window",
          throwOnAccess(
            "window",
          ),
        );

        Object.defineProperty(
          globalThis,
          "document",
          throwOnAccess(
            "document",
          ),
        );

        Object.defineProperty(
          globalThis,
          "localStorage",
          throwOnAccess(
            "localStorage",
          ),
        );


        try {
          expect(() =>
            createThemeDocumentState(),
          ).not.toThrow();
        } finally {
          if (originalWindow) {
            Object.defineProperty(
              globalThis,
              "window",
              originalWindow,
            );
          } else {
            delete (
              globalThis as {
                window?: unknown;
              }
            ).window;
          }


          if (originalDocument) {
            Object.defineProperty(
              globalThis,
              "document",
              originalDocument,
            );
          } else {
            delete (
              globalThis as {
                document?: unknown;
              }
            ).document;
          }


          if (originalLocalStorage) {
            Object.defineProperty(
              globalThis,
              "localStorage",
              originalLocalStorage,
            );
          } else {
            delete (
              globalThis as {
                localStorage?: unknown;
              }
            ).localStorage;
          }
        }
      },
    );


    it(
      "selects the first built-in theme by default",
      () => {
        const state =
          createThemeDocumentState();


        expect(
          state.themeName,
        ).toBe(
          "light",
        );


        expect(
          state.colorScheme,
        ).toBe(
          "light",
        );
      },
    );


    it(
      "selects a valid explicit initialTheme",
      () => {
        const state =
          createThemeDocumentState({
            initialTheme:
              "dark",
          });


        expect(
          state.themeName,
        ).toBe(
          "dark",
        );


        expect(
          state.colorScheme,
        ).toBe(
          "dark",
        );
      },
    );


    it(
      "preserves the strict ThemeSystem error for an unknown initialTheme",
      () => {
        expect(() =>
          createThemeDocumentState({
            initialTheme:
              "missing-theme",
          }),
        ).toThrow(
          'Initial theme "missing-theme" is not registered',
        );
      },
    );


    it(
      "contains every custom property generated for the resolved tokens",
      () => {
        const state =
          createThemeDocumentState({
            initialTheme:
              "dark",
          });


        const system =
          new ThemeSystem({
            persist:
              false,

            initialTheme:
              "dark",

            themes:
              BUILT_IN_THEMES,

            readStoredThemeOnInit:
              false,
          });


        const resolved =
          system.resolveTheme(
            "dark",
          );


        const declarations =
          createThemeStyleDeclarations(
            resolved.tokens,
          );


        for (
          const declaration of
          declarations
        ) {
          expect(
            state.style[
            declaration.property
            ],
          ).toBe(
            declaration.value,
          );
        }


        const returnedCustomProperties =
          Object.keys(
            state.style,
          ).filter(
            (
              property,
            ) =>
              property.startsWith(
                "--ui-",
              ),
          );


        expect(
          returnedCustomProperties,
        ).toHaveLength(
          declarations.length,
        );
      },
    );


    it(
      "keeps style.colorScheme and colorScheme aligned with the effective scheme",
      () => {
        const state =
          createThemeDocumentState({
            initialTheme:
              "dark",
          });


        expect(
          state.style.colorScheme,
        ).toBe(
          state.colorScheme,
        );


        expect(
          state.colorScheme,
        ).toBe(
          "dark",
        );
      },
    );


    it(
      "inherits the effective scheme for a derived theme",
      () => {
        const themes = [
          {
            name:
              "ssr-root-dark",

            source:
              "custom" as const,

            metadata: {
              colorScheme:
                "dark" as const,
            },
          },

          {
            name:
              "ssr-child",

            source:
              "custom" as const,

            extends:
              "ssr-root-dark",
          },
        ];


        const state =
          createThemeDocumentState({
            initialTheme:
              "ssr-child",

            themes,
          });


        expect(
          state.themeName,
        ).toBe(
          "ssr-child",
        );


        expect(
          state.colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          state.style.colorScheme,
        ).toBe(
          "dark",
        );
      },
    );


    it(
      "applies scheme defaults to an incomplete custom theme",
      () => {
        const state =
          createThemeDocumentState({
            initialTheme:
              "incomplete-ssr-dark",

            themes: [
              {
                name:
                  "incomplete-ssr-dark",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "dark",
                },

                tokens: {
                  color: {
                    primary:
                      "#123456",
                  },
                },
              },
            ],
          });


        expect(
          state.style[
          "--ui-primary"
          ],
        ).toBe(
          "#123456",
        );


        expect(
          state.style[
          "--ui-surface-canvas"
          ],
        ).toBe(
          "#0b0d10",
        );


        expect(
          state.style[
          "--ui-surface"
          ],
        ).toBe(
          "#111315",
        );


        expect(
          state.style[
          "--ui-text"
          ],
        ).toBe(
          "#f3f4f6",
        );


        expect(
          state.style[
          "--ui-border"
          ],
        ).toBe(
          "rgba(255,255,255,0.12)",
        );
      },
    );


    it(
      "returns frozen state and style objects",
      () => {
        const state =
          createThemeDocumentState();


        expect(
          Object.isFrozen(
            state,
          ),
        ).toBe(
          true,
        );


        expect(
          Object.isFrozen(
            state.style,
          ),
        ).toBe(
          true,
        );
      },
    );
  },
);