import React from "react";
import {
  afterEach,
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


const lightTheme =
  createThemeDefinition({
    name:
      "provider-config-light",

    source:
      "custom",

    metadata: {
      label:
        "Provider Config Light",

      colorScheme:
        "light",
    },

    tokens: {
      color: {
        primary:
          "#111111",
      },
    },
  });


const darkTheme =
  createThemeDefinition({
    name:
      "provider-config-dark",

    source:
      "custom",

    metadata: {
      label:
        "Provider Config Dark",

      colorScheme:
        "dark",
    },

    tokens: {
      color: {
        primary:
          "#eeeeee",
      },
    },
  });


const THEMES = [
  lightTheme,
  darkTheme,
] as const;


const STORAGE_KEY =
  "provider-configuration-test";


type ThemeController = {
  activeTheme:
    ThemeName | null;

  setTheme:
    | ((name: ThemeName) => void)
    | null;

  cycleTheme:
    (() => void)
    | null;
};


function Controller({
  controller,
}: {
  controller:
    ThemeController;
}) {
  const {
    theme,
    setTheme,
    cycleTheme,
  } = useUITheme();


  React.useLayoutEffect(() => {
    controller.activeTheme =
      theme.name;

    controller.setTheme =
      setTheme;

    controller.cycleTheme =
      cycleTheme;


    return () => {
      controller.activeTheme =
        null;

      controller.setTheme =
        null;

      controller.cycleTheme =
        null;
    };
  }, [
    controller,
    theme.name,
    setTheme,
    cycleTheme,
  ]);


  return (
    <div
      data-testid="active-theme"
    >
      {theme.name}
    </div>
  );
}


type ProviderConfiguration = {
  initialTheme?:
    ThemeName;

  persist?:
    boolean;

  storageKey?:
    string;

  themes?:
    typeof THEMES;

  children?:
    React.ReactNode;
};


type MountedProvider = {
  root:
    Root;

  container:
    HTMLDivElement;

  controller:
    ThemeController;

  render(
    configuration?:
      ProviderConfiguration
  ): Promise<void>;

  unmount():
    Promise<void>;
};


const mountedProviders:
  MountedProvider[] = [];


function createController():
  ThemeController {
  return {
    activeTheme:
      null,

    setTheme:
      null,

    cycleTheme:
      null,
  };
}


function createProviderElement(
  controller:
    ThemeController,
  configuration:
    ProviderConfiguration = {}
) {
  return (
    <UIThemeProvider
      initialTheme={
        configuration.initialTheme ??
        "provider-config-light"
      }
      persist={
        configuration.persist ??
        false
      }
      storageKey={
        configuration.storageKey ??
        STORAGE_KEY
      }
      themes={
        configuration.themes ??
        THEMES
      }
    >
      <Controller
        controller={
          controller
        }
      />

      {
        configuration.children ??
        (
          <div>
            Initial child
          </div>
        )
      }
    </UIThemeProvider>
  );
}


async function mountProvider(
  configuration:
    ProviderConfiguration = {}
): Promise<MountedProvider> {
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


  const controller =
    createController();


  const mounted:
    MountedProvider = {
      root,
      container,
      controller,

      async render(
        nextConfiguration = {}
      ) {
        await act(async () => {
          root.render(
            createProviderElement(
              controller,
              nextConfiguration
            )
          );
        });
      },

      async unmount() {
        await act(async () => {
          root.unmount();
        });


        container.remove();


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
      },
    };


  await mounted.render(
    configuration
  );


  mountedProviders.push(
    mounted
  );


  return mounted;
}


async function expectConfigurationError(
  action:
    () => Promise<void>,
  changedProperties:
    readonly string[]
): Promise<void> {
  let thrown:
    unknown;


  try {
    await action();
  } catch (error) {
    thrown =
      error;
  }


  expect(
    thrown
  ).toBeInstanceOf(
    Error
  );


  const message =
    (
      thrown as Error
    ).message;


  for (
    const property of
    changedProperties
  ) {
    expect(
      message
    ).toContain(
      property
    );
  }


  expect(
    message
  ).toMatch(
    /remount|re-mount/i
  );
}


function clearDocumentTheme():
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
        index
      );


    if (
      property ===
        "color-scheme" ||
      property.startsWith(
        "--ui-"
      )
    ) {
      root.style.removeProperty(
        property
      );
    }
  }


  delete root.dataset.uiTheme;

  localStorage.removeItem(
    STORAGE_KEY
  );
}


