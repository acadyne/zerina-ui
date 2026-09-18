import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Field,
  Radio,
  RadioGroup,
} from "zerina-ui";

import {
  clickElement,
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "standalone Radio",
  () => {
    it(
      "updates DOM and visual state from defaultChecked=false",
      () => {
        const container =
          renderDOM(
            <Radio
              data-testid="radio"
              defaultChecked={false}
              label="Standalone"
            />,
          );


        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );


        const root =
          container.querySelector(
            '[data-ui="radio"]',
          );


        expect(
          radio.checked,
        ).toBe(
          false,
        );


        expect(
          root?.hasAttribute(
            "data-checked",
          ),
        ).toBe(
          false,
        );


        clickElement(
          radio,
        );


        expect(
          radio.checked,
        ).toBe(
          true,
        );


        expect(
          root?.getAttribute(
            "data-checked",
          ),
        ).toBe(
          "true",
        );
      },
    );


    it(
      "depends exclusively on checked in controlled mode",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Radio
              data-testid="radio"
              checked={false}
              onChange={
                onChange
              }
            />,
          );


        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );


        clickElement(
          radio,
        );


        expect(
          onChange,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          radio.checked,
        ).toBe(
          false,
        );
      },
    );


    it(
      "blocks read-only changes without becoming disabled",
      () => {
        const onChange =
          vi.fn();


        const container =
          renderDOM(
            <Radio
              data-testid="radio"
              defaultChecked={false}
              readOnly
              onChange={
                onChange
              }
            />,
          );


        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );


        focusElement(
          radio,
        );


        expect(
          document.activeElement,
        ).toBe(
          radio,
        );


        expect(
          radio.disabled,
        ).toBe(
          false,
        );


        expect(
          radio.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        clickElement(
          radio,
        );


        expect(
          radio.checked,
        ).toBe(
          false,
        );


        expect(
          onChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "preserves native disabled semantics",
      () => {
        const container =
          renderDOM(
            <Radio
              data-testid="radio"
              disabled
            />,
          );


        expect(
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          ).disabled,
        ).toBe(
          true,
        );
      },
    );
  },
);


