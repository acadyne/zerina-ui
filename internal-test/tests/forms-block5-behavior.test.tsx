import {
  createRef,
  useState,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Input,
  InputAdornment,
  InputGroup,
  PasswordInput,
  SearchInput,
  Select,
  Textarea,
} from "zerina-ui";

import {
  clickElement,
  getByTestId,
  renderDOM,
  setNativeInputValue,
} from "./react-dom-test-utils";


describe(
  "Block 5 compound control behavior",
  () => {
    it(
      "preserves InputAdornment position, refs, className, style and slot props",
      () => {
        const ref =
          createRef<HTMLDivElement>();

        const container =
          renderDOM(
            <InputGroup>
              <InputAdornment
                ref={ref}
                data-testid="direct-adornment"
                position="start"
                className="direct-class"
                style={{
                  width:
                    "31px",
                }}
                slotProps={{
                  root: {
                    className:
                      "slot-class",

                    title:
                      "slot title",

                    style: {
                      height:
                        "19px",
                    },
                  },
                }}
              >
                Start
              </InputAdornment>

              <InputAdornment
                data-testid="end-adornment"
                position="end"
              >
                End
              </InputAdornment>

              <Input />
            </InputGroup>,
          );

        const start =
          getByTestId<HTMLDivElement>(
            container,
            "direct-adornment",
          );

        const end =
          getByTestId<HTMLDivElement>(
            container,
            "end-adornment",
          );


        expect(
          ref.current,
        ).toBe(
          start,
        );

        expect(
          start.getAttribute(
            "data-position",
          ),
        ).toBe(
          "start",
        );

        expect(
          end.getAttribute(
            "data-position",
          ),
        ).toBe(
          "end",
        );

        expect(
          start.className,
        ).toContain(
          "direct-class",
        );

        expect(
          start.className,
        ).toContain(
          "slot-class",
        );

        expect(
          start.title,
        ).toBe(
          "slot title",
        );

        expect(
          start.style.width,
        ).toBe(
          "31px",
        );

        expect(
          start.style.height,
        ).toBe(
          "19px",
        );
      },
    );


    it(
      "propagates restrictive group semantics to native controls",
      () => {
        const container =
          renderDOM(
            <InputGroup
              disabled
              invalid
              required
              readOnly
            >
              <Input
                data-testid="group-input"
              />

              <Textarea
                data-testid="group-textarea"
              />

              <Select
                data-testid="group-select"
                value="a"
                onChange={() => {}}
                options={[
                  {
                    label:
                      "Option A",

                    value:
                      "a",
                  },
                ]}
              />
            </InputGroup>,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "group-input",
          );

        const textarea =
          getByTestId<HTMLTextAreaElement>(
            container,
            "group-textarea",
          );

        const select =
          getByTestId<HTMLSelectElement>(
            container,
            "group-select",
          );


        for (
          const control of [
            input,
            textarea,
            select,
          ]
        ) {
          expect(
            control.disabled,
          ).toBe(
            true,
          );

          expect(
            control.required,
          ).toBe(
            true,
          );

          expect(
            control.getAttribute(
              "aria-invalid",
            ),
          ).toBe(
            "true",
          );

          expect(
            control.getAttribute(
              "aria-readonly",
            ),
          ).toBe(
            "true",
          );

          expect(
            control.getAttribute(
              "data-in-group",
            ),
          ).toBe(
            "true",
          );
        }


        expect(
          input.readOnly,
        ).toBe(
          true,
        );

        expect(
          textarea.readOnly,
        ).toBe(
          true,
        );
      },
    );


    it(
      "clears controlled SearchInput and invokes both callbacks",
      () => {
        const onClear =
          vi.fn();

        const onValueChange =
          vi.fn();


        function Harness() {
          const [
            value,
            setValue,
          ] =
            useState(
              "controlled query",
            );


          return (
            <SearchInput
              data-testid="controlled-search"
              value={value}
              onClear={
                onClear
              }
              onValueChange={(
                nextValue,
              ) => {
                onValueChange(
                  nextValue,
                );

                setValue(
                  nextValue,
                );
              }}
            />
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "controlled-search",
          );

        const clear =
          container.querySelector<HTMLButtonElement>(
            '[data-ui-search-input-clear-button], [data-ui="control-action"]',
          );


        expect(
          clear,
        ).not.toBeNull();

        if (!clear) {
          throw new Error(
            "Controlled SearchInput clear action was not rendered.",
          );
        }


        clickElement(
          clear,
        );


        expect(
          input.value,
        ).toBe(
          "",
        );

        expect(
          onClear,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onValueChange,
        ).toHaveBeenCalledWith(
          "",
        );
      },
    );


    it(
      "composes slot input onChange with value and direct handlers",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <SearchInput
              slotProps={{
                input: {
                  "data-testid":
                    "search-slot-input",

                  onChange: () => {
                    calls.push(
                      "slot",
                    );
                  },
                },
              }}
              onValueChange={() => {
                calls.push(
                  "value",
                );
              }}
              onChange={() => {
                calls.push(
                  "direct",
                );
              }}
            />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "search-slot-input",
          );


        setNativeInputValue(
          input,
          "next",
        );


        expect(
          calls,
        ).toEqual([
          "direct",
          "slot",
          "value",
        ]);
      },
    );


    it(
      "forwards complete SearchInput slot props",
      () => {
        const container =
          renderDOM(
            <SearchInput
              defaultValue="query"
              slotProps={{
                group: {
                  "data-testid":
                    "search-group-slot",

                  className:
                    "group-slot",

                  title:
                    "group",
                },

                startAdornment: {
                  "data-testid":
                    "search-start-slot",
                },

                icon: {
                  "data-testid":
                    "search-icon-slot",
                },

                input: {
                  "data-testid":
                    "search-input-slot",

                  className:
                    "input-slot",
                },

                endAdornment: {
                  "data-testid":
                    "search-end-slot",
                },

                clearButton: {
                  "data-testid":
                    "search-clear-slot",

                  title:
                    "clear",
                },
              }}
            />,
          );


        for (
          const testId of [
            "search-group-slot",
            "search-start-slot",
            "search-icon-slot",
            "search-input-slot",
            "search-end-slot",
            "search-clear-slot",
          ]
        ) {
          expect(
            getByTestId(
              container,
              testId,
            ),
          ).toBeTruthy();
        }


        expect(
          getByTestId(
            container,
            "search-group-slot",
          ).className,
        ).toContain(
          "group-slot",
        );

        expect(
          getByTestId(
            container,
            "search-input-slot",
          ).className,
        ).toContain(
          "input-slot",
        );

        expect(
          getByTestId(
            container,
            "search-clear-slot",
          ).title,
        ).toBe(
          "clear",
        );
      },
    );


    it(
      "forwards PasswordInput slots and updates toggle semantics",
      () => {
        const container =
          renderDOM(
            <PasswordInput
              defaultValue="secret"
              showLabel="Show secret"
              hideLabel="Hide secret"
              slotProps={{
                group: {
                  "data-testid":
                    "password-group-slot",
                },

                input: {
                  "data-testid":
                    "password-input-slot",
                },

                endAdornment: {
                  "data-testid":
                    "password-end-slot",
                },

                toggleButton: {
                  "data-testid":
                    "password-toggle-slot",
                },
              }}
            />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "password-input-slot",
          );

        const toggle =
          getByTestId<HTMLButtonElement>(
            container,
            "password-toggle-slot",
          );


        expect(
          input.type,
        ).toBe(
          "password",
        );

        expect(
          toggle.getAttribute(
            "aria-label",
          ),
        ).toBe(
          "Show secret",
        );

        expect(
          toggle.getAttribute(
            "aria-pressed",
          ),
        ).toBe(
          "false",
        );


        clickElement(
          toggle,
        );


        expect(
          input.type,
        ).toBe(
          "text",
        );

        expect(
          toggle.getAttribute(
            "aria-label",
          ),
        ).toBe(
          "Hide secret",
        );

        expect(
          toggle.getAttribute(
            "aria-pressed",
          ),
        ).toBe(
          "true",
        );

        expect(
          getByTestId(
            container,
            "password-group-slot",
          ),
        ).toBeTruthy();

        expect(
          getByTestId(
            container,
            "password-end-slot",
          ),
        ).toBeTruthy();
      },
    );
  },
);


