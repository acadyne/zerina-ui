import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Field,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


type StateName =
  | "disabled"
  | "invalid"
  | "required"
  | "readOnly";


const STATE_NAMES:
  readonly StateName[] = [
    "disabled",
    "invalid",
    "required",
    "readOnly",
  ];


function createRestrictiveFixture(
  state:
    StateName,
) {
  const fieldProps = {
    disabled:
      state ===
      "disabled",

    invalid:
      state ===
      "invalid",

    required:
      state ===
      "required",

    readOnly:
      state ===
      "readOnly",
  };


  return (
    <Field
      {...fieldProps}
      data-testid="field"
    >
      <InputGroup
        data-testid="group"
        disabled={false}
        invalid={false}
        required={false}
        readOnly={false}
      >
        <Input
          data-testid="control"
          disabled={false}
          invalid={false}
          required={false}
          readOnly={false}
        />
      </InputGroup>
    </Field>
  );
}


describe(
  "restrictive state aggregation",
  () => {
    it.each(
      STATE_NAMES,
    )(
      "does not let local false neutralize inherited %s",
      (
        state,
      ) => {
        const container =
          renderDOM(
            createRestrictiveFixture(
              state,
            ),
          );


        const field =
          getByTestId<HTMLDivElement>(
            container,
            "field",
          );


        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        const dataName =
          state ===
          "readOnly"
            ? "readonly"
            : state;


        expect(
          field.getAttribute(
            `data-${dataName}`,
          ),
        ).toBe(
          "true",
        );


        expect(
          group.getAttribute(
            `data-${dataName}`,
          ),
        ).toBe(
          "true",
        );


        if (
          state ===
          "disabled"
        ) {
          expect(
            control.disabled,
          ).toBe(
            true,
          );


          expect(
            control.getAttribute(
              "data-disabled",
            ),
          ).toBe(
            "true",
          );
        }


        if (
          state ===
          "invalid"
        ) {
          expect(
            control.getAttribute(
              "aria-invalid",
            ),
          ).toBe(
            "true",
          );


          expect(
            control.getAttribute(
              "data-invalid",
            ),
          ).toBe(
            "true",
          );
        }


        if (
          state ===
          "required"
        ) {
          expect(
            control.required,
          ).toBe(
            true,
          );


          expect(
            control.getAttribute(
              "aria-required",
            ),
          ).toBe(
            "true",
          );
        }


        if (
          state ===
          "readOnly"
        ) {
          expect(
            control.readOnly,
          ).toBe(
            true,
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
              "data-readonly",
            ),
          ).toBe(
            "true",
          );


          expect(
            control.disabled,
          ).toBe(
            false,
          );
        }
      },
    );


    it(
      "combines states coming from different nesting levels",
      () => {
        const container =
          renderDOM(
            <Field
              disabled
            >
              <InputGroup
                invalid
                required
              >
                <Input
                  data-testid="control"
                  readOnly
                />
              </InputGroup>
            </Field>,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


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
          control.readOnly,
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
            "aria-required",
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
      },
    );
  },
);


