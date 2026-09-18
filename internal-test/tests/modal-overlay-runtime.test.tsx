import type {
  ReactNode,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  OverlayProvider,
} from "../../src/core/overlay";

import {
  BottomSheet,
  BottomSheetBody,
} from "../../src/primitives/overlay/BottomSheet";

import {
  Drawer,
  DrawerBody,
} from "../../src/primitives/overlay/Drawer";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function renderWithOverlay(
  node:
    ReactNode,
) {
  return renderDOM(
    <OverlayProvider
      ownerDocument={
        document
      }
    >
      {node}
    </OverlayProvider>,
  );
}


describe(
  "shared modal overlay runtime",
  () => {
    it(
      "preserves Drawer dialog semantics and family data attributes",
      () => {
        const onOpenChange =
          vi.fn();

        const container =
          renderWithOverlay(
            <Drawer
              open
              portalled={
                false
              }
              autoFocus={
                false
              }
              restoreFocus={
                false
              }
              title="Drawer title"
              description="Drawer description"
              onOpenChange={
                onOpenChange
              }
            >
              <DrawerBody
                data-testid="drawer-body"
              >
                Content
              </DrawerBody>
            </Drawer>,
          );

        const dialog =
          container.querySelector<HTMLElement>(
            '[role="dialog"]',
          );

        expect(
          dialog,
        ).not.toBeNull();

        expect(
          dialog?.getAttribute(
            "aria-modal",
          ),
        ).toBe(
          "true",
        );

        expect(
          container.querySelector(
            "[data-ui-drawer-root]",
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            "[data-ui-drawer-panel]",
          ),
        ).not.toBeNull();

        expect(
          getByTestId(
            container,
            "drawer-body",
          ).textContent,
        ).toBe(
          "Content",
        );
      },
    );


    it(
      "preserves BottomSheet dialog semantics and family data attributes",
      () => {
        const container =
          renderWithOverlay(
            <BottomSheet
              open
              portalled={
                false
              }
              autoFocus={
                false
              }
              restoreFocus={
                false
              }
              showHandle={
                false
              }
              title="Sheet title"
            >
              <BottomSheetBody
                data-testid="sheet-body"
              >
                Content
              </BottomSheetBody>
            </BottomSheet>,
          );

        const dialog =
          container.querySelector<HTMLElement>(
            '[role="dialog"]',
          );

        expect(
          dialog,
        ).not.toBeNull();

        expect(
          dialog?.getAttribute(
            "aria-modal",
          ),
        ).toBe(
          "true",
        );

        expect(
          container.querySelector(
            "[data-ui-bottom-sheet-root]",
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            "[data-ui-bottom-sheet-panel]",
          ),
        ).not.toBeNull();

        expect(
          getByTestId(
            container,
            "sheet-body",
          ).textContent,
        ).toBe(
          "Content",
        );
      },
    );
  },
);
