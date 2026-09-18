import React from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Collapsible,
  CollapsibleTrigger,
} from "zerina-ui";

import {
  useControllableValue,
} from "../../src/core/react/useControllableValue";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase B4 controllable-value behavior",
  () => {
    it(
      "ignores internal writes while controlled and preserves the last uncontrolled value",
      () => {
        function Harness() {
          const [
            controlled,
            setControlled,
          ] =
            React.useState(
              true,
            );

          const state =
            useControllableValue<string>({
              value:
                controlled
                  ? "controlled"
                  : undefined,

              defaultValue:
                "default",
            });


          return (
            <>
              <output
                data-testid="value"
              >
                {state.value}
              </output>

              <button
                type="button"
                data-testid="write"
                onClick={() => {
                  state
                    .setUncontrolledValue(
                      "internal",
                    );
                }}
              >
                Write
              </button>

              <button
                type="button"
                data-testid="toggle"
                onClick={() => {
                  setControlled(
                    (
                      current,
                    ) =>
                      !current,
                  );
                }}
              >
                Toggle
              </button>
            </>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const value =
          getByTestId(
            container,
            "value",
          );


        expect(
          value.textContent,
        ).toBe(
          "controlled",
        );


        clickElement(
          getByTestId(
            container,
            "write",
          ),
        );

        expect(
          value.textContent,
        ).toBe(
          "controlled",
        );


        clickElement(
          getByTestId(
            container,
            "toggle",
          ),
        );

        expect(
          value.textContent,
        ).toBe(
          "default",
        );


        clickElement(
          getByTestId(
            container,
            "write",
          ),
        );

        expect(
          value.textContent,
        ).toBe(
          "internal",
        );


        clickElement(
          getByTestId(
            container,
            "toggle",
          ),
        );

        expect(
          value.textContent,
        ).toBe(
          "controlled",
        );


        clickElement(
          getByTestId(
            container,
            "toggle",
          ),
        );

        expect(
          value.textContent,
        ).toBe(
          "internal",
        );
      },
    );


    it(
      "lets an uncontrolled Collapsible commit before notifying",
      () => {
        const onOpenChange =
          vi.fn();


        const container =
          renderDOM(
            <Collapsible
              defaultOpen={
                false
              }
              onOpenChange={
                onOpenChange
              }
            >
              <CollapsibleTrigger
                showIcon={
                  false
                }
              >
                Toggle
              </CollapsibleTrigger>
            </Collapsible>,
          );

        const trigger =
          container.querySelector<HTMLButtonElement>(
            "button",
          );


        if (!trigger) {
          throw new Error(
            "Collapsible trigger was not found.",
          );
        }


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

        expect(
          onOpenChange,
        ).toHaveBeenCalledWith(
          true,
        );
      },
    );


    it(
      "notifies a controlled Collapsible without committing rejected state",
      () => {
        const onOpenChange =
          vi.fn();


        const container =
          renderDOM(
            <Collapsible
              open={
                false
              }
              onOpenChange={
                onOpenChange
              }
            >
              <CollapsibleTrigger
                showIcon={
                  false
                }
              >
                Toggle
              </CollapsibleTrigger>
            </Collapsible>,
          );

        const trigger =
          container.querySelector<HTMLButtonElement>(
            "button",
          );


        if (!trigger) {
          throw new Error(
            "Collapsible trigger was not found.",
          );
        }


        clickElement(
          trigger,
        );


        expect(
          onOpenChange,
        ).toHaveBeenCalledWith(
          true,
        );

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
