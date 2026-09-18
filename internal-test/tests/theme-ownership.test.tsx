import React from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act } from "react";
import {
  createRoot,
  type Root,
} from "react-dom/client";

import {
  UIThemeProvider,
  createThemeDefinition,
  useUITheme,
} from "../../src/theme";

import type {
  ThemeName,
} from "../../src/theme";


const STORAGE_KEY =
  "zerina-ui-theme-ownership-test";


const themeDark =
  createThemeDefinition({
    name: "ownership-dark",
    source: "custom",

    metadata: {
      label: "Ownership Dark",
      colorScheme: "dark",
    },

    tokens: {
      color: {
        primary: "#111111",
        primaryHover: "#191919",
        primaryContrast: "#ffffff",
      },
    },
  });


const themeWithoutColorScheme =
  createThemeDefinition({
    name:
      "ownership-neutral",

    source:
      "custom",

    extends:
      "ownership-dark",

    metadata: {
      label:
        "Ownership Neutral",
    },

    tokens: {
      color: {
        primary:
          "#222222",

        primaryHover:
          "#292929",

        primaryContrast:
          "#ffffff",
      },
    },
  });


const themeLight =
  createThemeDefinition({
    name: "ownership-light",
    source: "custom",

    metadata: {
      label: "Ownership Light",
      colorScheme: "light",
    },

    tokens: {
      color: {
        primary: "#eeeeee",
        primaryHover: "#dddddd",
        primaryContrast: "#111111",
      },
    },
  });


const themes = [
  themeDark,
  themeWithoutColorScheme,
  themeLight,
] as const;


type ThemeController = {
  setTheme:
  | ((name: ThemeName) => void)
  | null;
};


function ThemeControllerBridge({
  controller,
}: {
  controller: ThemeController;
}) {
  const {
    setTheme,
  } = useUITheme();


  React.useLayoutEffect(() => {
    controller.setTheme =
      setTheme;


    return () => {
      controller.setTheme =
        null;
    };
  }, [
    controller,
    setTheme,
  ]);


  return null;
}


type MountedProvider = {
  container: HTMLDivElement;
  root: Root;
  controller: ThemeController;
};


const mountedProviders:
  MountedProvider[] = [];


