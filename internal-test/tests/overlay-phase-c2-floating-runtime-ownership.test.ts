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
  "Phase C2 floating overlay ownership",
  () => {
    it(
      "keeps position/presence/portal ownership in one runtime",
      () => {
        const runtime =
          readSource(
            "core/overlay/FloatingOverlayRuntime.tsx",
          );


        expect(
          runtime,
        ).toContain(
          "FloatingLayer",
        );

        expect(
          runtime,
        ).toContain(
          "MotionPresenceGroup",
        );

        expect(
          runtime,
        ).toContain(
          "Portal",
        );


        for (
          const relativePath of [
            "primitives/overlay/Popover.tsx",
            "primitives/overlay/Tooltip.tsx",
            "primitives/overlay/menu/MenuContent.tsx",
            "components/navigation-menu/NavigationMenuPanel.tsx",
          ]
        ) {
          const source =
            readSource(
              relativePath,
            );


          expect(
            source,
          ).toContain(
            "FloatingOverlayRuntime",
          );

          expect(
            source,
          ).not.toContain(
            "<FloatingLayer",
          );

          expect(
            source,
          ).not.toContain(
            "<MotionPresenceGroup",
          );

          expect(
            source,
          ).not.toContain(
            "<Portal",
          );
        }
      },
    );


    it(
      "does not absorb domain dismiss/focus policy",
      () => {
        const runtime =
          readSource(
            "core/overlay/FloatingOverlayRuntime.tsx",
          );


        expect(
          runtime,
        ).not.toContain(
          "DismissableLayer",
        );

        expect(
          runtime,
        ).not.toContain(
          "FocusScope",
        );

        expect(
          runtime,
        ).not.toContain(
          "onDismiss",
        );

        expect(
          runtime,
        ).not.toContain(
          "role=",
        );
      },
    );


    it(
      "keeps dismiss/focus differences in their current owners",
      () => {
        const popover =
          readSource(
            "primitives/overlay/Popover.tsx",
          );

        const menu =
          readSource(
            "primitives/overlay/menu/MenuContent.tsx",
          );

        const navigation =
          readSource(
            "components/navigation-menu/NavigationMenuPanel.tsx",
          );

        const tooltip =
          readSource(
            "primitives/overlay/Tooltip.tsx",
          );


        expect(
          popover,
        ).toContain(
          "DismissableLayer",
        );

        expect(
          popover,
        ).toContain(
          "FocusScope",
        );


        expect(
          menu,
        ).toContain(
          "DismissableLayer",
        );

        expect(
          navigation,
        ).toContain(
          "DismissableLayer",
        );


        expect(
          tooltip,
        ).not.toContain(
          "DismissableLayer",
        );

        expect(
          tooltip,
        ).not.toContain(
          "FocusScope",
        );
      },
    );
  },
);
