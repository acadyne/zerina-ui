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
  CommandPalette,
  OverlayProvider,
} from "zerina-ui";

import {
  renderDOM,
  setNativeInputValue,
} from "./react-dom-test-utils";


function renderPalette(
  node:
    React.ReactElement,
): void {
  renderDOM(
    <OverlayProvider
      ownerDocument={
        document
      }
    >
      {node}
    </OverlayProvider>,
  );
}


function dispatchKey(
  element:
    HTMLElement,
  key:
    string,
): void {
  act(
    () => {
      element.dispatchEvent(
        new KeyboardEvent(
          "keydown",
          {
            bubbles:
              true,

            cancelable:
              true,

            key,
          },
        ),
      );
    },
  );
}


describe(
  "CommandPalette behavior",
  () => {
    it(
      "keeps listbox identity and option ids under semantic ownership",
      () => {
        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "a/b",

                label:
                  "Slash",
              },
              {
                id:
                  "a?b",

                label:
                  "Question",
              },
            ]}
            slotProps={{
              list: {
                id:
                  "consumer-list",

                role:
                  "tree",
              },
            }}
          />,
        );


        const input =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );

        const list =
          document.body.querySelector<HTMLElement>(
            "[data-ui-command-palette-list]",
          );

        const options =
          Array.from(
            document.body.querySelectorAll<HTMLElement>(
              '[role="option"]',
            ),
          );


        expect(
          input,
        ).not.toBeNull();

        expect(
          list,
        ).not.toBeNull();

        expect(
          list?.getAttribute(
            "role",
          ),
        ).toBe(
          "listbox",
        );

        expect(
          list?.id,
        ).not.toBe(
          "consumer-list",
        );

        expect(
          input?.getAttribute(
            "aria-controls",
          ),
        ).toBe(
          list?.id,
        );

        expect(
          input?.getAttribute(
            "aria-activedescendant",
          ),
        ).toBe(
          options[0]?.id,
        );

        expect(
          options,
        ).toHaveLength(
          2,
        );

        expect(
          options[0]?.id,
        ).not.toBe(
          options[1]?.id,
        );

        for (
          const option of
          options
        ) {
          expect(
            option.tabIndex,
          ).toBe(
            -1,
          );
        }
      },
    );


    it(
      "keeps keyboard focus on the combobox while selecting the active option",
      () => {
        const firstSelect =
          vi.fn();

        const secondSelect =
          vi.fn();


        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "first",

                label:
                  "First",

                onSelect:
                  firstSelect,
              },
              {
                id:
                  "second",

                label:
                  "Second",

                onSelect:
                  secondSelect,
              },
            ]}
          />,
        );


        const input =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );


        if (!input) {
          throw new Error(
            "CommandPalette combobox was not rendered.",
          );
        }


        act(
          () => {
            input.focus();
          },
        );

        expect(
          document.activeElement,
        ).toBe(
          input,
        );


        dispatchKey(
          input,
          "ArrowDown",
        );

        dispatchKey(
          input,
          "Enter",
        );


        expect(
          firstSelect,
        ).not.toHaveBeenCalled();

        expect(
          secondSelect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          document.activeElement,
        ).toBe(
          input,
        );
      },
    );


    it(
      "exposes disabled option state without adding it to the tab order",
      () => {
        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "disabled",

                label:
                  "Disabled",

                disabled:
                  true,
              },
              {
                id:
                  "enabled",

                label:
                  "Enabled",
              },
            ]}
          />,
        );


        const disabledOption =
          document.body.querySelector<HTMLButtonElement>(
            '[role="option"][aria-disabled="true"]',
          );


        expect(
          disabledOption,
        ).not.toBeNull();

        expect(
          disabledOption?.disabled,
        ).toBe(
          true,
        );

        expect(
          disabledOption?.tabIndex,
        ).toBe(
          -1,
        );
      },
    );


    it(
      "runs the input slot before the internal search commit",
      () => {
        const calls:
          string[] = [];


        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "alpha",

                label:
                  "Alpha",
              },
            ]}
            onValueChange={() => {
              calls.push(
                "value",
              );
            }}
            slotProps={{
              input: {
                onChange: () => {
                  calls.push(
                    "slot",
                  );
                },
              },
            }}
          />,
        );


        const input =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );


        if (!input) {
          throw new Error(
            "CommandPalette combobox was not rendered.",
          );
        }


        setNativeInputValue(
          input,
          "alpha",
        );


        expect(
          calls,
        ).toEqual([
          "slot",
          "value",
        ]);

        expect(
          input.value,
        ).toBe(
          "alpha",
        );
      },
    );


    it(
      "lets the input slot cancel the internal search commit",
      () => {
        const onValueChange =
          vi.fn();


        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "alpha",

                label:
                  "Alpha",
              },
            ]}
            defaultValue=""
            onValueChange={
              onValueChange
            }
            slotProps={{
              input: {
                onChange: (
                  event,
                ) => {
                  event.preventDefault();
                },
              },
            }}
          />,
        );


        const input =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );


        if (!input) {
          throw new Error(
            "CommandPalette combobox was not rendered.",
          );
        }


        setNativeInputValue(
          input,
          "alpha",
        );


        expect(
          onValueChange,
        ).not.toHaveBeenCalled();

        expect(
          input.value,
        ).toBe(
          "",
        );
      },
    );


    it(
      "uses shared controllable-value semantics when search state is uncontrolled",
      () => {
        const uncontrolledChange =
          vi.fn();


        renderPalette(
          <CommandPalette
            open
            onOpenChange={() => {}}
            items={[
              {
                id:
                  "alpha",

                label:
                  "Alpha",
              },
            ]}
            defaultValue=""
            onValueChange={
              uncontrolledChange
            }
          />,
        );


        const uncontrolledInput =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );


        if (!uncontrolledInput) {
          throw new Error(
            "Uncontrolled CommandPalette combobox was not rendered.",
          );
        }


        setNativeInputValue(
          uncontrolledInput,
          "alpha",
        );


        expect(
          uncontrolledInput.value,
        ).toBe(
          "alpha",
        );

        expect(
          uncontrolledChange,
        ).toHaveBeenLastCalledWith(
          "alpha",
        );
      },
    );


    it(
      "keeps controlled CommandPalette search state owned by the public value",
      () => {
        const controlledChange =
          vi.fn();


        function ControlledHarness() {
          const [
            revision,
            setRevision,
          ] =
            React.useState(
              0,
            );


          return (
            <>
              <span data-testid="revision">
                {revision}
              </span>

              <CommandPalette
                open
                onOpenChange={() => {}}
                items={[
                  {
                    id:
                      "alpha",

                    label:
                      "Alpha",
                  },
                ]}
                value="fixed"
                onValueChange={(
                  nextValue,
                ) => {
                  controlledChange(
                    nextValue,
                  );

                  setRevision(
                    (
                      current,
                    ) =>
                      current +
                      1,
                  );
                }}
              />
            </>
          );
        }


        renderPalette(
          <ControlledHarness />,
        );


        const controlledInput =
          document.body.querySelector<HTMLInputElement>(
            '[role="combobox"]',
          );


        if (!controlledInput) {
          throw new Error(
            "Controlled CommandPalette combobox was not rendered.",
          );
        }


        setNativeInputValue(
          controlledInput,
          "attempted",
        );


        expect(
          controlledChange,
        ).toHaveBeenLastCalledWith(
          "attempted",
        );

        expect(
          controlledInput.value,
        ).toBe(
          "fixed",
        );
      },
    );
  },
);
