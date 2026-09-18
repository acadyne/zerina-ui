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


function readRelative(
  relativePath:
    string,
): string {
  return readFileSync(
    fileURLToPath(
      new URL(
        relativePath,
        import.meta.url,
      ),
    ),
    "utf8",
  );
}


describe(
  "interaction/overlay implementation ownership",
  () => {
    it(
      "keeps modal runtime mechanics in one owner",
      () => {
        const dialog =
          readRelative(
            "../../src/primitives/overlay/Dialog.tsx",
          );

        const drawer =
          readRelative(
            "../../src/primitives/overlay/Drawer.tsx",
          );

        const sheet =
          readRelative(
            "../../src/primitives/overlay/BottomSheet.tsx",
          );

        const runtime =
          readRelative(
            "../../src/primitives/overlay/shared/ModalOverlayRuntime.tsx",
          );

        for (
          const family of [
            dialog,
            drawer,
            sheet,
          ]
        ) {
          expect(
            family,
          ).toContain(
            "<ModalOverlayRuntime",
          );

          expect(
            family,
          ).not.toContain(
            "<DismissableLayer",
          );

          expect(
            family,
          ).not.toContain(
            "<FocusScope",
          );

          expect(
            family,
          ).not.toContain(
            "<ScrollLock",
          );

          expect(
            family,
          ).not.toContain(
            "<MotionOverlayPresence",
          );
        }

        expect(
          runtime,
        ).toContain(
          "<DismissableLayer",
        );

        expect(
          runtime,
        ).toContain(
          "<FocusScope",
        );

        expect(
          runtime,
        ).toContain(
          "<ScrollLock",
        );

        expect(
          runtime,
        ).toContain(
          "<MotionOverlayPresence",
        );
      },
    );


    it(
      "contains no unresolved P3.1/P4.1 markers",
      () => {
        const menuRoot =
          readRelative(
            "../../src/primitives/overlay/menu/MenuRoot.tsx",
          );

        const triggerRuntime =
          readRelative(
            "../../src/core/interaction/trigger/TriggerRuntime.tsx",
          );

        expect(
          menuRoot,
        ).not.toContain(
          "P3.1",
        );

        expect(
          triggerRuntime,
        ).not.toContain(
          "P4.1",
        );
      },
    );
  },
);
