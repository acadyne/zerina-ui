import {
  act,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  SearchInput,
  Select,
  Toast,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function dispatchCancelableEvent(
  element:
    EventTarget,
  type:
    string,
): void {
  act(
    () => {
      element.dispatchEvent(
        new Event(
          type,
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


function dispatchCancelableFocusEvent(
  element:
    EventTarget,
  type:
    "focusin" | "focusout",
): void {
  act(
    () => {
      element.dispatchEvent(
        new FocusEvent(
          type,
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


function dispatchInputValue(
  input:
    HTMLInputElement,
  value:
    string,
): void {
  const setter =
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;


  if (!setter) {
    throw new Error(
      "Native input value setter was not found.",
    );
  }


  act(
    () => {
      setter.call(
        input,
        value,
      );

      input.dispatchEvent(
        new Event(
          "input",
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
  "consumer event-layer contract",
  () => {
    it(
      "runs Select public handlers before control-slot handlers",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Select
              data-testid="select"
              value="a"
              onChange={() => {
                calls.push(
                  "public-change",
                );
              }}
              onFocus={() => {
                calls.push(
                  "public-focus",
                );
              }}
              slotProps={{
                control: {
                  onChange: () => {
                    calls.push(
                      "slot-change",
                    );
                  },

                  onFocus: () => {
                    calls.push(
                      "slot-focus",
                    );
                  },
                },
              }}
              options={[
                {
                  label:
                    "A",

                  value:
                    "a",
                },

                {
                  label:
                    "B",

                  value:
                    "b",
                },
              ]}
            />,
          );

        const select =
          getByTestId<HTMLSelectElement>(
            container,
            "select",
          );


        dispatchCancelableFocusEvent(
          select,
          "focusin",
        );

        dispatchCancelableEvent(
          select,
          "change",
        );


        expect(
          calls,
        ).toEqual([
          "public-focus",
          "slot-focus",
          "public-change",
          "slot-change",
        ]);

        expect(
          select.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );
      },
    );


    it(
      "lets Select public cancellation stop the slot and focus behavior",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Select
              data-testid="select"
              value="a"
              onChange={(
                event,
              ) => {
                calls.push(
                  "public-change",
                );

                event.preventDefault();
              }}
              onFocus={(
                event,
              ) => {
                calls.push(
                  "public-focus",
                );

                event.preventDefault();
              }}
              slotProps={{
                control: {
                  onChange: () => {
                    calls.push(
                      "slot-change",
                    );
                  },

                  onFocus: () => {
                    calls.push(
                      "slot-focus",
                    );
                  },
                },
              }}
              options={[
                {
                  label:
                    "A",

                  value:
                    "a",
                },
              ]}
            />,
          );

        const select =
          getByTestId<HTMLSelectElement>(
            container,
            "select",
          );


        dispatchCancelableFocusEvent(
          select,
          "focusin",
        );

        dispatchCancelableEvent(
          select,
          "change",
        );


        expect(
          calls,
        ).toEqual([
          "public-focus",
          "public-change",
        ]);

        expect(
          select.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "runs SearchInput public change, then slot, then domain commit",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <SearchInput
              data-testid="search"
              onChange={() => {
                calls.push(
                  "public",
                );
              }}
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
          getByTestId<HTMLInputElement>(
            container,
            "search",
          );


        dispatchInputValue(
          input,
          "next",
        );


        expect(
          calls,
        ).toEqual([
          "public",
          "slot",
          "value",
        ]);

        expect(
          input.value,
        ).toBe(
          "next",
        );
      },
    );


    it(
      "lets SearchInput public or slot cancellation stop later layers",
      () => {
        const publicCalls:
          string[] = [];

        const firstContainer =
          renderDOM(
            <SearchInput
              data-testid="public-cancel"
              onChange={(
                event,
              ) => {
                publicCalls.push(
                  "public",
                );

                event.preventDefault();
              }}
              onValueChange={() => {
                publicCalls.push(
                  "value",
                );
              }}
              slotProps={{
                input: {
                  onChange: () => {
                    publicCalls.push(
                      "slot",
                    );
                  },
                },
              }}
            />,
          );

        dispatchInputValue(
          getByTestId<HTMLInputElement>(
            firstContainer,
            "public-cancel",
          ),
          "first",
        );


        expect(
          publicCalls,
        ).toEqual([
          "public",
        ]);


        const slotCalls:
          string[] = [];

        const secondContainer =
          renderDOM(
            <SearchInput
              data-testid="slot-cancel"
              onChange={() => {
                slotCalls.push(
                  "public",
                );
              }}
              onValueChange={() => {
                slotCalls.push(
                  "value",
                );
              }}
              slotProps={{
                input: {
                  onChange: (
                    event,
                  ) => {
                    slotCalls.push(
                      "slot",
                    );

                    event.preventDefault();
                  },
                },
              }}
            />,
          );

        dispatchInputValue(
          getByTestId<HTMLInputElement>(
            secondContainer,
            "slot-cancel",
          ),
          "second",
        );


        expect(
          slotCalls,
        ).toEqual([
          "public",
          "slot",
        ]);
      },
    );


    it(
      "makes Toast pause entry cancelable in public-slot-internal order",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Toast
              data-testid="toast"
              title="Toast"
              onPointerEnter={() => {
                calls.push(
                  "public",
                );
              }}
              onPauseAutoDismiss={(
                reason,
              ) => {
                calls.push(
                  `internal:${reason}`,
                );
              }}
              slotProps={{
                root: {
                  onPointerEnter: () => {
                    calls.push(
                      "slot",
                    );
                  },
                },
              }}
            />,
          );

        const toast =
          getByTestId(
            container,
            "toast",
          );


        dispatchCancelableEvent(
          toast,
          "pointerover",
        );


        expect(
          calls,
        ).toEqual([
          "public",
          "slot",
          "internal:pointer",
        ]);
      },
    );


    it(
      "lets Toast entry cancellation stop later pause layers",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Toast
              data-testid="toast"
              title="Toast"
              onPointerEnter={(
                event,
              ) => {
                calls.push(
                  "public",
                );

                event.preventDefault();
              }}
              onPauseAutoDismiss={() => {
                calls.push(
                  "internal",
                );
              }}
              slotProps={{
                root: {
                  onPointerEnter: () => {
                    calls.push(
                      "slot",
                    );
                  },
                },
              }}
            />,
          );

        const toast =
          getByTestId(
            container,
            "toast",
          );


        dispatchCancelableEvent(
          toast,
          "pointerover",
        );


        expect(
          calls,
        ).toEqual([
          "public",
        ]);
      },
    );


    it(
      "keeps Toast pointer-leave cleanup non-cancelable",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Toast
              data-testid="toast"
              title="Toast"
              onPointerLeave={(
                event,
              ) => {
                calls.push(
                  "public",
                );

                event.preventDefault();
              }}
              onResumeAutoDismiss={(
                reason,
              ) => {
                calls.push(
                  `internal:${reason}`,
                );
              }}
              slotProps={{
                root: {
                  onPointerLeave: (
                    event,
                  ) => {
                    calls.push(
                      "slot",
                    );

                    event.preventDefault();
                  },
                },
              }}
            />,
          );

        const toast =
          getByTestId(
            container,
            "toast",
          );


        dispatchCancelableEvent(
          toast,
          "pointerout",
        );


        expect(
          calls,
        ).toEqual([
          "public",
          "slot",
          "internal:pointer",
        ]);
      },
    );


    it(
      "applies the same cancelable-entry and mandatory-cleanup rule to Toast focus",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <Toast
              data-testid="toast"
              title="Toast"
              onFocusCapture={() => {
                calls.push(
                  "public-focus",
                );
              }}
              onBlurCapture={(
                event,
              ) => {
                calls.push(
                  "public-blur",
                );

                event.preventDefault();
              }}
              onPauseAutoDismiss={(
                reason,
              ) => {
                calls.push(
                  `pause:${reason}`,
                );
              }}
              onResumeAutoDismiss={(
                reason,
              ) => {
                calls.push(
                  `resume:${reason}`,
                );
              }}
              slotProps={{
                root: {
                  onFocusCapture: () => {
                    calls.push(
                      "slot-focus",
                    );
                  },

                  onBlurCapture: (
                    event,
                  ) => {
                    calls.push(
                      "slot-blur",
                    );

                    event.preventDefault();
                  },
                },
              }}
            />,
          );

        const toast =
          getByTestId(
            container,
            "toast",
          );


        dispatchCancelableFocusEvent(
          toast,
          "focusin",
        );

        dispatchCancelableFocusEvent(
          toast,
          "focusout",
        );


        expect(
          calls,
        ).toEqual([
          "public-focus",
          "slot-focus",
          "pause:focus",
          "public-blur",
          "slot-blur",
          "resume:focus",
        ]);
      },
    );
  },
);
