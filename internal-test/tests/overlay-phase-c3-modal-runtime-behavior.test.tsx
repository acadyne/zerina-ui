import type {
  ReactNode,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OverlayProvider,
} from "../../src/core/overlay";

import {
  Dialog,
} from "../../src/primitives/overlay/Dialog";

import {
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
  "Phase C3 Dialog on shared modal runtime",
  () => {
    it(
      "preserves atomic modal semantics",
      () => {
        const container =
          renderWithOverlay(
            <Dialog
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
            >
              <span>
                Modal content
              </span>
            </Dialog>,
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
            "[data-ui-dialog-backdrop]",
          ),
        ).not.toBeNull();

        expect(
          document.body.style
            .overflow,
        ).toBe(
          "hidden",
        );
      },
    );


    it(
      "preserves non-modal Dialog semantics",
      () => {
        const container =
          renderWithOverlay(
            <Dialog
              open
              modal={
                false
              }
              portalled={
                false
              }
              autoFocus={
                false
              }
              restoreFocus={
                false
              }
            >
              <span>
                Non-modal content
              </span>
            </Dialog>,
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
        ).toBeNull();

        expect(
          container.querySelector(
            "[data-ui-dialog-backdrop]",
          ),
        ).toBeNull();

        expect(
          document.body.style
            .overflow,
        ).not.toBe(
          "hidden",
        );
      },
    );
  },
);
