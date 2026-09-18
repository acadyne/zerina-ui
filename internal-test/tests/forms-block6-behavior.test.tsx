import {
  useState,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from "zerina-ui";

import {
  DataTable,
} from "../../src/components/data-table/DataTable";

import {
  SettingsList,
} from "../../src/patterns/settings/SettingsList";

import {
  clickElement,
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function getChoiceRoot(
  input: HTMLInputElement,
  ui:
    | "checkbox"
    | "radio"
    | "switch",
): HTMLElement {
  const root =
    input.closest<HTMLElement>(
      `[data-ui="${ui}"]`,
    );

  expect(
    root,
  ).not.toBeNull();

  return root as HTMLElement;
}


describe(
  "Block 6 controlled and uncontrolled state",
  () => {
    it(
      "supports Checkbox controlled and uncontrolled modes",
      () => {
        const controlledChange =
          vi.fn();

        const container =
          renderDOM(
            <>
              <Checkbox
                data-testid="uncontrolled"
                defaultChecked={false}
              />

              <Checkbox
                data-testid="controlled"
                checked={false}
                onChange={
                  controlledChange
                }
              />
            </>,
          );

        const uncontrolled =
          getByTestId<HTMLInputElement>(
            container,
            "uncontrolled",
          );

        const controlled =
          getByTestId<HTMLInputElement>(
            container,
            "controlled",
          );

        clickElement(
          uncontrolled,
        );

        clickElement(
          controlled,
        );

        expect(
          uncontrolled.checked,
        ).toBe(
          true,
        );

        expect(
          controlled.checked,
        ).toBe(
          false,
        );

        expect(
          controlledChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "supports standalone Radio controlled and uncontrolled modes",
      () => {
        const controlledChange =
          vi.fn();

        const container =
          renderDOM(
            <>
              <Radio
                data-testid="uncontrolled"
                defaultChecked={false}
              />

              <Radio
                data-testid="controlled"
                checked={false}
                onChange={
                  controlledChange
                }
              />
            </>,
          );

        const uncontrolled =
          getByTestId<HTMLInputElement>(
            container,
            "uncontrolled",
          );

        const controlled =
          getByTestId<HTMLInputElement>(
            container,
            "controlled",
          );

        clickElement(
          uncontrolled,
        );

        clickElement(
          controlled,
        );

        expect(
          uncontrolled.checked,
        ).toBe(
          true,
        );

        expect(
          controlled.checked,
        ).toBe(
          false,
        );

        expect(
          controlledChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "supports Switch controlled and uncontrolled modes",
      () => {
        const controlledChange =
          vi.fn();

        const container =
          renderDOM(
            <>
              <Switch
                data-testid="uncontrolled"
                defaultChecked={false}
              />

              <Switch
                data-testid="controlled"
                checked={false}
                onChange={
                  controlledChange
                }
              />
            </>,
          );

        const uncontrolled =
          getByTestId<HTMLInputElement>(
            container,
            "uncontrolled",
          );

        const controlled =
          getByTestId<HTMLInputElement>(
            container,
            "controlled",
          );

        clickElement(
          uncontrolled,
        );

        clickElement(
          controlled,
        );

        expect(
          uncontrolled.checked,
        ).toBe(
          true,
        );

        expect(
          controlled.checked,
        ).toBe(
          false,
        );

        expect(
          controlledChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "supports RadioGroup controlled and uncontrolled selection",
      () => {
        const uncontrolledChange =
          vi.fn();

        const controlledChange =
          vi.fn();

        const container =
          renderDOM(
            <>
              <RadioGroup
                name="uncontrolled-plan"
                defaultValue="a"
                onValueChange={
                  uncontrolledChange
                }
              >
                <Radio
                  data-testid="uncontrolled-a"
                  value="a"
                />

                <Radio
                  data-testid="uncontrolled-b"
                  value="b"
                />
              </RadioGroup>

              <RadioGroup
                name="controlled-plan"
                value="a"
                onValueChange={
                  controlledChange
                }
              >
                <Radio
                  data-testid="controlled-a"
                  value="a"
                />

                <Radio
                  data-testid="controlled-b"
                  value="b"
                />
              </RadioGroup>
            </>,
          );

        const uncontrolledA =
          getByTestId<HTMLInputElement>(
            container,
            "uncontrolled-a",
          );

        const uncontrolledB =
          getByTestId<HTMLInputElement>(
            container,
            "uncontrolled-b",
          );

        const controlledA =
          getByTestId<HTMLInputElement>(
            container,
            "controlled-a",
          );

        const controlledB =
          getByTestId<HTMLInputElement>(
            container,
            "controlled-b",
          );

        clickElement(
          uncontrolledB,
        );

        clickElement(
          controlledB,
        );

        expect(
          uncontrolledA.checked,
        ).toBe(
          false,
        );

        expect(
          uncontrolledB.checked,
        ).toBe(
          true,
        );

        expect(
          uncontrolledChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          uncontrolledChange.mock.calls[0]?.[0],
        ).toBe(
          "b",
        );

        expect(
          uncontrolledChange.mock.calls[0]?.[1].type,
        ).toBe(
          "change",
        );

        expect(
          controlledA.checked,
        ).toBe(
          true,
        );

        expect(
          controlledB.checked,
        ).toBe(
          false,
        );

        expect(
          controlledChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);


describe(
  "Block 6 restrictions and native semantics",
  () => {
    it(
      "keeps read-only controls focusable and blocks changes and callbacks",
      () => {
        const checkboxChange =
          vi.fn();

        const radioChange =
          vi.fn();

        const switchChange =
          vi.fn();

        const groupChange =
          vi.fn();

        function ReadOnlyHarness() {
          const [
            renderVersion,
            setRenderVersion,
          ] = useState(
            0,
          );

          return (
            <>
              <button
                type="button"
                data-testid="readonly-rerender"
                onClick={() => {
                  setRenderVersion(
                    (
                      current,
                    ) =>
                      current + 1,
                  );
                }}
              >
                Rerender {renderVersion}
              </button>

              <Checkbox
                data-testid="checkbox"
                checked
                readOnly
                onChange={
                  checkboxChange
                }
              />

              <Radio
                data-testid="radio"
                checked={false}
                readOnly
                onChange={
                  radioChange
                }
              />

              <Switch
                data-testid="switch"
                checked
                readOnly
                onChange={
                  switchChange
                }
              />

              <RadioGroup
                name="readonly-group"
                defaultValue="a"
                readOnly
                onValueChange={
                  groupChange
                }
              >
                <Radio
                  data-testid="group-a"
                  value="a"
                />

                <Radio
                  data-testid="group-b"
                  value="b"
                />
              </RadioGroup>
            </>
          );
        }

        const container =
          renderDOM(
            <ReadOnlyHarness />,
          );

        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );

        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );

        const switchControl =
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          );

        const groupA =
          getByTestId<HTMLInputElement>(
            container,
            "group-a",
          );

        const groupB =
          getByTestId<HTMLInputElement>(
            container,
            "group-b",
          );

        for (
          const control of [
            checkbox,
            radio,
            switchControl,
            groupB,
          ]
        ) {
          focusElement(
            control,
          );

          expect(
            document.activeElement,
          ).toBe(
            control,
          );

          expect(
            control.disabled,
          ).toBe(
            false,
          );

          expect(
            control.getAttribute(
              "aria-readonly",
            ),
          ).toBe(
            "true",
          );
        }

        clickElement(
          checkbox,
        );

        clickElement(
          radio,
        );

        clickElement(
          switchControl,
        );

        clickElement(
          groupB,
        );

        /*
         * JSDOM aplica primero el toggle nativo. El rerender
         * confirma el estado real conservado por React.
         */
        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "readonly-rerender",
          ),
        );

        expect(
          checkbox.checked,
        ).toBe(
          true,
        );

        expect(
          radio.checked,
        ).toBe(
          false,
        );

        expect(
          switchControl.checked,
        ).toBe(
          true,
        );

        expect(
          groupA.checked,
        ).toBe(
          true,
        );

        expect(
          groupB.checked,
        ).toBe(
          false,
        );

        expect(
          checkboxChange,
        ).not.toHaveBeenCalled();

        expect(
          radioChange,
        ).not.toHaveBeenCalled();

        expect(
          switchChange,
        ).not.toHaveBeenCalled();

        expect(
          groupChange,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "preserves native disabled semantics for every control",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox
                data-testid="checkbox"
                disabled
              />

              <Radio
                data-testid="radio"
                disabled
              />

              <Switch
                data-testid="switch"
                disabled
              />
            </>,
          );

        expect(
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          ).disabled,
        ).toBe(
          true,
        );

        expect(
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          ).disabled,
        ).toBe(
          true,
        );

        expect(
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          ).disabled,
        ).toBe(
          true,
        );
      },
    );

    it(
      "keeps Checkbox native indeterminate and aria mixed state synchronized",
      () => {
        const container =
          renderDOM(
            <Checkbox
              data-testid="mixed"
              indeterminate
            />,
          );

        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "mixed",
          );

        expect(
          checkbox.indeterminate,
        ).toBe(
          true,
        );

        expect(
          checkbox.getAttribute(
            "aria-checked",
          ),
        ).toBe(
          "mixed",
        );

        expect(
          getChoiceRoot(
            checkbox,
            "checkbox",
          ).getAttribute(
            "data-indeterminate",
          ),
        ).toBe(
          "true",
        );
      },
    );

    it(
      "does not allow group restrictions to be neutralized locally",
      () => {
        const container =
          renderDOM(
            <RadioGroup
              data-testid="group"
              name="restricted"
              disabled
              invalid
              required
              readOnly
            >
              <Radio
                data-testid="radio"
                value="a"
                disabled={false}
                invalid={false}
                required={false}
                readOnly={false}
              />
            </RadioGroup>,
          );

        const group =
          getByTestId<HTMLDivElement>(
            container,
            "group",
          );

        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );

        const root =
          getChoiceRoot(
            radio,
            "radio",
          );

        expect(
          group.getAttribute(
            "data-disabled",
          ),
        ).toBe(
          "true",
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
          radio.disabled,
        ).toBe(
          true,
        );

        expect(
          radio.required,
        ).toBe(
          true,
        );

        expect(
          radio.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );

        expect(
          radio.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );

        expect(
          root.getAttribute(
            "data-disabled",
          ),
        ).toBe(
          "true",
        );

        expect(
          root.getAttribute(
            "data-invalid",
          ),
        ).toBe(
          "true",
        );
      },
    );
  },
);


describe(
  "Block 6 variants and DOM contract",
  () => {
    it(
      "applies defaults and label placement to all controls",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox
                data-testid="checkbox-default"
                label="Checkbox"
              />

              <Radio
                data-testid="radio-start"
                label="Radio"
                labelPlacement="start"
              />

              <Switch
                data-testid="switch-end"
                label="Switch"
                labelPlacement="end"
              />
            </>,
          );

        const checkboxRoot =
          getChoiceRoot(
            getByTestId<HTMLInputElement>(
              container,
              "checkbox-default",
            ),
            "checkbox",
          );

        const radioRoot =
          getChoiceRoot(
            getByTestId<HTMLInputElement>(
              container,
              "radio-start",
            ),
            "radio",
          );

        const switchRoot =
          getChoiceRoot(
            getByTestId<HTMLInputElement>(
              container,
              "switch-end",
            ),
            "switch",
          );

        expect(
          checkboxRoot.getAttribute(
            "data-size",
          ),
        ).toBe(
          "md",
        );

        expect(
          checkboxRoot.getAttribute(
            "data-color-scheme",
          ),
        ).toBe(
          "primary",
        );

        expect(
          checkboxRoot.getAttribute(
            "data-label-placement",
          ),
        ).toBe(
          "end",
        );

        expect(
          checkboxRoot.style.flexDirection,
        ).toBe(
          "row",
        );

        expect(
          radioRoot.getAttribute(
            "data-label-placement",
          ),
        ).toBe(
          "start",
        );

        expect(
          radioRoot.style.flexDirection,
        ).toBe(
          "row-reverse",
        );

        expect(
          switchRoot.getAttribute(
            "data-label-placement",
          ),
        ).toBe(
          "end",
        );

        expect(
          switchRoot.style.flexDirection,
        ).toBe(
          "row",
        );
      },
    );

    it(
      "provides geometrically distinct sm, md and lg sizes on every control",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox data-testid="c-sm" size="sm" />
              <Checkbox data-testid="c-md" size="md" />
              <Checkbox data-testid="c-lg" size="lg" />

              <Radio data-testid="r-sm" size="sm" />
              <Radio data-testid="r-md" size="md" />
              <Radio data-testid="r-lg" size="lg" />

              <Switch data-testid="s-sm" size="sm" />
              <Switch data-testid="s-md" size="md" />
              <Switch data-testid="s-lg" size="lg" />
            </>,
          );

        for (
          const [
            prefix,
            ui,
            variable,
          ] of [
            [
              "c",
              "checkbox",
              "--ui-choice-control-size",
            ],
            [
              "r",
              "radio",
              "--ui-choice-control-size",
            ],
            [
              "s",
              "switch",
              "--ui-switch-track-width",
            ],
          ] as const
        ) {
          const roots =
            (
              [
                "sm",
                "md",
                "lg",
              ] as const
            ).map(
              (
                size,
              ) =>
                getChoiceRoot(
                  getByTestId<HTMLInputElement>(
                    container,
                    `${prefix}-${size}`,
                  ),
                  ui,
                ),
            );

          expect(
            roots.map(
              (
                root,
              ) =>
                root.getAttribute(
                  "data-size",
                ),
            ),
          ).toEqual([
            "sm",
            "md",
            "lg",
          ]);

          expect(
            new Set(
              roots.map(
                (
                  root,
                ) =>
                  root.style.getPropertyValue(
                    variable,
                  ),
              ),
            ).size,
          ).toBe(
            3,
          );
        }
      },
    );

    it(
      "resolves primary, secondary and danger accents on every control",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox data-testid="c-primary" colorScheme="primary" />
              <Checkbox data-testid="c-secondary" colorScheme="secondary" />
              <Checkbox data-testid="c-danger" colorScheme="danger" />

              <Radio data-testid="r-primary" colorScheme="primary" />
              <Radio data-testid="r-secondary" colorScheme="secondary" />
              <Radio data-testid="r-danger" colorScheme="danger" />

              <Switch data-testid="s-primary" colorScheme="primary" />
              <Switch data-testid="s-secondary" colorScheme="secondary" />
              <Switch data-testid="s-danger" colorScheme="danger" />
            </>,
          );

        for (
          const [
            prefix,
            ui,
          ] of [
            [
              "c",
              "checkbox",
            ],
            [
              "r",
              "radio",
            ],
            [
              "s",
              "switch",
            ],
          ] as const
        ) {
          const roots =
            (
              [
                "primary",
                "secondary",
                "danger",
              ] as const
            ).map(
              (
                scheme,
              ) =>
                getChoiceRoot(
                  getByTestId<HTMLInputElement>(
                    container,
                    `${prefix}-${scheme}`,
                  ),
                  ui,
                ),
            );

          expect(
            roots.map(
              (
                root,
              ) =>
                root.getAttribute(
                  "data-color-scheme",
                ),
            ),
          ).toEqual([
            "primary",
            "secondary",
            "danger",
          ]);

          expect(
            roots.map(
              (
                root,
              ) =>
                root.style.getPropertyValue(
                  "--ui-choice-accent",
                ),
            ),
          ).toEqual([
            "var(--ui-primary)",
            "var(--ui-secondary)",
            "var(--ui-danger)",
          ]);
        }
      },
    );

    it(
      "emits no legacy choice-control attributes",
      () => {
        const container =
          renderDOM(
            <>
              <Checkbox />
              <Radio />
              <RadioGroup name="group">
                <Radio value="a" />
              </RadioGroup>
              <Switch />
            </>,
          );

        for (
          const selector of [
            "[data-ui-checkbox]",
            "[data-ui-radio]",
            "[data-ui-radio-group]",
            "[data-ui-switch]",
            "[data-ui-checkbox-checked]",
            "[data-ui-radio-checked]",
            "[data-ui-switch-checked]",
            "[data-ui-radio-group-disabled]",
          ]
        ) {
          expect(
            container.querySelector(
              selector,
            ),
          ).toBeNull();
        }
      },
    );
  },
);


