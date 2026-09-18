import type {
  ReactElement,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Field,
  FormErrorMessage,
  HelpText,
  Input,
  Textarea,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


type ControlCase = {
  name:
    string;

  render:
    () => ReactElement;
};


const CONTROL_CASES:
  ControlCase[] = [
    {
      name:
        "Input",

      render:
        () => (
          <Input
            data-testid="control"
          />
        ),
    },

    {
      name:
        "Textarea",

      render:
        () => (
          <Textarea
            data-testid="control"
          />
        ),
    },
  ];


describe(
  "Phase B1 shared text-control behavior",
  () => {
    it.each(
      CONTROL_CASES,
    )(
      "$name consumes the same Field state/ARIA contract",
      ({
        render,
      }) => {
        const container =
          renderDOM(
            <Field
              disabled
              invalid
              required
              readOnly
            >
              {render()}
            </Field>,
          );


        const control =
          getByTestId<
            HTMLInputElement |
            HTMLTextAreaElement
          >(
            container,
            "control",
          );


        expect(
          control.hasAttribute(
            "data-ui-control",
          ),
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

        expect(
          control.getAttribute(
            "data-invalid",
          ),
        ).toBe(
          "true",
        );

        expect(
          control.getAttribute(
            "data-required",
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


    it(
      "renders numeric help/error content through the shared frame",
      () => {
        const container =
          renderDOM(
            <Field
              invalid
            >
              <HelpText
                data-testid="help"
              >
                {0}
              </HelpText>

              <FormErrorMessage
                data-testid="error"
              >
                {0}
              </FormErrorMessage>
            </Field>,
          );


        expect(
          getByTestId(
            container,
            "help",
          ).textContent,
        ).toBe(
          "0",
        );

        expect(
          getByTestId(
            container,
            "error",
          ).textContent,
        ).toBe(
          "0",
        );
      },
    );


    it(
      "keeps error messages hidden while Field is valid",
      () => {
        const container =
          renderDOM(
            <Field>
              <FormErrorMessage
                data-testid="error"
              >
                Error
              </FormErrorMessage>
            </Field>,
          );


        expect(
          container.querySelector(
            '[data-testid="error"]',
          ),
        ).toBeNull();
      },
    );


    it(
      "keeps boolean children absent in both message wrappers",
      () => {
        const container =
          renderDOM(
            <Field
              invalid
            >
              <HelpText
                data-testid="help"
              >
                {false}
              </HelpText>

              <FormErrorMessage
                data-testid="error"
              >
                {true}
              </FormErrorMessage>
            </Field>,
          );


        expect(
          container.querySelector(
            '[data-testid="help"]',
          ),
        ).toBeNull();

        expect(
          container.querySelector(
            '[data-testid="error"]',
          ),
        ).toBeNull();
      },
    );
  },
);