describe(
  "RadioGroup",
  () => {
    it(
      "supports uncontrolled selection and onValueChange(value, event)",
      () => {
        const changes:
          Array<{
            value:
              string;

            eventType:
              string;

            targetValue:
              string;
          }> = [];


        const container =
          renderDOM(
            <RadioGroup
              name="plan"
              defaultValue="basic"
              onValueChange={(
                value,
                event,
              ) => {
                changes.push({
                  value,

                  eventType:
                    event.type,

                  targetValue:
                    event.currentTarget
                      .value,
                });
              }}
            >
              <Radio
                data-testid="basic"
                value="basic"
              />

              <Radio
                data-testid="pro"
                value="pro"
              />
            </RadioGroup>,
          );


        const basic =
          getByTestId<HTMLInputElement>(
            container,
            "basic",
          );


        const pro =
          getByTestId<HTMLInputElement>(
            container,
            "pro",
          );


        expect(
          basic.checked,
        ).toBe(
          true,
        );


        expect(
          pro.checked,
        ).toBe(
          false,
        );


        expect(
          basic.name,
        ).toBe(
          "plan",
        );


        expect(
          pro.name,
        ).toBe(
          "plan",
        );


        clickElement(
          pro,
        );


        expect(
          basic.checked,
        ).toBe(
          false,
        );


        expect(
          pro.checked,
        ).toBe(
          true,
        );


        expect(
          changes,
        ).toEqual([
          {
            value:
              "pro",

            eventType:
              "change",

            targetValue:
              "pro",
          },
        ]);
      },
    );


    it(
      "depends exclusively on value in controlled mode",
      () => {
        const onValueChange =
          vi.fn();


        const container =
          renderDOM(
            <RadioGroup
              name="plan"
              value="basic"
              onValueChange={
                onValueChange
              }
            >
              <Radio
                data-testid="basic"
                value="basic"
              />

              <Radio
                data-testid="pro"
                value="pro"
              />
            </RadioGroup>,
          );


        const basic =
          getByTestId<HTMLInputElement>(
            container,
            "basic",
          );


        const pro =
          getByTestId<HTMLInputElement>(
            container,
            "pro",
          );


        clickElement(
          pro,
        );


        expect(
          onValueChange,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          basic.checked,
        ).toBe(
          true,
        );


        expect(
          pro.checked,
        ).toBe(
          false,
        );
      },
    );


    it(
      "blocks read-only group changes and callbacks",
      () => {
        const onValueChange =
          vi.fn();


        const container =
          renderDOM(
            <RadioGroup
              name="plan"
              defaultValue="basic"
              readOnly
              onValueChange={
                onValueChange
              }
            >
              <Radio
                data-testid="basic"
                value="basic"
              />

              <Radio
                data-testid="pro"
                value="pro"
              />
            </RadioGroup>,
          );


        const basic =
          getByTestId<HTMLInputElement>(
            container,
            "basic",
          );


        const pro =
          getByTestId<HTMLInputElement>(
            container,
            "pro",
          );


        clickElement(
          pro,
        );


        expect(
          basic.checked,
        ).toBe(
          true,
        );


        expect(
          pro.checked,
        ).toBe(
          false,
        );


        expect(
          onValueChange,
        ).not.toHaveBeenCalled();


        expect(
          basic.disabled,
        ).toBe(
          false,
        );


        expect(
          pro.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );
      },
    );


    it(
      "propagates disabled natively to every radio",
      () => {
        const container =
          renderDOM(
            <RadioGroup
              data-testid="group"
              name="plan"
              disabled
            >
              <Radio
                value="basic"
              />

              <Radio
                value="pro"
              />
            </RadioGroup>,
          );


        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
          );


        const radios =
          Array.from(
            container.querySelectorAll<HTMLInputElement>(
              'input[type="radio"]',
            ),
          );


        expect(
          group.getAttribute(
            "data-disabled",
          ),
        ).toBe(
          "true",
        );


        expect(
          radios,
        ).toHaveLength(
          2,
        );


        expect(
          radios.every(
            (
              radio,
            ) =>
              radio.disabled,
          ),
        ).toBe(
          true,
        );
      },
    );


    it(
      "exposes complete group ARIA and unique radio IDs",
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
                id="choice-field"
                controlId="choice-group"
                label="Choice"
                helpText="Choice help"
                error="Choice error"
                labelAssociation="group"
                required
                readOnly
              >
                <RadioGroup
                  data-testid="group"
                  name="choice"
                  aria-describedby={
                    "external-description choice-field-help"
                  }
                >
                  <Radio
                    value="a"
                  />

                  <Radio
                    value="b"
                  />
                </RadioGroup>
              </Field>
            </>,
          );


        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
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
          "choice-group",
        );


        expect(
          group.getAttribute(
            "role",
          ),
        ).toBe(
          "radiogroup",
        );


        expect(
          group.getAttribute(
            "aria-labelledby",
          ),
        ).toBe(
          "choice-field-label",
        );


        expect(
          group.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          [
            "external-description",
            "choice-field-help",
            "choice-field-error",
          ].join(
            " ",
          ),
        );


        expect(
          group.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );


        expect(
          group.getAttribute(
            "aria-required",
          ),
        ).toBe(
          "true",
        );


        expect(
          group.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );


        expect(
          radios.every(
            (
              radio,
            ) =>
              radio.required,
          ),
        ).toBe(
          true,
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
          radios.length,
        );


        expect(
          radios.some(
            (
              radio,
            ) =>
              radio.id ===
              group.id,
          ),
        ).toBe(
          false,
        );
      },
    );
  },
);