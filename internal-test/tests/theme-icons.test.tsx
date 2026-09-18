import React from "react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  act,
} from "react";

import {
  createRoot,
  type Root,
} from "react-dom/client";

import {
  Moon,
  Sparkles,
  Sunset,
  Waves,
} from "lucide-react";

import type {
  LucideIcon,
  LucideProps,
} from "lucide-react";

import {
  ThemeSwitcher,
} from "../../src/components/theme-switcher/ThemeSwitcher";

import {
  UIThemeProvider,
  createThemeDefinition,
  resolveThemeIcon,
} from "../../src/theme";

import type {
  ThemeIconRegistry,
} from "../../src/theme";

import * as publicThemeApi from "../../src/theme";

import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  OverlayProvider,
} from "../../src/core/overlay/OverlayProvider";


const mountedRoots:
  Array<{
    root:
      Root;

    container:
      HTMLDivElement;
  }> = [];


const switcherTheme =
  createThemeDefinition({
    name:
      "switcher-local-icons",

    source:
      "custom",

    metadata: {
      label:
        "Local Theme",

      icon:
        "shared-icon",

      colorScheme:
        "light",
    },
  });


const switcherThemes = [
  switcherTheme,
] as const;


function createTestIcon(
  testId:
    string,
): LucideIcon {
  return React.forwardRef<
    SVGSVGElement,
    LucideProps
  >(
    (
      props,
      ref,
    ) => (
      <svg
        {...props}
        ref={
          ref
        }
        data-testid={
          testId
        }
      />
    ),
  ) as LucideIcon;
}


const LocalIconA =
  createTestIcon(
    "local-icon-a",
  );


const LocalIconB =
  createTestIcon(
    "local-icon-b",
  );


async function mount(
  element:
    React.ReactElement,
): Promise<{
  root:
    Root;

  container:
    HTMLDivElement;
}> {
  const container =
    document.createElement(
      "div",
    );


  document.body.appendChild(
    container,
  );


  const root =
    createRoot(
      container,
    );


  await act(async () => {
    root.render(
      element,
    );
  });


  const mounted = {
    root,
    container,
  };


  mountedRoots.push(
    mounted,
  );


  return mounted;
}


afterEach(async () => {
  for (
    const mounted of
    mountedRoots.splice(
      0,
    )
  ) {
    await act(async () => {
      mounted.root.unmount();
    });


    mounted.container.remove();
  }


  delete document.documentElement
    .dataset
    .uiTheme;
});


function ThemeSwitcherTestTree({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <OverlayProvider>
      <UIThemeProvider
        initialTheme="switcher-local-icons"
        persist={
          false
        }
        themes={
          switcherThemes
        }
      >
        {children}
      </UIThemeProvider>
    </OverlayProvider>
  );
}


describe(
  "theme icon public API",
  () => {
    it(
      "does not expose the removed global registration API",
      () => {
        expect(
          "registerThemeIcon" in
            publicThemeApi,
        ).toBe(
          false,
        );


        const source =
          readFileSync(
            resolve(
              process.cwd(),
              "../src/theme/index.ts",
            ),
            "utf8",
          );


        expect(
          source,
        ).not.toMatch(
          /\bregisterThemeIcon\b/,
        );


        expect(
          source,
        ).not.toMatch(
          /\bRegisterThemeIconOptions\b/,
        );
      },
    );
  },
);


