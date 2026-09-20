// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";


const ROOT =
  resolve(
    process.cwd(),
    "..",
  );

const motionTokens =
  readFileSync(
    resolve(
      ROOT,
      "src/core/motion/motion.tokens.ts",
    ),
    "utf8",
  );

const motionProvider =
  readFileSync(
    resolve(
      ROOT,
      "src/core/motion/UIMotionProvider.tsx",
    ),
    "utf8",
  );

const motionCSS =
  readFileSync(
    resolve(
      ROOT,
      "src/core/motion/motion.css",
    ),
    "utf8",
  );

const viewportProvider =
  readFileSync(
    resolve(
      ROOT,
      "src/core/viewport/UIViewportProvider.tsx",
    ),
    "utf8",
  );

const viewportCSS =
  readFileSync(
    resolve(
      ROOT,
      "src/core/viewport/viewport.css",
    ),
    "utf8",
  );

const styles =
  readFileSync(
    resolve(
      ROOT,
      "src/styles.css",
    ),
    "utf8",
  );


describe(
  "Phase 7B dynamic environment ownership",
  () => {
    it(
      "keeps numeric motion timing and easing values out of CSS",
      () => {
        for (
          const duplicated of [
            "120ms",
            "180ms",
            "260ms",
            "360ms",
            "cubic-bezier(0.2, 0, 0, 1)",
            "cubic-bezier(0.16, 1, 0.3, 1)",
            "cubic-bezier(0.4, 0, 1, 1)",
          ]
        ) {
          expect(
            motionCSS,
          ).not.toContain(
            duplicated,
          );
        }

        expect(
          motionTokens,
        ).toContain(
          "UI_MOTION_DURATIONS",
        );

        expect(
          motionTokens,
        ).toContain(
          "UI_MOTION_EASINGS",
        );

        expect(
          motionTokens,
        ).toContain(
          "getMotionCSSProjection",
        );


        expect(
          motionTokens,
        ).toContain(
          "UI_MOTION_POLICY_CSS_VARIABLES",
        );

        expect(
          motionCSS,
        ).toContain(
          ':root[data-ui-motion-effective="reduced"]',
        );

        expect(
          motionCSS,
        ).toContain(
          ':root[data-ui-motion-effective="none"]',
        );

        expect(
          motionCSS,
        ).toContain(
          "var(--ui-motion-token-duration-fast)",
        );

        expect(
          motionCSS,
        ).toContain(
          "var(--ui-motion-token-duration-instant)",
        );

        expect(
          motionCSS,
        ).toContain(
          "var(--ui-motion-token-duration-none)",
        );
      },
    );


    it(
      "keeps UIMotionProvider as the document projection owner",
      () => {
        expect(
          motionProvider,
        ).toContain(
          "data-ui-motion-effective",
        );

        expect(
          motionProvider,
        ).toContain(
          "getMotionCSSProjection",
        );

        expect(
          motionProvider,
        ).toContain(
          "writeMotionCSSProjection",
        );


        expect(
          motionProvider,
        ).toContain(
          "UI_MOTION_POLICY_CSS_VARIABLES",
        );

        expect(
          motionProvider,
        ).not.toContain(
          "UI_MOTION_CSS_VARIABLES",
        );

        expect(
          motionProvider,
        ).not.toMatch(
          /MotionThemeProvider|MotionCSSProvider/,
        );
      },
    );


    it(
      "projects theme density metrics from the single viewport selection",
      () => {
        expect(
          viewportProvider,
        ).toContain(
          "data-ui-density",
        );

        expect(
          viewportProvider,
        ).toContain(
          "resolveUIDensity",
        );

        for (
          const density of [
            "compact",
            "comfortable",
            "spacious",
          ]
        ) {
          expect(
            viewportCSS,
          ).toContain(
            `:root[data-ui-density="${density}"]`,
          );
        }

        for (
          const metric of [
            "control-height",
            "item-min-height",
            "inline-gap",
            "block-gap",
            "content-padding",
            "icon-size",
          ]
        ) {
          expect(
            viewportCSS,
          ).toContain(
            `--ui-density-${metric}:`,
          );
        }

        expect(
          styles,
        ).toContain(
          '@import "./core/viewport/viewport.css";',
        );
      },
    );


    it(
      "does not create a second responsive or density selector in CSS",
      () => {
        expect(
          viewportCSS,
        ).not.toContain(
          "@media",
        );

        expect(
          viewportCSS,
        ).not.toContain(
          "pointer:",
        );

        expect(
          viewportCSS,
        ).not.toContain(
          "hover:",
        );

        expect(
          viewportCSS,
        ).not.toContain(
          "min-width",
        );

        expect(
          viewportCSS,
        ).not.toContain(
          "max-width",
        );
      },
    );
  },
);
