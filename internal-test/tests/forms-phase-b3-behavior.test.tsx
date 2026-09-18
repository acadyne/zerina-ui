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
  Card,
  IconButton,
  Pressable,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function pointerEvent(
  type:
    string,
): Event {
  const event =
    new MouseEvent(
      type,
      {
        bubbles:
          true,

        cancelable:
          true,

        button:
          0,
      },
    );


  Object.defineProperties(
    event,
    {
      pointerType: {
        value:
          "mouse",
      },

      pointerId: {
        value:
          1,
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
  element:
    HTMLElement,
  type:
    string,
): void {
  act(
    () => {
      element.dispatchEvent(
        pointerEvent(
          type,
        ),
      );
    },
  );
}


type PressCase = {
  name:
    string;

  render:
    (
      publicPointerDown:
        React.PointerEventHandler<any>,
      slotPointerDown:
        React.PointerEventHandler<any>,
    ) => React.ReactElement;
};


const PRESS_CASES:
  PressCase[] = [
    {
      name:
        "Button",

      render:
        (
          publicPointerDown,
          slotPointerDown,
        ) => (
          <Button
            data-testid="target"
            onPointerDown={
              publicPointerDown
            }
            slotProps={{
              root: {
                onPointerDown:
                  slotPointerDown,
              },
            }}
          >
            Button
          </Button>
        ),
    },

    {
      name:
        "IconButton",

      render:
        (
          publicPointerDown,
          slotPointerDown,
        ) => (
          <IconButton
            data-testid="target"
            ariaLabel="Icon"
            icon="I"
            onPointerDown={
              publicPointerDown
            }
            slotProps={{
              root: {
                onPointerDown:
                  slotPointerDown,
              },
            }}
          />
        ),
    },

    {
      name:
        "Pressable",

      render:
        (
          publicPointerDown,
          slotPointerDown,
        ) => (
          <Pressable
            data-testid="target"
            onPointerDown={
              publicPointerDown
            }
            slotProps={{
              root: {
                onPointerDown:
                  slotPointerDown,
              },
            }}
          >
            Pressable
          </Pressable>
        ),
    },

    {
      name:
        "Card",

      render:
        (
          publicPointerDown,
          slotPointerDown,
        ) => (
          <Card
            data-testid="target"
            onPress={() => {
              // activa semántica interactiva
            }}
            onPointerDown={
              publicPointerDown
            }
            slotProps={{
              root: {
                onPointerDown:
                  slotPointerDown,
              },
            }}
          >
            Card
          </Card>
        ),
    },
  ];


describe(
  "Phase B3 shared press bridge behavior",
  () => {
    it.each(
      PRESS_CASES,
    )(
      "$name stops slot and internal pointer-down behavior after public preventDefault",
      ({
        render,
      }) => {
        const publicPointerDown =
          vi.fn(
            (
              event:
                React.PointerEvent,
            ) => {
              event.preventDefault();
            },
          );

        const slotPointerDown =
          vi.fn();


        const container =
          renderDOM(
            render(
              publicPointerDown,
              slotPointerDown,
            ),
          );

        const target =
          getByTestId(
            container,
            "target",
          );


        dispatchPointer(
          target,
          "pointerdown",
        );


        expect(
          publicPointerDown,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotPointerDown,
        ).not.toHaveBeenCalled();

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
      "runs slot and internal cleanup after public pointerleave preventDefault",
      () => {
        const publicPointerLeave =
          vi.fn(
            (
              event:
                React.PointerEvent,
            ) => {
              event.preventDefault();
            },
          );

        const slotPointerLeave =
          vi.fn();


        const container =
          renderDOM(
            <Button
              data-testid="target"
              onPointerLeave={
                publicPointerLeave
              }
              slotProps={{
                root: {
                  onPointerLeave:
                    slotPointerLeave,
                },
              }}
            >
              Button
            </Button>,
          );

        const target =
          getByTestId(
            container,
            "target",
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


        dispatchPointer(
          target,
          "pointerout",
        );


        expect(
          publicPointerLeave,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotPointerLeave,
        ).toHaveBeenCalledTimes(
          1,
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
      "lets the root slot cancel click before onPress",
      () => {
        const onPress =
          vi.fn();

        const slotClick =
          vi.fn(
            (
              event:
                React.MouseEvent,
            ) => {
              event.preventDefault();
            },
          );


        const container =
          renderDOM(
            <Button
              data-testid="target"
              onPress={
                onPress
              }
              slotProps={{
                root: {
                  onClick:
                    slotClick,
                },
              }}
            >
              Button
            </Button>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );


        act(
          () => {
            target.dispatchEvent(
              new MouseEvent(
                "click",
                {
                  bubbles:
                    true,

                  cancelable:
                    true,

                  detail:
                    1,
                },
              ),
            );
          },
        );


        expect(
          slotClick,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onPress,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
