import {
  expect,
  test,
  type Page,
} from "@playwright/test";

import {
  THEME_TOKEN_MANIFEST,
} from "../../src/theme/contracts/theme-token-contract";

import {
  collectManifestLeaves,
} from "../tests/theme-token-test-utils";


const PAGE_PATH =
  "/browser-theme-ownership.html";


const CANONICAL_VARIABLE_COUNT =
  collectManifestLeaves(
    THEME_TOKEN_MANIFEST,
  ).length;


const NEW_VARIABLES = [
  "--ui-interaction-focus-ring-color",
  "--ui-interaction-focus-ring-danger-color",
  "--ui-interaction-focus-ring-width",
  "--ui-interaction-focus-ring-offset",
  "--ui-interaction-disabled-opacity",
] as const;


const FORBIDDEN_REMOVED_VARIABLES = [
  "--ui-interaction-focus-ring",
  "--ui-state-focus",
  "--ui-state-focus-danger",
  "--ui-state-disabled-opacity",
] as const;


async function resetPage(
  page:
    Page,
): Promise<void> {
  await page.goto(
    PAGE_PATH,
    {
      waitUntil:
        "networkidle",
    },
  );


  await page.evaluate(
    (
      properties,
    ) => {
      const root =
        document.documentElement;


      for (
        const property of
        properties
      ) {
        root.style.removeProperty(
          property,
        );
      }


      delete root.dataset.uiTheme;

      localStorage.clear();
    },
    [
      "--ui-primary",
      "--ui-danger",
      ...NEW_VARIABLES,
      ...FORBIDDEN_REMOVED_VARIABLES,
    ],
  );
}


async function readThemeVariables(
  page:
    Page,
) {
  return page.evaluate(
    (
      legacyVariables,
    ) => {
      const style =
        document
          .documentElement
          .style;


      const declaredProperties =
        Array.from(
          {
            length:
              style.length,
          },
          (
            _,
            index,
          ) =>
            style.item(
              index,
            ),
        );


      return {
        theme:
          document
            .documentElement
            .dataset
            .uiTheme,

        primary:
          style.getPropertyValue(
            "--ui-primary",
          ),

        danger:
          style.getPropertyValue(
            "--ui-danger",
          ),

        focusRingColor:
          style.getPropertyValue(
            "--ui-interaction-focus-ring-color",
          ),

        focusRingDangerColor:
          style.getPropertyValue(
            "--ui-interaction-focus-ring-danger-color",
          ),

        focusRingWidth:
          style.getPropertyValue(
            "--ui-interaction-focus-ring-width",
          ),

        focusRingOffset:
          style.getPropertyValue(
            "--ui-interaction-focus-ring-offset",
          ),

        disabledOpacity:
          style.getPropertyValue(
            "--ui-interaction-disabled-opacity",
          ),

        customPropertyCount:
          declaredProperties.filter(
            (
              property,
            ) =>
              property.startsWith(
                "--ui-",
              ),
          ).length,

        legacyProperties:
          legacyVariables.filter(
            (
              property,
            ) =>
              declaredProperties.includes(
                property,
              ),
          ),
      };
    },
    FORBIDDEN_REMOVED_VARIABLES,
  );
}


test.beforeEach(
  async ({
    page,
  }) => {
    await resetPage(
      page,
    );
  },
);


test(
  "mounts every canonical variable without legacy interaction variables",
  async ({
    page,
  }) => {
    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            initialTheme:
              "browser-dark",
          }),
    );


    const snapshot =
      await readThemeVariables(
        page,
      );


    expect(
      snapshot.theme,
    ).toBe(
      "browser-dark",
    );


    expect(
      snapshot.customPropertyCount,
    ).toBe(
      CANONICAL_VARIABLE_COUNT,
    );


    expect(
      snapshot.focusRingColor,
    ).toContain(
      "var(--ui-primary)",
    );


    expect(
      snapshot.focusRingDangerColor,
    ).toContain(
      "var(--ui-danger)",
    );


    expect(
      snapshot.focusRingWidth,
    ).toBe(
      "3px",
    );


    expect(
      snapshot.focusRingOffset,
    ).toBe(
      "0px",
    );


    expect(
      snapshot.disabledOpacity,
    ).toBe(
      "0.65",
    );


    expect(
      snapshot.legacyProperties,
    ).toEqual([]);


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount(),
    );
  },
);


test(
  "changes the base colors used by canonical rings when switching themes",
  async ({
    page,
  }) => {
    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            initialTheme:
              "browser-dark",
          }),
    );


    const dark =
      await readThemeVariables(
        page,
      );


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .setTheme(
            "browser-light",
          ),
    );


    const light =
      await readThemeVariables(
        page,
      );


    expect(
      dark.theme,
    ).toBe(
      "browser-dark",
    );


    expect(
      light.theme,
    ).toBe(
      "browser-light",
    );


    expect(
      dark.primary,
    ).toBe(
      "#111111",
    );


    expect(
      light.primary,
    ).toBe(
      "#eeeeee",
    );


    expect(
      dark.danger,
    ).toBe(
      "#991b1b",
    );


    expect(
      light.danger,
    ).toBe(
      "#e11d48",
    );


    expect(
      light.primary,
    ).not.toBe(
      dark.primary,
    );


    expect(
      light.danger,
    ).not.toBe(
      dark.danger,
    );


    for (
      const snapshot of [
        dark,
        light,
      ]
    ) {
      expect(
        snapshot.focusRingColor,
      ).toContain(
        "var(--ui-primary)",
      );


      expect(
        snapshot.focusRingDangerColor,
      ).toContain(
        "var(--ui-danger)",
      );


      expect(
        snapshot.customPropertyCount,
      ).toBe(
        CANONICAL_VARIABLE_COUNT,
      );


      expect(
        snapshot.legacyProperties,
      ).toEqual([]);
    }


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount(),
    );
  },
);