// @vitest-environment node

import {
  existsSync,
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
  "Phase C1 trigger ownership",
  () => {
    it(
      "uses TriggerRuntime for Popover and Tooltip",
      () => {
        const popover =
          readSource(
            "primitives/overlay/Popover.tsx",
          );

        const tooltip =
          readSource(
            "primitives/overlay/Tooltip.tsx",
          );


        expect(
          popover,
        ).toContain(
          "TriggerRuntime",
        );

        expect(
          popover,
        ).toContain(
          'interactionMode="press"',
        );


        expect(
          tooltip,
        ).toContain(
          "TriggerRuntime",
        );

        expect(
          tooltip,
        ).toContain(
          'interactionMode="passive"',
        );
      },
    );


    it(
      "retires the parallel triggerProps helper",
      () => {
        expect(
          existsSync(
            resolve(
              SRC,
              "primitives/overlay/triggerProps.ts",
            ),
          ),
        ).toBe(
          false,
        );


        for (
          const relativePath of [
            "primitives/overlay/Popover.tsx",
            "primitives/overlay/Tooltip.tsx",
          ]
        ) {
          const source =
            readSource(
              relativePath,
            );


          expect(
            source,
          ).not.toContain(
            "mergeTriggerProps",
          );

          expect(
            source,
          ).not.toContain(
            "composeEventHandlers",
          );
        }
      },
    );


    it(
      "keeps passive and press semantics explicit in the runtime",
      () => {
        const runtime =
          readSource(
            "core/interaction/trigger/TriggerRuntime.tsx",
          );


        expect(
          runtime,
        ).toContain(
          'interactionMode ===',
        );

        expect(
          runtime,
        ).toContain(
          '"passive"',
        );

        expect(
          runtime,
        ).toContain(
          "PassiveTriggerRoot",
        );

        expect(
          runtime,
        ).toContain(
          "isTriggerPressTarget",
        );
      },
    );
  },
);
