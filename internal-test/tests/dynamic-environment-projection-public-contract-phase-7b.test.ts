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

const publicIndex =
  readFileSync(
    resolve(
      ROOT,
      "src/index.ts",
    ),
    "utf8",
  );

const motionIndex =
  readFileSync(
    resolve(
      ROOT,
      "src/core/motion/index.ts",
    ),
    "utf8",
  );

const viewportIndex =
  readFileSync(
    resolve(
      ROOT,
      "src/core/viewport/index.ts",
    ),
    "utf8",
  );


describe(
  "Phase 7B public contract",
  () => {
    it(
      "preserves the existing motion and viewport owners as the public entry points",
      () => {
        expect(
          publicIndex,
        ).toContain(
          "UIMotionProvider",
        );

        expect(
          publicIndex,
        ).toContain(
          "UIViewportProvider",
        );

        expect(
          motionIndex,
        ).toContain(
          "UIMotionProvider",
        );

        expect(
          viewportIndex,
        ).toContain(
          "UIViewportProvider",
        );
      },
    );


    it(
      "does not publish projection implementation details as new root owners",
      () => {
        expect(
          publicIndex,
        ).not.toContain(
          "getMotionCSSProjection",
        );

        expect(
          publicIndex,
        ).not.toContain(
          "resolveUIDensity",
        );

        expect(
          publicIndex,
        ).not.toContain(
          "DensityProvider",
        );

        expect(
          publicIndex,
        ).not.toContain(
          "MotionCSSProvider",
        );
      },
    );
  },
);
