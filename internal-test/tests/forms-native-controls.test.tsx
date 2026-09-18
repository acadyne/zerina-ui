import {
  act,
  type ComponentProps,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Field,
  Input,
  InputGroup,
  InputAdornment,
  Select,
  Textarea,
} from "zerina-ui";

import {
  dispatchSelectChange,
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Input and Textarea semantics",
  () => {
    it(
      "propagates native and ARIA state to Input",
      () => {
        const container =
          renderDOM(
            <Field
              disabled
              invalid
              required
              readOnly
            >
              <Input
                data-testid="control"
              />
            </Field>,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        expect(
          input.disabled,
        ).toBe(
          true,
        );


        expect(
          input.required,
        ).toBe(
          true,
        );


        expect(
          input.readOnly,
        ).toBe(
          true,
        );


        expect(
          input.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          input.getAttribute(
            "aria-required",
          ),
        ).toBe(
          "true",
        );


        expect(
          input.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );
      },
    );


    it(
      "propagates native and ARIA state to Textarea",
      () => {
        const container =
          renderDOM(
            <Field
              disabled
              invalid
              required
              readOnly
            >
              <Textarea
                data-testid="control"
              />
            </Field>,
          );


        const textarea =
          getByTestId<HTMLTextAreaElement>(
            container,
            "control",
          );


        expect(
          textarea.disabled,
        ).toBe(
          true,
        );


        expect(
          textarea.required,
        ).toBe(
          true,
        );


        expect(
          textarea.readOnly,
        ).toBe(
          true,
        );


        expect(
          textarea.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          textarea.getAttribute(
            "aria-required",
          ),
        ).toBe(
          "true",
        );


        expect(
          textarea.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );
      },
    );
  },
);


describe(
  "Select semantics",
  () => {
    it(
      "inherits invalid, required and readOnly without becoming disabled",
      () => {
        const container =
          renderDOM(
            <Field
              invalid
              required
              readOnly
            >
              <Select
                data-testid="control"
                value="a"
                onChange={
                  vi.fn()
                }
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
              />
            </Field>,
          );


        const select =
          getByTestId<HTMLSelectElement>(
            container,
            "control",
          );


        expect(
          select.disabled,
        ).toBe(
          false,
        );


        expect(
          select.required,
        ).toBe(
          true,
        );


        expect(
          select.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          select.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        expect(
          select.getAttribute(
            "data-readonly",
          ),
        ).toBe(
          "true",
        );
      },
    );


    it(
      "keeps a read-only Select focusable and blocks onChange",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Select
              data-testid="control"
              value="a"
              readOnly
              onChange={
                onChange
              }
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
            "control",
          );


        focusElement(
          select,
        );


        expect(
          document.activeElement,
        ).toBe(
          select,
        );


        dispatchSelectChange(
          select,
          "b",
        );


        expect(
          onChange,
        ).not.toHaveBeenCalled();


        expect(
          select.value,
        ).toBe(
          "a",
        );
      },
    );


    it(
      "preserves native disabled behavior",
      () => {
        const container =
          renderDOM(
            <Select
              data-testid="control"
              value="a"
              disabled
              onChange={
                vi.fn()
              }
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


        expect(
          getByTestId<HTMLSelectElement>(
            container,
            "control",
          ).disabled,
        ).toBe(
          true,
        );
      },
    );
  },
);


describe(
  "InputGroup visual composition",
  () => {
    it(
      "keeps visual composition while states are propagated by context",
      () => {
        const container =
          renderDOM(
            <InputGroup
              data-testid="group"
              rounded="12px"
              invalid
              required
              readOnly
            >
              <Input
                data-testid="control"
                rightPadding="40px"
              />

              <InputAdornment
                data-testid="right"
                position="end"
                width="30px"
              >
                Action
              </InputAdornment>
            </InputGroup>,
          );


        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        const right =
          getByTestId<HTMLDivElement>(
            container,
            "right",
          );


        expect(
          group.style.getPropertyValue(
            "--ui-input-group-radius",
          ),
        ).toBe(
          "12px",
        );


        expect(
          group.getAttribute(
            "data-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          group.getAttribute(
            "data-required",
          ),
        ).toBe(
          "true",
        );


        expect(
          group.getAttribute(
            "data-readonly",
          ),
        ).toBe(
          "true",
        );


        expect(
          input.style.paddingRight,
        ).toBe(
          "40px",
        );


        expect(
          input.required,
        ).toBe(
          true,
        );


        expect(
          input.readOnly,
        ).toBe(
          true,
        );


        expect(
          right.style.position,
        ).toBe(
          "absolute",
        );


        expect(
          right.style.width,
        ).toBe(
          "30px",
        );
      },
    );
  },
);


// BLOCK 4: TEXT CONTROL CONTRACT

type Block4ControlSize =
  | "sm"
  | "md"
  | "lg";


const BLOCK4_CONTROL_SIZES:
  readonly Block4ControlSize[] = [
    "sm",
    "md",
    "lg",
  ];


function block4BlurElement(
  element:
    HTMLElement,
): void {
  act(
    () => {
      element.blur();
    },
  );
}


function expectBlock4ControlAttributes(
  element:
    HTMLElement,
  identity:
    "input" |
    "textarea" |
    "select",
): void {
  expect(
    element.hasAttribute(
      "data-ui-control",
    ),
  ).toBe(
    true,
  );


  expect(
    element.getAttribute(
      "data-ui",
    ),
  ).toBe(
    identity,
  );


  expect(
    element.getAttribute(
      "data-size",
    ),
  ).toBe(
    "lg",
  );


  expect(
    element.getAttribute(
      "data-variant",
    ),
  ).toBe(
    "unstyled",
  );


  for (
    const attribute of [
      "data-invalid",
      "data-disabled",
      "data-required",
      "data-readonly",
    ]
  ) {
    expect(
      element.hasAttribute(
        attribute,
      ),
      `${identity} should emit ${attribute}`,
    ).toBe(
      true,
    );
  }


  expect(
    element.hasAttribute(
      "data-focus",
    ),
  ).toBe(
    false,
  );
}


describe(
  "Block 4 text-control attributes",
  () => {
    it(
      "Input emits generic state and specific identity",
      () => {
        const container =
          renderDOM(
            <Input
              data-testid="block4-input"
              size="lg"
              variant="unstyled"
              disabled
              invalid
              required
              readOnly
            />,
          );


        expectBlock4ControlAttributes(
          getByTestId<HTMLInputElement>(
            container,
            "block4-input",
          ),
          "input",
        );
      },
    );


    it(
      "Textarea emits generic state and specific identity",
      () => {
        const container =
          renderDOM(
            <Textarea
              data-testid="block4-textarea"
              size="lg"
              variant="unstyled"
              disabled
              invalid
              required
              readOnly
            />,
          );


        expectBlock4ControlAttributes(
          getByTestId<HTMLTextAreaElement>(
            container,
            "block4-textarea",
          ),
          "textarea",
        );
      },
    );


    it(
      "Select emits generic state and specific identity",
      () => {
        const container =
          renderDOM(
            <Select
              data-testid="block4-select"
              size="lg"
              variant="unstyled"
              value="a"
              disabled
              invalid
              required
              readOnly
              onChange={
                vi.fn()
              }
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


        expectBlock4ControlAttributes(
          getByTestId<HTMLSelectElement>(
            container,
            "block4-select",
          ),
          "select",
        );
      },
    );


    it.each(
      BLOCK4_CONTROL_SIZES,
    )(
      "Input reflects size=%s",
      (
        size,
      ) => {
        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              size={size}
            />,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          ).getAttribute(
            "data-size",
          ),
        ).toBe(
          size,
        );
      },
    );


    it.each(
      BLOCK4_CONTROL_SIZES,
    )(
      "Textarea reflects size=%s",
      (
        size,
      ) => {
        const container =
          renderDOM(
            <Textarea
              data-testid="block4-control"
              size={size}
            />,
          );


        expect(
          getByTestId<HTMLTextAreaElement>(
            container,
            "block4-control",
          ).getAttribute(
            "data-size",
          ),
        ).toBe(
          size,
        );
      },
    );


    it.each(
      BLOCK4_CONTROL_SIZES,
    )(
      "Select reflects size=%s",
      (
        size,
      ) => {
        const container =
          renderDOM(
            <Select
              data-testid="block4-control"
              size={size}
              value="a"
              onChange={
                vi.fn()
              }
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


        expect(
          getByTestId<HTMLSelectElement>(
            container,
            "block4-control",
          ).getAttribute(
            "data-size",
          ),
        ).toBe(
          size,
        );
      },
    );
  },
);


describe(
  "Block 4 focus handlers",
  () => {
    it(
      "Input composes direct and slot focus handlers once",
      () => {
        const directFocus =
          vi.fn();


        const directBlur =
          vi.fn();


        const slotFocus =
          vi.fn();


        const slotBlur =
          vi.fn();


        const slotProps:
          NonNullable<
            ComponentProps<
              typeof Input
            >[
              "slotProps"
            ]
          > = {
            root: {
              onFocus:
                slotFocus,

              onBlur:
                slotBlur,
            },
          };


        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              onFocus={
                directFocus
              }
              onBlur={
                directBlur
              }
              slotProps={
                slotProps
              }
            />,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );


        focusElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );


        expect(
          directFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        block4BlurElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );


        expect(
          directBlur,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotBlur,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          control.hasAttribute(
            "data-focus",
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "Textarea composes direct and slot focus handlers once",
      () => {
        const directFocus =
          vi.fn();


        const directBlur =
          vi.fn();


        const slotFocus =
          vi.fn();


        const slotBlur =
          vi.fn();


        const slotProps:
          NonNullable<
            ComponentProps<
              typeof Textarea
            >[
              "slotProps"
            ]
          > = {
            root: {
              onFocus:
                slotFocus,

              onBlur:
                slotBlur,
            },
          };


        const container =
          renderDOM(
            <Textarea
              data-testid="block4-control"
              onFocus={
                directFocus
              }
              onBlur={
                directBlur
              }
              slotProps={
                slotProps
              }
            />,
          );


        const control =
          getByTestId<HTMLTextAreaElement>(
            container,
            "block4-control",
          );


        focusElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );


        expect(
          directFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        block4BlurElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );


        expect(
          directBlur,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotBlur,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );


    it(
      "Select composes direct and slot focus handlers once",
      () => {
        const directFocus =
          vi.fn();


        const directBlur =
          vi.fn();


        const slotFocus =
          vi.fn();


        const slotBlur =
          vi.fn();


        const slotProps:
          NonNullable<
            ComponentProps<
              typeof Select
            >[
              "slotProps"
            ]
          > = {
            control: {
              onFocus:
                slotFocus,

              onBlur:
                slotBlur,
            },
          };


        const container =
          renderDOM(
            <Select
              data-testid="block4-control"
              value="a"
              onChange={
                vi.fn()
              }
              onFocus={
                directFocus
              }
              onBlur={
                directBlur
              }
              slotProps={
                slotProps
              }
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


        const control =
          getByTestId<HTMLSelectElement>(
            container,
            "block4-control",
          );


        focusElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );


        expect(
          directFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotFocus,
        ).toHaveBeenCalledTimes(
          1,
        );


        block4BlurElement(
          control,
        );


        expect(
          control.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );


        expect(
          directBlur,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          slotBlur,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);


describe(
  "Block 4 padding precedence",
  () => {
    it(
      "keeps generic spacing props functional",
      () => {
        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              p="4px"
              px="8px"
              py="6px"
            />,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          );


        expect(
          control.style.paddingLeft,
        ).toBe(
          "8px",
        );


        expect(
          control.style.paddingRight,
        ).toBe(
          "8px",
        );


        expect(
          control.style.paddingTop,
        ).toBe(
          "6px",
        );


        expect(
          control.style.paddingBottom,
        ).toBe(
          "6px",
        );
      },
    );


    it(
      "keeps leftPadding and rightPadding functional",
      () => {
        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              px="8px"
              leftPadding="12px"
              rightPadding="14px"
            />,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          );


        expect(
          control.style.paddingLeft,
        ).toBe(
          "12px",
        );


        expect(
          control.style.paddingRight,
        ).toBe(
          "14px",
        );
      },
    );


    it(
      "lets slot style override spacing props",
      () => {
        const slotProps:
          NonNullable<
            ComponentProps<
              typeof Input
            >[
              "slotProps"
            ]
          > = {
            root: {
              style: {
                paddingLeft:
                  "16px",

                paddingRight:
                  "18px",
              },
            },
          };


        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              leftPadding="12px"
              rightPadding="14px"
              slotProps={
                slotProps
              }
            />,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          );


        expect(
          control.style.paddingLeft,
        ).toBe(
          "16px",
        );


        expect(
          control.style.paddingRight,
        ).toBe(
          "18px",
        );
      },
    );


    it(
      "keeps direct style as the final override",
      () => {
        const slotProps:
          NonNullable<
            ComponentProps<
              typeof Input
            >[
              "slotProps"
            ]
          > = {
            root: {
              style: {
                paddingLeft:
                  "16px",

                paddingRight:
                  "18px",
              },
            },
          };


        const container =
          renderDOM(
            <Input
              data-testid="block4-control"
              leftPadding="12px"
              rightPadding="14px"
              slotProps={
                slotProps
              }
              style={{
                paddingLeft:
                  "20px",

                paddingRight:
                  "22px",
              }}
            />,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "block4-control",
          );


        expect(
          control.style.paddingLeft,
        ).toBe(
          "20px",
        );


        expect(
          control.style.paddingRight,
        ).toBe(
          "22px",
        );
      },
    );
  },
);

