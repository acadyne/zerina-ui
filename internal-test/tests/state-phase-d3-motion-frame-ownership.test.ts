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


const SRC =
  resolve(
    process.cwd(),
    "..",
    "src",
  );


function readSource(
  relativePath:
    string,
): string {
  return readFileSync(
    resolve(
      SRC,
      relativePath,
    ),
    "utf8",
  );
}


describe(
  "Phase D3 motion app frame ownership",
  () => {
    it(
      "centralizes app-transition mechanics in MotionAppFrame",
      () => {
        const owner =
          readSource(
            "core/motion/MotionAppFrame.tsx",
          );


        for (
          const semantic of [
            "useOptionalUIMotion",
            "getAppTransitionVariants",
            "getAppTransitionIntent",
            "<AnimatePresence",
            "motion.div",
          ]
        ) {
          expect(
            owner,
          ).toContain(
            semantic,
          );
        }
      },
    );


    it.each([
      "core/motion/MotionPresence.tsx",
      "core/motion/MotionSwitch.tsx",
    ])(
      "%s delegates duplicated mechanics to MotionAppFrame",
      (
        relativePath,
      ) => {
        const source =
          readSource(
            relativePath,
          );


        expect(
          source,
        ).toContain(
          "MotionAppFrame",
        );


        for (
          const staleOwner of [
            "useOptionalUIMotion",
            "getAppTransitionVariants",
            "getAppTransitionIntent",
            "<AnimatePresence",
            "motion.div",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            staleOwner,
          );
        }


        expect(
          source,
        ).toContain(
          "import type {",
        );

        expect(
          source,
        ).not.toMatch(
          /import\s*\{[^}]*\bAnimatePresence\b[^}]*\}\s*from\s*["']framer-motion["']/s,
        );
      },
    );


    it(
      "preserves the public presence/switch key distinction",
      () => {
        const presence =
          readSource(
            "core/motion/MotionPresence.tsx",
          );

        const motionSwitch =
          readSource(
            "core/motion/MotionSwitch.tsx",
          );


        expect(
          presence,
        ).toMatch(
          /motionKey\?\s*:\s*React\.Key/,
        );

        expect(
          presence,
        ).toContain(
          'motionKey =\n    "motion-presence"',
        );


        expect(
          motionSwitch,
        ).toMatch(
          /motionKey\s*:\s*React\.Key/,
        );

        expect(
          motionSwitch,
        ).toContain(
          "present",
        );
      },
    );


    it(
      "keeps MotionAppFrame internal",
      () => {
        const motionIndex =
          readSource(
            "core/motion/index.ts",
          );

        const rootIndex =
          readSource(
            "index.ts",
          );


        expect(
          motionIndex,
        ).not.toContain(
          "MotionAppFrame",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "MotionAppFrame",
        );
      },
    );
  },
);
