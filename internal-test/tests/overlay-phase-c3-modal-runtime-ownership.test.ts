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
  "Phase C3 modal runtime ownership",
  () => {
    it.each([
      "primitives/overlay/Dialog.tsx",
      "primitives/overlay/Drawer.tsx",
      "primitives/overlay/BottomSheet.tsx",
    ])(
      "%s delegates modal mechanics to ModalOverlayRuntime",
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
          "<ModalOverlayRuntime",
        );


        for (
          const implementation of [
            "<DismissableLayer",
            "<FocusScope",
            "<ScrollLock",
            "<MotionOverlayPresence",
            "<MotionOverlayBackdrop",
            "<MotionOverlayPanel",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            implementation,
          );
        }
      },
    );


    it(
      "keeps atomic modal policy in the shared runtime",
      () => {
        const runtime =
          readSource(
            "primitives/overlay/shared/ModalOverlayRuntime.tsx",
          );


        expect(
          runtime,
        ).toContain(
          "modal = true",
        );

        expect(
          runtime,
        ).toMatch(
          /modal\s*\?\s*\(\s*<MotionOverlayBackdrop/s,
        );

        expect(
          runtime,
        ).toMatch(
          /contain=\{\s*modal\s*\}/s,
        );

        expect(
          runtime,
        ).toMatch(
          /aria-modal=\{\s*modal\s*\?\s*"true"\s*:\s*undefined/s,
        );

        expect(
          runtime,
        ).toMatch(
          /modal\s*\?\s*\(\s*<ScrollLock/s,
        );
      },
    );


    it(
      "keeps Dialog recipe and public modal decision local",
      () => {
        const dialog =
          readSource(
            "primitives/overlay/Dialog.tsx",
          );


        expect(
          dialog,
        ).toContain(
          "const dialogRecipe",
        );

        expect(
          dialog,
        ).toContain(
          "modal = true",
        );

        expect(
          dialog,
        ).toContain(
          "modal={",
        );

        expect(
          dialog,
        ).toContain(
          "panelKind=\"dialog\"",
        );
      },
    );
  },
);