describe(
  "Block 5 slot action composition",
  () => {
    it(
      "runs the SearchInput clearButton slot before the internal clear",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <SearchInput
              data-testid="composed-search"
              defaultValue="query"
              onClear={() => {
                calls.push(
                  "internal",
                );
              }}
              slotProps={{
                clearButton: {
                  "data-testid":
                    "composed-clear",

                  onPress: () => {
                    calls.push(
                      "slot",
                    );
                  },
                },
              }}
            />,
          );

        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "composed-clear",
          ),
        );

        expect(
          calls,
        ).toEqual([
          "slot",
          "internal",
        ]);

        expect(
          getByTestId<HTMLInputElement>(
            container,
            "composed-search",
          ).value,
        ).toBe(
          "",
        );
      },
    );


    it(
      "runs the PasswordInput toggleButton slot before the internal toggle",
      () => {
        const calls:
          string[] = [];

        const container =
          renderDOM(
            <PasswordInput
              data-testid="composed-password"
              defaultValue="secret"
              slotProps={{
                toggleButton: {
                  "data-testid":
                    "composed-toggle",

                  onPress: () => {
                    const input =
                      getByTestId<HTMLInputElement>(
                        container,
                        "composed-password",
                      );

                    calls.push(
                      input.type,
                    );
                  },
                },
              }}
            />,
          );

        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "composed-toggle",
          ),
        );

        expect(
          calls,
        ).toEqual([
          "password",
        ]);

        expect(
          getByTestId<HTMLInputElement>(
            container,
            "composed-password",
          ).type,
        ).toBe(
          "text",
        );
      },
    );
  },
);