function hasInlineProperty(
  property: string
): boolean {
  const style =
    document.documentElement.style;


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


function getValue(
  property: string
): string {
  return document.documentElement
    .style
    .getPropertyValue(
      property
    );
}


function getPriority(
  property: string
): string {
  return document.documentElement
    .style
    .getPropertyPriority(
      property
    );
}


async function mountProvider({
  initialTheme = "ownership-dark",
  persist = false,
  storageKey = STORAGE_KEY,
  strictMode = false,
}: {
  initialTheme?: ThemeName;
  persist?: boolean;
  storageKey?: string;
  strictMode?: boolean;
} = {}): Promise<MountedProvider> {
  const container =
    document.createElement(
      "div"
    );


  document.body.appendChild(
    container
  );


  const root =
    createRoot(
      container
    );


  const controller:
    ThemeController = {
    setTheme: null,
  };


  const provider = (
    <UIThemeProvider
      initialTheme={
        initialTheme
      }
      persist={persist}
      storageKey={
        storageKey
      }
      themes={themes}
    >
      <ThemeControllerBridge
        controller={
          controller
        }
      />

      <div />
    </UIThemeProvider>
  );


  await act(async () => {
    root.render(
      strictMode
        ? (
          <React.StrictMode>
            {provider}
          </React.StrictMode>
        )
        : provider
    );
  });


  const mounted = {
    container,
    root,
    controller,
  };


  mountedProviders.push(
    mounted
  );


  return mounted;
}


async function unmountProvider(
  mounted: MountedProvider
): Promise<void> {
  await act(async () => {
    mounted.root.unmount();
  });


  mounted.container.remove();


  const index =
    mountedProviders.indexOf(
      mounted
    );


  if (index >= 0) {
    mountedProviders.splice(
      index,
      1
    );
  }
}


async function changeTheme(
  mounted: MountedProvider,
  name: ThemeName
): Promise<void> {
  expect(
    mounted.controller.setTheme
  ).not.toBeNull();


  await act(async () => {
    mounted.controller.setTheme?.(
      name
    );
  });
}


function clearDocumentTheme(): void {
  const root =
    document.documentElement;


  const properties = [
    "--ui-primary",
    "--ui-primary-hover",
    "--ui-primary-contrast",
    "color-scheme",
  ];


  for (
    const property of
    properties
  ) {
    root.style.removeProperty(
      property
    );
  }


  delete root.dataset.uiTheme;
}


describe(
  "UIThemeProvider ownership",
  () => {
    beforeEach(() => {
      clearDocumentTheme();

      localStorage.removeItem(
        STORAGE_KEY
      );
    });


    afterEach(async () => {
      for (
        const mounted of [
          ...mountedProviders,
        ].reverse()
      ) {
        try {
          await unmountProvider(
            mounted
          );
        } catch {
          mounted.container.remove();
        }
      }


      mountedProviders.length =
        0;


      clearDocumentTheme();

      localStorage.removeItem(
        STORAGE_KEY
      );


      vi.restoreAllMocks();
    });


    describe(
      "initial mount",
      () => {
        it(
          "applies data-ui-theme, CSS variables and color-scheme",
          async () => {
            await mountProvider();


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "ownership-dark"
            );


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "#111111"
            );


            expect(
              getValue(
                "--ui-primary-hover"
              )
            ).toBe(
              "#191919"
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "dark"
            );
          }
        );
      }
    );


    describe(
      "unmount",
      () => {
        it(
          "restores the previous value, presence and priority",
          async () => {
            document.documentElement.style.setProperty(
              "color-scheme",
              "only light",
              "important",
            );

            const mounted =
              await mountProvider();

            expect(
              getValue("color-scheme"),
            ).toBe("dark");

            await unmountProvider(
              mounted,
            );

            expect(
              hasInlineProperty(
                "color-scheme",
              ),
            ).toBe(true);

            expect(
              getValue(
                "color-scheme",
              ),
            ).toBe("only light");

            expect(
              getPriority(
                "color-scheme",
              ),
            ).toBe("important");
          },
        );


        it(
          "removes properties that did not previously exist",
          async () => {
            expect(
              hasInlineProperty(
                "--ui-primary"
              )
            ).toBe(
              false
            );


            const mounted =
              await mountProvider();


            expect(
              hasInlineProperty(
                "--ui-primary"
              )
            ).toBe(
              true
            );


            await unmountProvider(
              mounted
            );


            expect(
              hasInlineProperty(
                "--ui-primary"
              )
            ).toBe(
              false
            );
          }
        );


        it(
          "restores data-ui-theme when it still matches the provider value",
          async () => {
            document.documentElement
              .dataset
              .uiTheme =
              "external-theme";


            const mounted =
              await mountProvider();


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "ownership-dark"
            );


            await unmountProvider(
              mounted
            );


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "external-theme"
            );
          }
        );


        it(
          "preserves an external data-ui-theme mutation",
          async () => {
            const mounted =
              await mountProvider();


            document.documentElement
              .dataset
              .uiTheme =
              "externally-mutated";


            await unmountProvider(
              mounted
            );


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "externally-mutated"
            );
          }
        );
      }
    );


    describe(
      "theme changes",
      () => {
        it(
          "keeps ownership of a shared property and updates its value",
          async () => {
            const root =
              document.documentElement;


            root.style.setProperty(
              "--ui-primary",
              "external-before-provider"
            );


            const mounted =
              await mountProvider();


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "#111111"
            );


            await changeTheme(
              mounted,
              "ownership-neutral"
            );


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "#222222"
            );


            await unmountProvider(
              mounted
            );


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "external-before-provider"
            );
          }
        );

      }
    );


    describe(
      "external mutations",
      () => {
        it(
          "does not overwrite an externally mutated owned property on unmount",
          async () => {
            const mounted =
              await mountProvider();

            document.documentElement.style.setProperty(
              "--ui-primary",
              "external-mutation",
            );

            await unmountProvider(
              mounted,
            );

            expect(
              getValue(
                "--ui-primary",
              ),
            ).toBe(
              "external-mutation",
            );
          },
        );

        it(
          "updates color-scheme when the resolved theme changes",
          async () => {
            const mounted =
              await mountProvider();


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "dark"
            );


            await changeTheme(
              mounted,
              "ownership-light"
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "light"
            );
          }
        );

      }
    );


    describe(
      "priority",
      () => {
        it(
          "preserves and restores an important declaration",
          async () => {
            document.documentElement
              .style
              .setProperty(
                "color-scheme",
                "only light",
                "important"
              );


            const mounted =
              await mountProvider();


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "dark"
            );


            expect(
              getPriority(
                "color-scheme"
              )
            ).toBe(
              ""
            );


            await unmountProvider(
              mounted
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "only light"
            );


            expect(
              getPriority(
                "color-scheme"
              )
            ).toBe(
              "important"
            );
          }
        );
      }
    );


    describe(
      "color-scheme",
      () => {
        it(
          "updates color-scheme and restores the previous external value on unmount",
          async () => {
            document.documentElement
              .style
              .setProperty(
                "color-scheme",
                "only light",
              );

            const mounted =
              await mountProvider();

            expect(
              getValue(
                "color-scheme",
              ),
            ).toBe(
              "dark",
            );

            await changeTheme(
              mounted,
              "ownership-light",
            );

            expect(
              getValue(
                "color-scheme",
              ),
            ).toBe(
              "light",
            );

            await unmountProvider(
              mounted,
            );

            expect(
              getValue(
                "color-scheme",
              ),
            ).toBe(
              "only light",
            );
          },
        );


        it(
          "preserves an external color-scheme mutation",
          async () => {
            const mounted =
              await mountProvider();


            document.documentElement
              .style
              .setProperty(
                "color-scheme",
                "only dark"
              );


            await unmountProvider(
              mounted
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "only dark"
            );
          }
        );
      }
    );


    describe(
      "React StrictMode",
      () => {
        it(
          "survives mount, cleanup and second mount without losing snapshots",
          async () => {
            const root =
              document.documentElement;


            root.style.setProperty(
              "--ui-primary",
              "strict-external",
            );

            root.style.setProperty(
              "color-scheme",
              "only light",
              "important",
            );


            root.dataset.uiTheme =
              "strict-previous-theme";


            const mounted =
              await mountProvider({
                strictMode: true,
              });


            expect(
              root.dataset.uiTheme
            ).toBe(
              "ownership-dark"
            );


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "#111111"
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "dark"
            );


            await unmountProvider(
              mounted
            );
            expect(
              root.dataset.uiTheme,
            ).toBe(
              "strict-previous-theme",
            );

            expect(
              getValue(
                "--ui-primary",
              ),
            ).toBe(
              "strict-external",
            );

            expect(
              getValue(
                "color-scheme",
              ),
            ).toBe(
              "only light",
            );

            expect(
              getPriority(
                "color-scheme",
              ),
            ).toBe(
              "important",
            );
          }
        );
      }
    );


    describe(
      "provider exclusivity",
      () => {
        it(
          "rejects a nested UIThemeProvider",
          async () => {
            const consoleError =
              vi.spyOn(
                console,
                "error"
              )
                .mockImplementation(
                  () => { }
                );


            const container =
              document.createElement(
                "div"
              );


            document.body.appendChild(
              container
            );


            const root =
              createRoot(
                container
              );


            await expect(
              act(async () => {
                root.render(
                  <UIThemeProvider
                    persist={false}
                    themes={themes}
                    initialTheme="ownership-dark"
                  >
                    <UIThemeProvider
                      persist={false}
                      themes={themes}
                      initialTheme="ownership-light"
                    >
                      <div />
                    </UIThemeProvider>
                  </UIThemeProvider>
                );
              })
            ).rejects.toThrow(
              /cannot be nested/i
            );


            try {
              await act(async () => {
                root.unmount();
              });
            } catch {
              // The failed render may already have
              // discarded the tree.
            }


            container.remove();

            consoleError.mockRestore();
          }
        );


        it(
          "rejects two parallel providers in the same document",
          async () => {
            const first =
              await mountProvider();


            const secondContainer =
              document.createElement(
                "div"
              );


            document.body.appendChild(
              secondContainer
            );


            const secondRoot =
              createRoot(
                secondContainer
              );


            const consoleError =
              vi.spyOn(
                console,
                "error"
              )
                .mockImplementation(
                  () => { }
                );


            await expect(
              act(async () => {
                secondRoot.render(
                  <UIThemeProvider
                    persist={false}
                    themes={themes}
                    initialTheme="ownership-light"
                  >
                    <div />
                  </UIThemeProvider>
                );
              })
            ).rejects.toThrow(
              /only one UIThemeProvider/i
            );


            try {
              await act(async () => {
                secondRoot.unmount();
              });
            } catch {
              // The failed root may already be empty.
            }


            secondContainer.remove();

            consoleError.mockRestore();


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "ownership-dark"
            );


            await unmountProvider(
              first
            );
          }
        );
      }
    );


    describe(
      "persisted theme",
      () => {
        it(
          "applies the active theme restored from localStorage",
          async () => {
            localStorage.setItem(
              STORAGE_KEY,
              "ownership-light"
            );


            const container =
              document.createElement(
                "div"
              );


            document.body.appendChild(
              container
            );


            const root =
              createRoot(
                container
              );


            const controller:
              ThemeController = {
              setTheme: null,
            };


            await act(async () => {
              root.render(
                <UIThemeProvider
                  persist
                  storageKey={
                    STORAGE_KEY
                  }
                  themes={themes}
                >
                  <ThemeControllerBridge
                    controller={
                      controller
                    }
                  />
                </UIThemeProvider>
              );
            });


            const mounted = {
              container,
              root,
              controller,
            };


            mountedProviders.push(
              mounted
            );


            expect(
              document.documentElement
                .dataset
                .uiTheme
            ).toBe(
              "ownership-light"
            );


            expect(
              getValue(
                "--ui-primary"
              )
            ).toBe(
              "#eeeeee"
            );


            expect(
              getValue(
                "color-scheme"
              )
            ).toBe(
              "light"
            );
          }
        );
      }
    );
  }
);