describe(
  "UIThemeProvider immutable configuration",
  () => {
    afterEach(async () => {
      for (
        const mounted of [
          ...mountedProviders,
        ].reverse()
      ) {
        try {
          await mounted.unmount();
        } catch {
          mounted.container.remove();
        }
      }


      mountedProviders.length =
        0;


      clearDocumentTheme();

      vi.restoreAllMocks();
    });


    it(
      "allows rerenders when immutable configuration preserves values and themes reference",
      async () => {
        const mounted =
          await mountProvider({
            initialTheme:
              "provider-config-light",

            persist:
              false,

            storageKey:
              STORAGE_KEY,

            themes:
              THEMES,
          });


        await mounted.render({
          initialTheme:
            "provider-config-light",

          persist:
            false,

          storageKey:
            STORAGE_KEY,

          themes:
            THEMES,
        });


        expect(
          mounted.controller
            .activeTheme
        ).toBe(
          "provider-config-light"
        );


        expect(
          document.documentElement
            .dataset
            .uiTheme
        ).toBe(
          "provider-config-light"
        );
      }
    );


    it(
      "rejects changing initialTheme after mount",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error"
          )
            .mockImplementation(
              () => {}
            );


        const mounted =
          await mountProvider();


        await expectConfigurationError(
          () =>
            mounted.render({
              initialTheme:
                "provider-config-dark",

              persist:
                false,

              storageKey:
                STORAGE_KEY,

              themes:
                THEMES,
            }),

          [
            "initialTheme",
          ]
        );


        consoleError.mockRestore();
      }
    );


    it(
      "rejects changing persist after mount",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error"
          )
            .mockImplementation(
              () => {}
            );


        const mounted =
          await mountProvider({
            persist:
              false,
          });


        await expectConfigurationError(
          () =>
            mounted.render({
              initialTheme:
                "provider-config-light",

              persist:
                true,

              storageKey:
                STORAGE_KEY,

              themes:
                THEMES,
            }),

          [
            "persist",
          ]
        );


        consoleError.mockRestore();
      }
    );


    it(
      "rejects changing storageKey after mount",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error"
          )
            .mockImplementation(
              () => {}
            );


        const mounted =
          await mountProvider();


        await expectConfigurationError(
          () =>
            mounted.render({
              initialTheme:
                "provider-config-light",

              persist:
                false,

              storageKey:
                "different-storage-key",

              themes:
                THEMES,
            }),

          [
            "storageKey",
          ]
        );


        consoleError.mockRestore();
      }
    );


    it(
      "rejects a different themes reference even with the same definitions",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error"
          )
            .mockImplementation(
              () => {}
            );


        const mounted =
          await mountProvider({
            themes:
              THEMES,
          });


        const equivalentThemes = [
          lightTheme,
          darkTheme,
        ] as const;


        await expectConfigurationError(
          () =>
            mounted.render({
              initialTheme:
                "provider-config-light",

              persist:
                false,

              storageKey:
                STORAGE_KEY,

              themes:
                equivalentThemes,
            }),

          [
            "themes",
          ]
        );


        consoleError.mockRestore();
      }
    );


    it(
      "reports every immutable property changed in one rerender",
      async () => {
        const consoleError =
          vi.spyOn(
            console,
            "error"
          )
            .mockImplementation(
              () => {}
            );


        const mounted =
          await mountProvider();


        const equivalentThemes = [
          lightTheme,
          darkTheme,
        ] as const;


        await expectConfigurationError(
          () =>
            mounted.render({
              initialTheme:
                "provider-config-dark",

              persist:
                true,

              storageKey:
                "changed-storage-key",

              themes:
                equivalentThemes,
            }),

          [
            "initialTheme",
            "persist",
            "storageKey",
            "themes",
          ]
        );


        consoleError.mockRestore();
      }
    );


    it(
      "allows children to change",
      async () => {
        const mounted =
          await mountProvider({
            children: (
              <div
                data-testid="first-child"
              >
                First child
              </div>
            ),
          });


        expect(
          mounted.container.textContent
        ).toContain(
          "First child"
        );


        await mounted.render({
          initialTheme:
            "provider-config-light",

          persist:
            false,

          storageKey:
            STORAGE_KEY,

          themes:
            THEMES,

          children: (
            <section
              data-testid="second-child"
            >
              Second child
            </section>
          ),
        });


        expect(
          mounted.container.textContent
        ).toContain(
          "Second child"
        );


        expect(
          mounted.container.textContent
        ).not.toContain(
          "First child"
        );
      }
    );


    it(
      "allows setTheme and cycleTheme without treating state changes as configuration changes",
      async () => {
        const mounted =
          await mountProvider();


        expect(
          mounted.controller
            .activeTheme
        ).toBe(
          "provider-config-light"
        );


        expect(
          mounted.controller
            .setTheme
        ).not.toBeNull();


        await act(async () => {
          mounted.controller
            .setTheme?.(
              "provider-config-dark"
            );
        });


        expect(
          mounted.controller
            .activeTheme
        ).toBe(
          "provider-config-dark"
        );


        expect(
          document.documentElement
            .dataset
            .uiTheme
        ).toBe(
          "provider-config-dark"
        );


        expect(
          mounted.controller
            .cycleTheme
        ).not.toBeNull();


        await act(async () => {
          mounted.controller
            .cycleTheme?.();
        });


        expect(
          mounted.controller
            .activeTheme
        ).toBe(
          "provider-config-light"
        );


        expect(
          document.documentElement
            .dataset
            .uiTheme
        ).toBe(
          "provider-config-light"
        );
      }
    );
  }
);