describe(
  "Block 6 slots and event composition",
  () => {
    it(
      "transmits Checkbox slot props, classes, styles and composed input events",
      () => {
        const directClick =
          vi.fn();

        const slotClick =
          vi.fn();

        const directChange =
          vi.fn();

        const slotChange =
          vi.fn();

        const container =
          renderDOM(
            <Checkbox
              data-testid="checkbox"
              label="Choice"
              className="direct-root"
              style={{
                marginTop:
                  "2px",
              }}
              styles={{
                root: {
                  paddingTop:
                    "3px",
                },
                label: {
                  letterSpacing:
                    "1px",
                },
              }}
              slotProps={{
                root: {
                  className:
                    "slot-root",
                  "data-slot-root":
                    "yes",
                },
                input: {
                  className:
                    "slot-input",
                  "data-slot-input":
                    "yes",
                  onClick:
                    slotClick,
                  onChange:
                    slotChange,
                },
                control: {
                  className:
                    "slot-control",
                },
                mark: {
                  className:
                    "slot-mark",
                },
                label: {
                  className:
                    "slot-label",
                },
              }}
              onClick={
                directClick
              }
              onChange={
                directChange
              }
            />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );

        const root =
          getChoiceRoot(
            input,
            "checkbox",
          );

        clickElement(
          input,
        );

        expect(
          root.className,
        ).toContain(
          "direct-root",
        );

        expect(
          root.className,
        ).toContain(
          "slot-root",
        );

        expect(
          root.getAttribute(
            "data-slot-root",
          ),
        ).toBe(
          "yes",
        );

        expect(
          root.style.marginTop,
        ).toBe(
          "2px",
        );

        expect(
          root.style.paddingTop,
        ).toBe(
          "3px",
        );

        expect(
          input.className,
        ).toContain(
          "slot-input",
        );

        expect(
          input.getAttribute(
            "data-slot-input",
          ),
        ).toBe(
          "yes",
        );

        expect(
          root.querySelector(
            ".slot-control",
          ),
        ).not.toBeNull();

        expect(
          root.querySelector(
            ".slot-mark",
          ),
        ).not.toBeNull();

        expect(
          root.querySelector(
            ".slot-label",
          ),
        ).not.toBeNull();

        expect(
          directClick,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotClick,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          directChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "composes direct and input-slot events for Radio and Switch",
      () => {
        const radioDirect =
          vi.fn();

        const radioSlot =
          vi.fn();

        const switchDirect =
          vi.fn();

        const switchSlot =
          vi.fn();

        const container =
          renderDOM(
            <>
              <Radio
                data-testid="radio"
                onChange={
                  radioDirect
                }
                slotProps={{
                  input: {
                    onChange:
                      radioSlot,
                  },
                  control: {
                    className:
                      "radio-control-slot",
                  },
                  indicatorDot: {
                    className:
                      "radio-dot-slot",
                  },
                }}
              />

              <Switch
                data-testid="switch"
                onChange={
                  switchDirect
                }
                slotProps={{
                  input: {
                    onChange:
                      switchSlot,
                  },
                  track: {
                    className:
                      "switch-track-slot",
                  },
                  thumb: {
                    className:
                      "switch-thumb-slot",
                  },
                }}
              />
            </>,
          );

        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );

        const switchControl =
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          );

        clickElement(
          radio,
        );

        clickElement(
          switchControl,
        );

        expect(
          radioDirect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          radioSlot,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          switchDirect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          switchSlot,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          container.querySelector(
            ".radio-control-slot",
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            ".radio-dot-slot",
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            ".switch-track-slot",
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            ".switch-thumb-slot",
          ),
        ).not.toBeNull();
      },
    );

    it(
      "lets external preventDefault block internal mutation",
      () => {
        const groupChange =
          vi.fn();

        function PreventedMutationHarness() {
          const [
            renderVersion,
            setRenderVersion,
          ] = useState(
            0,
          );

          return (
            <>
              <button
                type="button"
                data-testid="rerender"
                onClick={() => {
                  setRenderVersion(
                    (
                      current,
                    ) =>
                      current + 1,
                  );
                }}
              >
                Rerender {renderVersion}
              </button>

              <Checkbox
                data-testid="checkbox"
                defaultChecked={false}
                onChange={(
                  event,
                ) => {
                  event.preventDefault();
                }}
              />

              <Radio
                data-testid="radio"
                defaultChecked={false}
                slotProps={{
                  input: {
                    onChange: (
                      event,
                    ) => {
                      event.preventDefault();
                    },
                  },
                }}
              />

              <Switch
                data-testid="switch"
                defaultChecked={false}
                onChange={(
                  event,
                ) => {
                  event.preventDefault();
                }}
              />

              <RadioGroup
                name="prevented-group"
                defaultValue="a"
                onValueChange={
                  groupChange
                }
              >
                <Radio
                  data-testid="group-a"
                  value="a"
                />

                <Radio
                  data-testid="group-b"
                  value="b"
                  onChange={(
                    event,
                  ) => {
                    event.preventDefault();
                  }}
                />
              </RadioGroup>
            </>
          );
        }

        const container =
          renderDOM(
            <PreventedMutationHarness />,
          );

        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "checkbox",
          );

        const radio =
          getByTestId<HTMLInputElement>(
            container,
            "radio",
          );

        const switchControl =
          getByTestId<HTMLInputElement>(
            container,
            "switch",
          );

        const groupA =
          getByTestId<HTMLInputElement>(
            container,
            "group-a",
          );

        const groupB =
          getByTestId<HTMLInputElement>(
            container,
            "group-b",
          );

        clickElement(
          checkbox,
        );

        clickElement(
          radio,
        );

        clickElement(
          switchControl,
        );

        clickElement(
          groupB,
        );

        /*
         * JSDOM performs the native checked toggle before React's
         * change handler. A parent rerender reveals whether the
         * component's internal state was actually committed.
         */
        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "rerender",
          ),
        );

        expect(
          checkbox.checked,
        ).toBe(
          false,
        );

        expect(
          radio.checked,
        ).toBe(
          false,
        );

        expect(
          switchControl.checked,
        ).toBe(
          false,
        );

        expect(
          groupA.checked,
        ).toBe(
          true,
        );

        expect(
          groupB.checked,
        ).toBe(
          false,
        );

        expect(
          getChoiceRoot(
            checkbox,
            "checkbox",
          ).hasAttribute(
            "data-checked",
          ),
        ).toBe(
          false,
        );

        expect(
          getChoiceRoot(
            radio,
            "radio",
          ).hasAttribute(
            "data-checked",
          ),
        ).toBe(
          false,
        );

        expect(
          getChoiceRoot(
            switchControl,
            "switch",
          ).hasAttribute(
            "data-checked",
          ),
        ).toBe(
          false,
        );

        expect(
          groupChange,
        ).not.toHaveBeenCalled();
      },
    );
  },
);


