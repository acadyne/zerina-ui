import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  act,
} from "react";

import {
  hydrateRoot,
  type Root,
} from "react-dom/client";

import {
  renderToString,
} from "react-dom/server";

import {
  BUILT_IN_THEMES,
  UIThemeProvider,
  useUITheme,
} from "../../src/theme";

import type {
  ThemeName,
} from "../../src/theme";


const STORAGE_KEY =
  "theme-ssr-hydration-test";


const mountedRoots:
  Root[] = [];


function ThemeProbe() {
  const {
    theme,
  } = useUITheme();


  return (
    <div
      data-testid="active-theme"
    >
      {theme.name}
    </div>
  );
}


function ThemeTree({
  initialTheme,
  persist = false,
}: {
  initialTheme?:
    ThemeName;

  persist?:
    boolean;
}) {
  return (
    <UIThemeProvider
      initialTheme={
        initialTheme
      }
      persist={
        persist
      }
      storageKey={
        STORAGE_KEY
      }
      themes={
        BUILT_IN_THEMES
      }
    >
      <ThemeProbe />
    </UIThemeProvider>
  );
}


function getHydrationWarnings(
  calls:
    readonly unknown[][],
): string[] {
  return calls
    .map(
      (
        call,
      ) =>
        call
          .map(
            String,
          )
          .join(
            " ",
          ),
    )
    .filter(
      (
        message,
      ) =>
        /hydration failed|error while hydrating|did not match|server html|text content does not match|hydration mismatch|switched to client rendering/i.test(
          message,
        ),
    );
}


function clearThemeDocument():
  void {
  const root =
    document.documentElement;


  for (
    let index =
      root.style.length - 1;

    index >= 0;

    index -= 1
  ) {
    const property =
      root.style.item(
        index,
      );


    if (
      property ===
        "color-scheme" ||
      property.startsWith(
        "--ui-",
      )
    ) {
      root.style.removeProperty(
        property,
      );
    }
  }


  delete root.dataset.uiTheme;

  localStorage.removeItem(
    STORAGE_KEY,
  );
}


afterEach(async () => {
  for (
    const root of
    mountedRoots.splice(
      0,
    )
  ) {
    await act(async () => {
      root.unmount();
    });
  }


  document.body.innerHTML =
    "";

  clearThemeDocument();

  vi.restoreAllMocks();
});


describe(
  "UIThemeProvider hydration",
  () => {
    it(
      "uses the same explicit initialTheme on the server and first client render",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          )
            .mockImplementation(
              () => {},
            );


        const serverHtml =
          renderToString(
            <ThemeTree
              initialTheme="dark"
            />,
          );


        expect(
          serverHtml,
        ).toContain(
          "dark",
        );


        /*
         * This suite runs in jsdom. The theme module was imported while
         * window existed, so renderToString() can emit React's generic
         * useLayoutEffect SSR warning.
         *
         * Real Node rendering is covered separately by
         * theme-provider-server-render.test.tsx.
         */
        consoleError.mockClear();


        const container =
          document.createElement(
            "div",
          );


        container.innerHTML =
          serverHtml;

        document.body.appendChild(
          container,
        );


        const recoverableErrors:
          unknown[] = [];


        await act(async () => {
          const root =
            hydrateRoot(
              container,
              <ThemeTree
                initialTheme="dark"
              />,
              {
                onRecoverableError(
                  error,
                ) {
                  recoverableErrors.push(
                    error,
                  );
                },
              },
            );


          mountedRoots.push(
            root,
          );
        });


        expect(
          container.textContent,
        ).toBe(
          "dark",
        );


        expect(
          document.documentElement
            .dataset
            .uiTheme,
        ).toBe(
          "dark",
        );


        expect(
          recoverableErrors,
        ).toEqual(
          [],
        );


        expect(
          getHydrationWarnings(
            consoleError.mock.calls,
          ),
        ).toEqual(
          [],
        );
      },
    );


    it(
      "restores a persisted theme after hydration without hydration warnings",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          )
            .mockImplementation(
              () => {},
            );


        /*
         * Without an explicit initialTheme, the server and the first
         * client render deterministically select the first built-in:
         * light.
         */
        const serverHtml =
          renderToString(
            <ThemeTree
              persist
            />,
          );


        expect(
          serverHtml,
        ).toContain(
          "light",
        );


        /*
         * Discard jsdom-only warnings emitted during renderToString().
         * From this point onward, only hydration output is evaluated.
         */
        consoleError.mockClear();


        localStorage.setItem(
          STORAGE_KEY,
          "dark",
        );


        const container =
          document.createElement(
            "div",
          );


        container.innerHTML =
          serverHtml;

        document.body.appendChild(
          container,
        );


        const recoverableErrors:
          unknown[] = [];


        await act(async () => {
          const root =
            hydrateRoot(
              container,
              <ThemeTree
                persist
              />,
              {
                onRecoverableError(
                  error,
                ) {
                  recoverableErrors.push(
                    error,
                  );
                },
              },
            );


          mountedRoots.push(
            root,
          );
        });


        /*
         * Hydration begins from light, matching the server HTML.
         * After mounting, the provider restores dark from localStorage.
         */
        expect(
          container.textContent,
        ).toBe(
          "dark",
        );


        expect(
          document.documentElement
            .dataset
            .uiTheme,
        ).toBe(
          "dark",
        );


        expect(
          document.documentElement
            .style
            .getPropertyValue(
              "color-scheme",
            ),
        ).toBe(
          "dark",
        );


        expect(
          localStorage.getItem(
            STORAGE_KEY,
          ),
        ).toBe(
          "dark",
        );


        expect(
          recoverableErrors,
        ).toEqual(
          [],
        );


        expect(
          getHydrationWarnings(
            consoleError.mock.calls,
          ),
        ).toEqual(
          [],
        );
      },
    );
  },
);