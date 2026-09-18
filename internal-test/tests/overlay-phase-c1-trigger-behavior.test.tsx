import React, {
  act,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Popover,
  PopoverTrigger,
  Pressable,
  Tooltip,
  TooltipTrigger,
} from "zerina-ui";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function dispatchFocusIn(
  element:
    HTMLElement,
): void {
  act(
    () => {
      element.dispatchEvent(
        new FocusEvent(
          "focusin",
          {
            bubbles:
              true,

            cancelable:
              true,
          },
        ),
      );
    },
  );
}


describe(
  "Phase C1 shared trigger runtime",
  () => {
    it(
      "keeps a Tooltip asChild span passive without leaking onPress to the DOM",
      () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          ).mockImplementation(
            () => {
              // inspected below
            },
          );


        const container =
          renderDOM(
            <Tooltip>
              <TooltipTrigger
                asChild
              >
                <span
                  data-testid="trigger"
                >
                  Label
                </span>
              </TooltipTrigger>
            </Tooltip>,
          );


        const unknownOnPressWarning =
          consoleError.mock.calls.some(
            (
              call,
            ) =>
              call.some(
                (
                  value,
                ) =>
                  String(
                    value,
                  ).includes(
                    "Unknown event handler property `onPress`",
                  ),
              ),
          );


        consoleError.mockRestore();


        expect(
          unknownOnPressWarning,
        ).toBe(
          false,
        );


        const trigger =
          getByTestId(
            container,
            "trigger",
          );


        expect(
          trigger.getAttribute(
            "role",
          ),
        ).toBeNull();

        expect(
          trigger.getAttribute(
            "tabindex",
          ),
        ).toBeNull();


        dispatchFocusIn(
          trigger,
        );


        expect(
          trigger.getAttribute(
            "aria-describedby",
          ),
        ).toMatch(
          /^tooltip-content-/,
        );
      },
    );


    it(
      "lets a child cancel Tooltip slot and internal focus behavior",
      () => {
        const slotFocus =
          vi.fn();


        const container =
          renderDOM(
            <Tooltip
              slotProps={{
                trigger: {
                  onFocus:
                    slotFocus,
                },
              }}
            >
              <TooltipTrigger
                asChild
              >
                <span
                  data-testid="trigger"
                  onFocus={(
                    event,
                  ) => {
                    event.preventDefault();
                  }}
                >
                  Label
                </span>
              </TooltipTrigger>
            </Tooltip>,
          );

        const trigger =
          getByTestId(
            container,
            "trigger",
          );


        dispatchFocusIn(
          trigger,
        );


        expect(
          slotFocus,
        ).not.toHaveBeenCalled();

        expect(
          trigger.getAttribute(
            "aria-describedby",
          ),
        ).toBeNull();
      },
    );


    it(
      "activates Popover through a Pressable press-target child",
      () => {
        function Harness() {
          const [
            open,
            setOpen,
          ] =
            React.useState(
              false,
            );


          return (
            <Popover
              open={open}
              onOpenChange={
                setOpen
              }
            >
              <PopoverTrigger
                asChild
              >
                <Pressable
                  data-testid="trigger"
                >
                  Open
                </Pressable>
              </PopoverTrigger>
            </Popover>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const trigger =
          getByTestId(
            container,
            "trigger",
          );


        expect(
          trigger.getAttribute(
            "aria-expanded",
          ),
        ).toBe(
          "false",
        );


        clickElement(
          trigger,
        );


        expect(
          trigger.getAttribute(
            "aria-expanded",
          ),
        ).toBe(
          "true",
        );
      },
    );


    it(
      "lets the Popover child cancel slot and internal activation progressively",
      () => {
        const slotClick =
          vi.fn();


        function Harness() {
          const [
            open,
            setOpen,
          ] =
            React.useState(
              false,
            );


          return (
            <Popover
              open={open}
              onOpenChange={
                setOpen
              }
              slotProps={{
                trigger: {
                  onClick:
                    slotClick,
                },
              }}
            >
              <PopoverTrigger
                asChild
              >
                <button
                  type="button"
                  data-testid="trigger"
                  onClick={(
                    event,
                  ) => {
                    event.preventDefault();
                  }}
                >
                  Open
                </button>
              </PopoverTrigger>
            </Popover>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const trigger =
          getByTestId(
            container,
            "trigger",
          );


        clickElement(
          trigger,
        );


        expect(
          slotClick,
        ).not.toHaveBeenCalled();

        expect(
          trigger.getAttribute(
            "aria-expanded",
          ),
        ).toBe(
          "false",
        );
      },
    );
  },
);