describe(
  "Block 6 consumer compatibility",
  () => {
    it(
      "keeps SettingsList Checkbox and Switch functional",
      () => {
        const checkboxChange =
          vi.fn();

        const switchChange =
          vi.fn();

        const container =
          renderDOM(
            <SettingsList>
              <SettingsList.Checkbox
                data-testid="settings-checkbox"
                label="Checkbox setting"
                defaultChecked={false}
                onCheckedChange={
                  checkboxChange
                }
              />

              <SettingsList.Switch
                data-testid="settings-switch"
                label="Switch setting"
                defaultChecked={false}
                onCheckedChange={
                  switchChange
                }
              />
            </SettingsList>,
          );

        const checkbox =
          getByTestId<HTMLInputElement>(
            container,
            "settings-checkbox",
          );

        const switchControl =
          getByTestId<HTMLInputElement>(
            container,
            "settings-switch",
          );

        clickElement(
          checkbox,
        );

        clickElement(
          switchControl,
        );

        expect(
          checkbox.checked,
        ).toBe(
          true,
        );

        expect(
          switchControl.checked,
        ).toBe(
          true,
        );

        expect(
          checkboxChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          switchChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "keeps DataTable row selection functional",
      () => {
        const selectionChange =
          vi.fn();

        const container =
          renderDOM(
            <DataTable<
              {
                id:
                  number;
                name:
                  string;
              },
              number
            >
              data={[
                {
                  id:
                    1,
                  name:
                    "Ada",
                },
              ]}
              columns={[]}
              selectedIds={[]}
              onSelectionChange={
                selectionChange
              }
              mobileMode="never"
              getRowId={(
                row,
              ) =>
                row.id
              }
            />,
          );

        const rowCheckbox =
          container.querySelector<HTMLInputElement>(
            'input[aria-label="Seleccionar fila 1"]',
          );

        expect(
          rowCheckbox,
        ).not.toBeNull();

        clickElement(
          rowCheckbox as HTMLInputElement,
        );

        expect(
          selectionChange,
        ).toHaveBeenCalledWith([
          1,
        ]);
      },
    );
  },
);