describe(
  "resolveThemeIcon",
  () => {
    it(
      "resolves built-in icons without a custom registry",
      () => {
        expect(
          resolveThemeIcon(
            "moon",
          ),
        ).toBe(
          Moon,
        );
      },
    );


    it(
      "returns Sparkles for an unknown icon",
      () => {
        expect(
          resolveThemeIcon(
            "unknown-theme-icon",
          ),
        ).toBe(
          Sparkles,
        );
      },
    );


    it(
      "resolves custom icons from a local registry",
      () => {
        const registry = {
          waves:
            Waves,
        } satisfies ThemeIconRegistry;


        expect(
          resolveThemeIcon(
            "waves",
            registry,
          ),
        ).toBe(
          Waves,
        );
      },
    );


    it(
      "allows a local registry to override a built-in name for one call",
      () => {
        const registry = {
          moon:
            Sunset,
        } satisfies ThemeIconRegistry;


        expect(
          resolveThemeIcon(
            "moon",
            registry,
          ),
        ).toBe(
          Sunset,
        );


        expect(
          resolveThemeIcon(
            "moon",
          ),
        ).toBe(
          Moon,
        );
      },
    );


    it(
      "keeps separate registries isolated",
      () => {
        const firstRegistry = {
          shared:
            Waves,
        } satisfies ThemeIconRegistry;


        const secondRegistry = {
          shared:
            Sunset,
        } satisfies ThemeIconRegistry;


        expect(
          resolveThemeIcon(
            "shared",
            firstRegistry,
          ),
        ).toBe(
          Waves,
        );


        expect(
          resolveThemeIcon(
            "shared",
            secondRegistry,
          ),
        ).toBe(
          Sunset,
        );


        expect(
          resolveThemeIcon(
            "shared",
          ),
        ).toBe(
          Sparkles,
        );
      },
    );


    it(
      "does not mutate the received registry",
      () => {
        const registry = {
          waves:
            Waves,
        } satisfies ThemeIconRegistry;


        const keysBefore =
          Object.keys(
            registry,
          );


        const valueBefore =
          registry.waves;


        resolveThemeIcon(
          "waves",
          registry,
        );


        resolveThemeIcon(
          "missing",
          registry,
        );


        expect(
          Object.keys(
            registry,
          ),
        ).toEqual(
          keysBefore,
        );


        expect(
          registry.waves,
        ).toBe(
          valueBefore,
        );
      },
    );


    it(
      "ignores names inherited from the registry prototype",
      () => {
        const prototype = {
          inherited:
            Waves,
        };


        const registry =
          Object.create(
            prototype,
          ) as ThemeIconRegistry;


        expect(
          resolveThemeIcon(
            "inherited",
            registry,
          ),
        ).toBe(
          Sparkles,
        );
      },
    );
  },
);


describe(
  "ThemeSwitcher local icon registry",
  () => {
    it(
      "uses the registry received through icons",
      async () => {
        const icons = {
          "shared-icon":
            LocalIconA,
        } satisfies ThemeIconRegistry;


        const mounted =
          await mount(
            <ThemeSwitcherTestTree>
              <ThemeSwitcher
                icons={
                  icons
                }
              />
            </ThemeSwitcherTestTree>,
          );


        expect(
          mounted.container.querySelector(
            '[data-testid="local-icon-a"]',
          ),
        ).not.toBeNull();
      },
    );


    it(
      "allows two switchers to use different registries",
      async () => {
        const firstIcons = {
          "shared-icon":
            LocalIconA,
        } satisfies ThemeIconRegistry;


        const secondIcons = {
          "shared-icon":
            LocalIconB,
        } satisfies ThemeIconRegistry;


        const mounted =
          await mount(
            <ThemeSwitcherTestTree>
              <ThemeSwitcher
                icons={
                  firstIcons
                }
              />

              <ThemeSwitcher
                icons={
                  secondIcons
                }
              />
            </ThemeSwitcherTestTree>,
          );


        expect(
          mounted.container.querySelectorAll(
            '[data-testid="local-icon-a"]',
          ),
        ).toHaveLength(
          1,
        );


        expect(
          mounted.container.querySelectorAll(
            '[data-testid="local-icon-b"]',
          ),
        ).toHaveLength(
          1,
        );
      },
    );


    it(
      "uses Theme as its default label",
      async () => {
        const mounted =
          await mount(
            <ThemeSwitcherTestTree>
              <ThemeSwitcher />
            </ThemeSwitcherTestTree>,
          );


        const button =
          mounted.container.querySelector(
            "button",
          );


        expect(
          button?.textContent,
        ).toContain(
          "Theme: Local Theme",
        );
      },
    );


    it(
      "hides the prefix and colon when label is null",
      async () => {
        const mounted =
          await mount(
            <ThemeSwitcherTestTree>
              <ThemeSwitcher
                label={
                  null
                }
              />
            </ThemeSwitcherTestTree>,
          );


        const button =
          mounted.container.querySelector(
            "button",
          );


        expect(
          button?.textContent,
        ).toBe(
          "Local Theme",
        );


        expect(
          button?.textContent,
        ).not.toContain(
          ":",
        );
      },
    );
  },
);