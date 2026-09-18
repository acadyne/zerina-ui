import React from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "zerina-ui";

import {
  FloatingOverlayRuntime,
} from "../../src/core/overlay";

import {
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase C2 FloatingOverlayRuntime behavior",
  () => {
    it(
      "renders non-portalled content without requiring OverlayProvider",
      () => {
        function Harness() {
          const anchorRef =
            React.useRef<HTMLButtonElement | null>(
              null,
            );


          return (
            <>
              <button
                ref={
                  anchorRef
                }
                type="button"
              >
                Anchor
              </button>

              <FloatingOverlayRuntime
                open
                present
                portalled={
                  false
                }
                anchorRef={
                  anchorRef
                }
              >
                {({
                  ref,
                  style,
                  placement,
                }) => (
                  <div
                    ref={
                      ref
                    }
                    style={
                      style
                    }
                    data-testid="content"
                    data-placement={
                      placement
                    }
                  >
                    Content
                  </div>
                )}
              </FloatingOverlayRuntime>
            </>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );


        expect(
          getByTestId(
            container,
            "content",
          ).textContent,
        ).toBe(
          "Content",
        );
      },
    );


    it(
      "does not evaluate floating content while present is false",
      () => {
        const renderFloating =
          vi.fn(
            () => (
              <div>
                Content
              </div>
            ),
          );


        function Harness() {
          const anchorRef =
            React.useRef<HTMLButtonElement | null>(
              null,
            );


          return (
            <>
              <button
                ref={
                  anchorRef
                }
                type="button"
              >
                Anchor
              </button>

              <FloatingOverlayRuntime
                open
                present={
                  false
                }
                portalled={
                  false
                }
                anchorRef={
                  anchorRef
                }
              >
                {renderFloating}
              </FloatingOverlayRuntime>
            </>
          );
        }


        renderDOM(
          <Harness />,
        );


        expect(
          renderFloating,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "preserves non-portalled Tooltip operation without OverlayProvider",
      () => {
        const container =
          renderDOM(
            <Tooltip
              openDelayMs={
                0
              }
              closeDelayMs={
                0
              }
            >
              <TooltipTrigger
                asChild
              >
                <button
                  type="button"
                  data-testid="trigger"
                >
                  Trigger
                </button>
              </TooltipTrigger>

              <TooltipContent
                portalled={
                  false
                }
                data-testid="tooltip"
              >
                Tooltip content
              </TooltipContent>
            </Tooltip>,
          );


        focusElement(
          getByTestId(
            container,
            "trigger",
          ),
        );


        expect(
          getByTestId(
            container,
            "tooltip",
          ).getAttribute(
            "role",
          ),
        ).toBe(
          "tooltip",
        );
      },
    );
  },
);
