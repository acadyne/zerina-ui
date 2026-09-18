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
  Button,
  IconButton,
  Pressable,
  type ActionControlColorScheme,
  type ActionControlSize,
  type ActionControlVariant,
  type UIPressState,
} from "zerina-ui";

import {
  clickElement,
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


const publicSizes:
  ActionControlSize[] = [
    "sm",
    "md",
    "lg",
  ];

const publicVariants:
  ActionControlVariant[] = [
    "solid",
    "outline",
    "ghost",
  ];

const publicSchemes:
  ActionControlColorScheme[] = [
    "primary",
    "secondary",
    "danger",
  ];

void publicSizes;
void publicVariants;
void publicSchemes;


const removedButtonProps:
  React.ComponentProps<
    typeof Button
  > = {
    children:
      "Removed",

    // @ts-expect-error Button.rounded was removed in Block 7.
    rounded:
      true,
  };

const removedIconButtonProps:
  React.ComponentProps<
    typeof IconButton
  > = {
    ariaLabel:
      "Removed",

    icon:
      "x",

    // @ts-expect-error IconButton.rounded was removed in Block 7.
    rounded:
      true,
  };

const numericIconButtonProps:
  React.ComponentProps<
    typeof IconButton
  > = {
    ariaLabel:
      "Numeric",

    icon:
      "x",

    // @ts-expect-error IconButton accepts only sm, md and lg.
    size:
      32,
  };

void removedButtonProps;
void removedIconButtonProps;
void numericIconButtonProps;


type PointerOptions = {
  pointerType?:
    "mouse" |
    "touch" |
    "pen";

  pointerId?:
    number;

  button?:
    number;
};


function pointerEvent(
  type: string,
  {
    pointerType =
      "mouse",

    pointerId =
      1,

    button =
      0,
  }: PointerOptions = {},
): Event {
  const event =
    new MouseEvent(
      type,
      {
        bubbles:
          true,

        cancelable:
          true,

        button,
      },
    );

  Object.defineProperties(
    event,
    {
      pointerType: {
        value:
          pointerType,
      },

      pointerId: {
        value:
          pointerId,
      },

      isPrimary: {
        value:
          true,
      },
    },
  );

  return event;
}


function dispatchPointer(
  element: HTMLElement,
  type: string,
  options?:
    PointerOptions,
): void {
  act(
    () => {
      element.dispatchEvent(
        pointerEvent(
          type,
          options,
        ),
      );
    },
  );
}


function dispatchKeyboard(
  element: EventTarget,
  type: "keydown" | "keyup",
  key: string,
): void {
  act(
    () => {
      element.dispatchEvent(
        new KeyboardEvent(
          type,
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


function establishKeyboardModality(): void {
  dispatchKeyboard(
    document,
    "keydown",
    "Tab",
  );
}


function establishPointerModality(): void {
  act(
    () => {
      document.dispatchEvent(
        pointerEvent(
          "pointerdown",
          {
            pointerType:
              "mouse",
          },
        ),
      );
    },
  );
}


function expectStateVocabulary(
  element: HTMLElement,
  identity: string,
): void {
  expect(
    element.getAttribute(
      "data-ui",
    ),
  ).toBe(
    identity,
  );

  for (
    const legacy of [
      "data-ui-button",
      "data-ui-icon-button",
      "data-ui-pressable",
    ]
  ) {
    expect(
      element.hasAttribute(
        legacy,
      ),
    ).toBe(
      false,
    );
  }
}


describe(
  "Block 7 action-control behavior",
  () => {
    it(
      "publishes equivalent generic state vocabulary on Button, IconButton and Pressable",
      () => {
        const container =
          renderDOM(
            <>
              <Button
                data-testid="button"
              >
                Button
              </Button>

              <IconButton
                data-testid="icon"
                ariaLabel="Icon"
                icon="I"
              />

              <Pressable
                data-testid="pressable"
              >
                Pressable
              </Pressable>
            </>,
          );

        const contracts = [
          {
            testId:
              "button",

            identity:
              "button",
          },
          {
            testId:
              "icon",

            identity:
              "icon-button",
          },
          {
            testId:
              "pressable",

            identity:
              "pressable",
          },
        ];

        for (
          const contract of
          contracts
        ) {
          const element =
            getByTestId(
              container,
              contract.testId,
            );

          expectStateVocabulary(
            element,
            contract.identity,
          );

          dispatchPointer(
            element,
            "pointerover",
          );

          expect(
            element.hasAttribute(
              "data-hovered",
            ),
          ).toBe(
            true,
          );

          expect(
            element.getAttribute(
              "data-pointer-type",
            ),
          ).toBe(
            "mouse",
          );

          dispatchPointer(
            element,
            "pointerdown",
          );

          expect(
            element.hasAttribute(
              "data-pressed",
            ),
          ).toBe(
            true,
          );

          dispatchPointer(
            element,
            "pointerup",
          );

          expect(
            element.hasAttribute(
              "data-pressed",
            ),
          ).toBe(
            false,
          );
        }
      },
    );


    it.each(
      [
        "touch",
        "pen",
      ] as const,
    )(
      "does not expose hover for %s input",
      (
        pointerType,
      ) => {
        const container =
          renderDOM(
            <Pressable
              data-testid="target"
            >
              Target
            </Pressable>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );

        dispatchPointer(
          target,
          "pointerover",
          {
            pointerType,
          },
        );

        expect(
          target.hasAttribute(
            "data-hovered",
          ),
        ).toBe(
          false,
        );

        expect(
          target.getAttribute(
            "data-pointer-type",
          ),
        ).toBe(
          pointerType,
        );
      },
    );


    it(
      "cleans pointer pressed state on up, cancel, lost capture and blur",
      () => {
        const container =
          renderDOM(
            <Pressable
              data-testid="target"
            >
              Target
            </Pressable>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );

        for (
          const terminal of [
            "pointerup",
            "pointercancel",
            "lostpointercapture",
          ]
        ) {
          dispatchPointer(
            target,
            "pointerdown",
          );

          expect(
            target.hasAttribute(
              "data-pressed",
            ),
          ).toBe(
            true,
          );

          dispatchPointer(
            target,
            terminal,
          );

          expect(
            target.hasAttribute(
              "data-pressed",
            ),
          ).toBe(
            false,
          );
        }

        focusElement(
          target,
        );

        dispatchPointer(
          target,
          "pointerdown",
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          true,
        );

        act(
          () => {
            target.blur();
          },
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          false,
        );
      },
    );


    it.each(
      [
        "Enter",
        " ",
      ],
    )(
      "exposes pressed during %s keyboard interaction",
      (
        key,
      ) => {
        const container =
          renderDOM(
            <Pressable
              data-testid="target"
            >
              Target
            </Pressable>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );

        focusElement(
          target,
        );

        dispatchKeyboard(
          target,
          "keydown",
          key,
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          true,
        );

        expect(
          target.getAttribute(
            "data-pointer-type",
          ),
        ).toBe(
          "keyboard",
        );

        dispatchKeyboard(
          target,
          "keyup",
          key,
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "disabled blocks activation, uses native semantics and clears active states",
      () => {
        const onPress =
          vi.fn();

        let setDisabled:
          React.Dispatch<
            React.SetStateAction<boolean>
          > = () => {};

        function Harness() {
          const [
            disabled,
            set,
          ] = React.useState(
            false,
          );

          setDisabled =
            set;

          return (
            <Button
              data-testid="target"
              disabled={disabled}
              onPress={onPress}
            >
              Target
            </Button>
          );
        }

        const container =
          renderDOM(
            <Harness />,
          );

        const target =
          getByTestId<HTMLButtonElement>(
            container,
            "target",
          );

        dispatchPointer(
          target,
          "pointerover",
        );

        dispatchPointer(
          target,
          "pointerdown",
        );

        expect(
          target.hasAttribute(
            "data-hovered",
          ),
        ).toBe(
          true,
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          true,
        );

        act(
          () => {
            setDisabled(
              true,
            );
          },
        );

        expect(
          target.disabled,
        ).toBe(
          true,
        );

        expect(
          target.hasAttribute(
            "data-disabled",
          ),
        ).toBe(
          true,
        );

        expect(
          target.hasAttribute(
            "data-hovered",
          ),
        ).toBe(
          false,
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          false,
        );

        clickElement(
          target,
        );

        expect(
          onPress,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "focus-visible follows keyboard modality, rejects pointer modality and clears on blur",
      () => {
        const container =
          renderDOM(
            <>
              <Button
                data-testid="keyboard"
              >
                Keyboard
              </Button>

              <Button
                data-testid="pointer"
              >
                Pointer
              </Button>
            </>,
          );

        const keyboard =
          getByTestId(
            container,
            "keyboard",
          );

        const pointer =
          getByTestId(
            container,
            "pointer",
          );

        establishKeyboardModality();

        focusElement(
          keyboard,
        );

        expect(
          keyboard.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );

        expect(
          keyboard.hasAttribute(
            "data-focus-visible",
          ),
        ).toBe(
          true,
        );

        act(
          () => {
            keyboard.blur();
          },
        );

        expect(
          keyboard.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );

        expect(
          keyboard.hasAttribute(
            "data-focus-visible",
          ),
        ).toBe(
          false,
        );

        establishPointerModality();

        focusElement(
          pointer,
        );

        expect(
          pointer.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );

        expect(
          pointer.hasAttribute(
            "data-focus-visible",
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "preserves custom box shadows from styles, slotProps and direct style during focus-visible",
      () => {
        const container =
          renderDOM(
            <>
              <Button
                data-testid="styles"
                styles={{
                  root: {
                    boxShadow:
                      "1px 2px 3px rgb(1, 2, 3)",
                  },
                }}
              >
                Styles
              </Button>

              <IconButton
                data-testid="slot"
                ariaLabel="Slot"
                icon="I"
                slotProps={{
                  root: {
                    style: {
                      boxShadow:
                        "2px 3px 4px rgb(4, 5, 6)",
                    },
                  },
                }}
              />

              <Pressable
                data-testid="direct"
                style={{
                  boxShadow:
                    "3px 4px 5px rgb(7, 8, 9)",
                }}
              >
                Direct
              </Pressable>
            </>,
          );

        establishKeyboardModality();

        const checks = [
          {
            testId:
              "styles",

            shadow:
              "1px 2px 3px rgb(1, 2, 3)",
          },
          {
            testId:
              "slot",

            shadow:
              "2px 3px 4px rgb(4, 5, 6)",
          },
          {
            testId:
              "direct",

            shadow:
              "3px 4px 5px rgb(7, 8, 9)",
          },
        ];

        for (
          const check of
          checks
        ) {
          const element =
            getByTestId(
              container,
              check.testId,
            );

          focusElement(
            element,
          );

          expect(
            element.hasAttribute(
              "data-focus-visible",
            ),
          ).toBe(
            true,
          );

          expect(
            element.style.boxShadow,
          ).toBe(
            check.shadow,
          );
        }
      },
    );


    it(
      "applies style precedence from base to styles, slotProps and direct style",
      () => {
        const container =
          renderDOM(
            <>
              <Pressable
                data-testid="base"
              >
                Base
              </Pressable>

              <Pressable
                data-testid="styles"
                styles={{
                  root: {
                    padding:
                      "7px",
                  },
                }}
              >
                Styles
              </Pressable>

              <Pressable
                data-testid="slot"
                styles={{
                  root: {
                    padding:
                      "7px",
                  },
                }}
                slotProps={{
                  root: {
                    style: {
                      padding:
                        "11px",
                    },
                  },
                }}
              >
                Slot
              </Pressable>

              <Pressable
                data-testid="direct"
                styles={{
                  root: {
                    padding:
                      "7px",
                  },
                }}
                slotProps={{
                  root: {
                    style: {
                      padding:
                        "11px",
                    },
                  },
                }}
                style={{
                  padding:
                    "13px",
                }}
              >
                Direct
              </Pressable>
            </>,
          );

        expect(
          getByTestId(
            container,
            "base",
          ).style.display,
        ).toBe(
          "inline-flex",
        );

        expect(
          getByTestId(
            container,
            "styles",
          ).style.padding,
        ).toBe(
          "7px",
        );

        expect(
          getByTestId(
            container,
            "slot",
          ).style.padding,
        ).toBe(
          "11px",
        );

        expect(
          getByTestId(
            container,
            "direct",
          ).style.padding,
        ).toBe(
          "13px",
        );
      },
    );


    it(
      "keeps Pressable motion optional and lets direct scale, translate and shadow win",
      () => {
        const container =
          renderDOM(
            <>
              <Pressable
                data-testid="effect"
                pressEffect
              >
                Effect
              </Pressable>

              <Pressable
                data-testid="none"
                pressEffect={false}
              >
                None
              </Pressable>

              <Pressable
                data-testid="override"
                pressEffect
                style={{
                  scale:
                    "1.15",

                  translate:
                    "0 9px",

                  boxShadow:
                    "4px 5px 6px rgb(10, 11, 12)",
                }}
              >
                Override
              </Pressable>
            </>,
          );

        const effect =
          getByTestId(
            container,
            "effect",
          );

        const none =
          getByTestId(
            container,
            "none",
          );

        const override =
          getByTestId(
            container,
            "override",
          );

        dispatchPointer(
          effect,
          "pointerdown",
        );

        dispatchPointer(
          none,
          "pointerdown",
        );

        dispatchPointer(
          override,
          "pointerdown",
        );

        expect(
          effect.style.scale,
        ).not.toBe(
          "",
        );

        expect(
          none.style.scale,
        ).toBe(
          "",
        );

        expect(
          override.style.scale,
        ).toBe(
          "1.15",
        );

        expect(
          override.style.translate,
        ).toBe(
          "0 9px",
        );

        expect(
          override.style.boxShadow,
        ).toBe(
          "4px 5px 6px rgb(10, 11, 12)",
        );
      },
    );


    it(
      "keeps UIPressState render props and native, link and non-native semantics",
      () => {
        const states:
          UIPressState[] = [];

        const container =
          renderDOM(
            <>
              <Pressable
                data-testid="render"
              >
                {(
                  state,
                ) => {
                  states.push(
                    state,
                  );

                  return state.pressed
                    ? "pressed"
                    : "idle";
                }}
              </Pressable>

              <Pressable
                data-testid="button"
              >
                Button
              </Pressable>

              <Pressable
                data-testid="link"
                as="a"
                href="/target"
              >
                Link
              </Pressable>

              <Pressable
                data-testid="div"
                as="div"
              >
                Div
              </Pressable>
            </>,
          );

        const render =
          getByTestId(
            container,
            "render",
          );

        expect(
          render.textContent,
        ).toBe(
          "idle",
        );

        dispatchPointer(
          render,
          "pointerdown",
        );

        expect(
          render.textContent,
        ).toBe(
          "pressed",
        );

        expect(
          states.at(
            -1,
          )?.pressed,
        ).toBe(
          true,
        );

        const button =
          getByTestId<HTMLButtonElement>(
            container,
            "button",
          );

        expect(
          button.tagName,
        ).toBe(
          "BUTTON",
        );

        expect(
          button.type,
        ).toBe(
          "button",
        );

        const link =
          getByTestId<HTMLAnchorElement>(
            container,
            "link",
          );

        expect(
          link.tagName,
        ).toBe(
          "A",
        );

        expect(
          link.getAttribute(
            "href",
          ),
        ).toBe(
          "/target",
        );

        expect(
          link.hasAttribute(
            "role",
          ),
        ).toBe(
          false,
        );

        const div =
          getByTestId<HTMLDivElement>(
            container,
            "div",
          );

        expect(
          div.getAttribute(
            "role",
          ),
        ).toBe(
          "button",
        );

        expect(
          div.tabIndex,
        ).toBe(
          0,
        );
      },
    );


    it(
      "implements complete Button loading semantics and restores normal state",
      () => {
        const onPress =
          vi.fn();

        let setLoading:
          React.Dispatch<
            React.SetStateAction<boolean>
          > = () => {};

        function Harness() {
          const [
            loading,
            set,
          ] = React.useState(
            true,
          );

          setLoading =
            set;

          return (
            <Button
              data-testid="target"
              isLoading={loading}
              loadingText="Working"
              onPress={onPress}
            >
              Ready
            </Button>
          );
        }

        const container =
          renderDOM(
            <Harness />,
          );

        const target =
          getByTestId<HTMLButtonElement>(
            container,
            "target",
          );

        expect(
          target.hasAttribute(
            "data-loading",
          ),
        ).toBe(
          true,
        );

        expect(
          target.getAttribute(
            "aria-busy",
          ),
        ).toBe(
          "true",
        );

        expect(
          target.disabled,
        ).toBe(
          true,
        );

        expect(
          target.textContent,
        ).toContain(
          "Working",
        );

        expect(
          target.querySelector(
            '[data-ui="button-spinner"]',
          ),
        ).not.toBeNull();

        expect(
          target.style.getPropertyValue(
            "--ui-action-color",
          ),
        ).not.toBe(
          target.style.getPropertyValue(
            "--ui-action-background",
          ),
        );

        clickElement(
          target,
        );

        expect(
          onPress,
        ).not.toHaveBeenCalled();

        act(
          () => {
            setLoading(
              false,
            );
          },
        );

        expect(
          target.hasAttribute(
            "data-loading",
          ),
        ).toBe(
          false,
        );

        expect(
          target.hasAttribute(
            "aria-busy",
          ),
        ).toBe(
          false,
        );

        expect(
          target.disabled,
        ).toBe(
          false,
        );

        expect(
          target.textContent,
        ).toContain(
          "Ready",
        );

        clickElement(
          target,
        );

        expect(
          onPress,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );


    it(
      "uses coherent nominal metrics for Button and IconButton",
      () => {
        const container =
          renderDOM(
            <>
              {publicSizes.map(
                (
                  size,
                ) => (
                  <React.Fragment
                    key={size}
                  >
                    <Button
                      data-testid={`button-${size}`}
                      size={size}
                    >
                      {size}
                    </Button>

                    <IconButton
                      data-testid={`icon-${size}`}
                      ariaLabel={size}
                      icon="I"
                      size={size}
                    />
                  </React.Fragment>
                ),
              )}
            </>,
          );

        const heights =
          new Set<string>();

        for (
          const size of
          publicSizes
        ) {
          const button =
            getByTestId(
              container,
              `button-${size}`,
            );

          const icon =
            getByTestId(
              container,
              `icon-${size}`,
            );

          expect(
            button.getAttribute(
              "data-size",
            ),
          ).toBe(
            size,
          );

          expect(
            icon.getAttribute(
              "data-size",
            ),
          ).toBe(
            size,
          );

          expect(
            button.style.minHeight,
          ).not.toBe(
            "",
          );

          expect(
            icon.style.width,
          ).toBe(
            icon.style.height,
          );

          expect(
            icon.style.height,
          ).toBe(
            button.style.minHeight,
          );

          heights.add(
            button.style.minHeight,
          );
        }

        expect(
          heights.size,
        ).toBe(
          3,
        );
      },
    );


    it(
      "publishes variants, schemes and state variables consistently",
      () => {
        const container =
          renderDOM(
            <>
              {publicVariants.flatMap(
                (
                  variant,
                ) =>
                  publicSchemes.map(
                    (
                      scheme,
                    ) => (
                      <Button
                        key={`${variant}-${scheme}`}
                        data-testid={`${variant}-${scheme}`}
                        variant={variant}
                        colorScheme={scheme}
                      >
                        Action
                      </Button>
                    ),
                  ),
              )}

              {(
                [
                  "ghost",
                  "solid",
                  "unstyled",
                ] as const
              ).map(
                (
                  variant,
                ) => (
                  <IconButton
                    key={variant}
                    data-testid={`icon-${variant}`}
                    ariaLabel={variant}
                    icon="I"
                    variant={variant}
                  />
                ),
              )}
            </>,
          );

        for (
          const variant of
          publicVariants
        ) {
          for (
            const scheme of
            publicSchemes
          ) {
            const button =
              getByTestId(
                container,
                `${variant}-${scheme}`,
              );

            expect(
              button.getAttribute(
                "data-variant",
              ),
            ).toBe(
              variant,
            );

            expect(
              button.getAttribute(
                "data-color-scheme",
              ),
            ).toBe(
              scheme,
            );

            for (
              const variable of [
                "--ui-action-background",
                "--ui-action-hover-background",
                "--ui-action-pressed-background",
                "--ui-action-color",
                "--ui-action-border",
                "--ui-action-shadow",
                "--ui-action-hover-shadow",
                "--ui-action-pressed-shadow",
              ]
            ) {
              expect(
                button.style.getPropertyValue(
                  variable,
                ),
              ).not.toBe(
                "",
              );
            }

            dispatchPointer(
              button,
              "pointerover",
            );

            expect(
              button.hasAttribute(
                "data-hovered",
              ),
            ).toBe(
              true,
            );

            dispatchPointer(
              button,
              "pointerdown",
            );

            expect(
              button.hasAttribute(
                "data-pressed",
              ),
            ).toBe(
              true,
            );
          }
        }

        for (
          const variant of [
            "ghost",
            "solid",
            "unstyled",
          ] as const
        ) {
          const icon =
            getByTestId(
              container,
              `icon-${variant}`,
            );

          expect(
            icon.getAttribute(
              "data-variant",
            ),
          ).toBe(
            variant,
          );

          expect(
            icon.style.getPropertyValue(
              "--ui-action-hover-background",
            ),
          ).not.toBe(
            "",
          );

          expect(
            icon.style.getPropertyValue(
              "--ui-action-pressed-background",
            ),
          ).not.toBe(
            "",
          );
        }
      },
    );
  },
);