describe(
  "field IDs and associations",
  () => {
    it(
      "separates the field, control, label, help and error IDs",
      () => {
        const container =
          renderDOM(
            <Field
              id="account-field"
              controlId="account-control"
              label="Account"
              helpText="Account help"
              error="Account error"
            >
              <Input />
            </Field>,
          );


        const control =
          container.querySelector<HTMLInputElement>(
            "#account-control",
          );


        const label =
          container.querySelector<HTMLLabelElement>(
            "#account-field-label",
          );


        expect(
          container.querySelector(
            "#account-field",
          ),
        ).not.toBeNull();


        expect(
          control,
        ).not.toBeNull();


        expect(
          label?.htmlFor,
        ).toBe(
          "account-control",
        );


        expect(
          container.querySelector(
            "#account-field-help",
          ),
        ).not.toBeNull();


        expect(
          container.querySelector(
            "#account-field-error",
          ),
        ).not.toBeNull();


        expect(
          new Set([
            "account-field",
            "account-control",
            "account-field-label",
            "account-field-help",
            "account-field-error",
          ]).size,
        ).toBe(
          5,
        );


        expect(
          control?.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          "account-field-help account-field-error",
        );
      },
    );


    it(
      "does not create ARIA references to absent descriptions",
      () => {
        const container =
          renderDOM(
            <Field
              id="plain-field"
              label="Plain"
            >
              <Input
                data-testid="control"
              />
            </Field>,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        expect(
          control.getAttribute(
            "aria-describedby",
          ),
        ).toBeNull();


        expect(
          container.querySelector(
            "#plain-field-help",
          ),
        ).toBeNull();


        expect(
          container.querySelector(
            "#plain-field-error",
          ),
        ).toBeNull();
      },
    );


    it(
      "preserves explicit descriptions and removes duplicates in order",
      () => {
        const container =
          renderDOM(
            <>
              <p
                id="external-description"
              >
                External
              </p>

              <Field
                id="description-field"
                helpText="Help"
                error="Error"
              >
                <Input
                  data-testid="control"
                  aria-describedby={
                    [
                      "external-description",
                      "description-field-help",
                      "external-description",
                    ].join(
                      " ",
                    )
                  }
                />
              </Field>
            </>,
          );


        const control =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        expect(
          control.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          [
            "external-description",
            "description-field-help",
            "description-field-error",
          ].join(
            " ",
          ),
        );
      },
    );


    it(
      "uses group labelling without assigning the field label to one radio",
      () => {
        const container =
          renderDOM(
            <Field
              id="plan-field"
              controlId="plan-group"
              label="Plan"
              helpText="Choose a plan"
              labelAssociation="group"
            >
              <RadioGroup
                data-testid="group"
                name="plan"
              >
                <Radio
                  value="basic"
                  label="Basic"
                />

                <Radio
                  value="pro"
                  label="Pro"
                />
              </RadioGroup>
            </Field>,
          );


        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
          );


        const fieldLabel =
          container.querySelector<HTMLLabelElement>(
            "#plan-field-label",
          );


        const radios =
          Array.from(
            container.querySelectorAll<HTMLInputElement>(
              'input[type="radio"]',
            ),
          );


        expect(
          group.id,
        ).toBe(
          "plan-group",
        );


        expect(
          group.getAttribute(
            "aria-labelledby",
          ),
        ).toBe(
          "plan-field-label",
        );


        expect(
          group.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          "plan-field-help",
        );


        expect(
          fieldLabel?.hasAttribute(
            "for",
          ),
        ).toBe(
          false,
        );


        expect(
          radios,
        ).toHaveLength(
          2,
        );


        expect(
          new Set(
            radios.map(
              (
                radio,
              ) =>
                radio.id,
            ),
          ).size,
        ).toBe(
          2,
        );


        expect(
          radios.some(
            (
              radio,
            ) =>
              radio.id ===
              "plan-group",
          ),
        ).toBe(
          false,
        );
      },
    );
  },
);


describe(
  "errors and aria-invalid",
  () => {
    it(
      "renders a contextual error only when the field is invalid",
      () => {
        const valid =
          renderDOM(
            <FormControl
              errorMessageId="valid-error"
            >
              <FormErrorMessage>
                Hidden error
              </FormErrorMessage>
            </FormControl>,
          );


        expect(
          valid.textContent,
        ).not.toContain(
          "Hidden error",
        );


        const invalid =
          renderDOM(
            <FormControl
              invalid
              errorMessageId="invalid-error"
            >
              <FormErrorMessage>
                Visible error
              </FormErrorMessage>
            </FormControl>,
          );


        expect(
          invalid.querySelector(
            "#invalid-error",
          )?.textContent,
        ).toBe(
          "Visible error",
        );
      },
    );


    it(
      "keeps a standalone FormErrorMessage renderable",
      () => {
        const container =
          renderDOM(
            <FormErrorMessage
              id="standalone-error"
            >
              Standalone
            </FormErrorMessage>,
          );


        const error =
          container.querySelector(
            "#standalone-error",
          );


        expect(
          error?.textContent,
        ).toBe(
          "Standalone",
        );


        expect(
          error?.getAttribute(
            "role",
          ),
        ).toBe(
          "alert",
        );
      },
    );


    it.each([
      "grammar",
      "spelling",
    ] as const)(
      "preserves specialized aria-invalid=%s",
      (
        ariaInvalid,
      ) => {
        const container =
          renderDOM(
            <Field
              invalid
            >
              <Input
                data-testid="control"
                aria-invalid={
                  ariaInvalid
                }
              />
            </Field>,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "control",
          ).getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          ariaInvalid,
        );
      },
    );


    it(
      "forces aria-invalid=true when invalid has no specialized value",
      () => {
        const container =
          renderDOM(
            <Field
              invalid
            >
              <Input
                data-testid="control"
                aria-invalid={false}
              />
            </Field>,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "control",
          ).getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );
      },
    );
  },
);