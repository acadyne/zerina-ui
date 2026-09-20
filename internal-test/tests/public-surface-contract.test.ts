// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  describe,
  expect,
  it,
} from "vitest";

import * as ZerinaUI from "zerina-ui";


const ROOT_INDEX_PATH =
  fileURLToPath(
    new URL(
      "../../src/index.ts",
      import.meta.url,
    ),
  );

const PACKAGE_PATH =
  fileURLToPath(
    new URL(
      "../../package.json",
      import.meta.url,
    ),
  );


describe(
  "root public surface",
  () => {
    it(
      "keeps user-facing motion and viewport APIs available",
      () => {
        expect(
          ZerinaUI,
        ).toHaveProperty(
          "UIMotionProvider",
        );

        expect(
          ZerinaUI,
        ).toHaveProperty(
          "MotionPresence",
        );

        expect(
          ZerinaUI,
        ).toHaveProperty(
          "UIViewportProvider",
        );

        expect(
          ZerinaUI,
        ).toHaveProperty(
          "useUIViewport",
        );

        expect(
          ZerinaUI,
        ).toHaveProperty(
          "usePress",
        );

        for (
          const visualExport of [
            "UI_TONES",
            "UI_SURFACE_ROLES",
            "UI_ELEVATIONS",
            "UI_TYPOGRAPHY_ROLES",
            "UI_SHAPES",
            "toneRecipe",
            "surfaceRecipe",
            "interactiveStateRecipe",
            "typographyRecipe",
          ]
        ) {
          expect(
            ZerinaUI,
          ).toHaveProperty(
            visualExport,
          );
        }
      },
    );


    it.each([
      "MotionOverlayPresence",
      "MotionOverlayRoot",
      "MotionOverlayBackdrop",
      "MotionOverlayPanel",
      "getCollapsibleContentVariants",
      "getCollapsibleTriggerIconVariants",
      "getProgressIndeterminateVariants",
      "getSpinnerTransition",
      "getSpinnerVariants",
      "shouldAnimateSpinner",
      "shouldAnimateContinuousMotion",
      "useOptionalUIMotion",
      "resolveUIViewportKind",
      "useOptionalUIViewport",
    ])(
      "does not expose internal runtime helper %s from the package root",
      (
        symbol,
      ) => {
        expect(
          Object.prototype.hasOwnProperty.call(
            ZerinaUI,
            symbol,
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "does not use wildcard exports for core motion or viewport at the package root",
      () => {
        const source =
          readFileSync(
            ROOT_INDEX_PATH,
            "utf8",
          );

        expect(
          source,
        ).not.toContain(
          'export * from "./core/motion"',
        );

        expect(
          source,
        ).not.toContain(
          'export * from "./core/viewport"',
        );
      },
    );


    it(
      "ships only the intended package entry points",
      () => {
        const packageJson =
          JSON.parse(
            readFileSync(
              PACKAGE_PATH,
              "utf8",
            ),
          ) as {
            exports:
              Record<
                string,
                unknown
              >;
          };

        expect(
          Object.keys(
            packageJson.exports,
          ).sort(),
        ).toEqual([
          ".",
          "./reset.css",
          "./styles.css",
        ]);
      },
    );
  },
);