describe(
  "Block 5 slot action cancellation",
  () => {
    it(
      "lets the SearchInput clearButton slot cancel the internal clear",
      () => {
        const slotPress =
          vi.fn(
            (
              event,
            ) => {
              event.preventDefault();
            },
          );

        const onClear =
          vi.fn();

        const onValueChange =
          vi.fn();


        const container =
          renderDOM(
            <SearchInput
              data-testid="cancelable-search"
              defaultValue="query"
              onClear={
                onClear
              }
              onValueChange={
                onValueChange
              }
              slotProps={{
                clearButton: {
                  "data-testid":
                    "cancel-clear",

                  onPress:
                    slotPress,
                },
              }}
            />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "cancelable-search",
          );

        const clear =
          getByTestId<HTMLButtonElement>(
            container,
            "cancel-clear",
          );


        clickElement(
          clear,
        );


        expect(
          slotPress,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          input.value,
        ).toBe(
          "query",
        );

        expect(
          onClear,
        ).not.toHaveBeenCalled();

        expect(
          onValueChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "lets the PasswordInput toggleButton slot cancel the internal toggle",
      () => {
        const slotPress =
          vi.fn(
            (
              event,
            ) => {
              event.preventDefault();
            },
          );


        const container =
          renderDOM(
            <PasswordInput
              data-testid="cancelable-password"
              defaultValue="secret"
              slotProps={{
                toggleButton: {
                  "data-testid":
                    "cancel-toggle",

                  onPress:
                    slotPress,
                },
              }}
            />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "cancelable-password",
          );

        const toggle =
          getByTestId<HTMLButtonElement>(
            container,
            "cancel-toggle",
          );


        expect(
          input.type,
        ).toBe(
          "password",
        );


        clickElement(
          toggle,
        );


        expect(
          slotPress,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          input.type,
        ).toBe(
          "password",
        );
      },
    );
  },
);
