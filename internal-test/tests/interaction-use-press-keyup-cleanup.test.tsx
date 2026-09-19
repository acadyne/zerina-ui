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
  Pressable,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function dispatchKey(
  element:
    HTMLElement,
  type:
    "keydown" | "keyup",
  key:
    string,
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


describe(
  "usePress keyup cleanup",
  () => {
    it(
      "runs cleanup after public keyup preventDefault without activating",
      () => {
        const onPress =
          vi.fn();

        const publicKeyUp =
          vi.fn(
            (
              event:
                React.KeyboardEvent,
            ) => {
              event.preventDefault();
            },
          );

        const slotKeyUp =
          vi.fn();


        const container =
          renderDOM(
            <Pressable
              as="div"
              data-testid="target"
              onPress={
                onPress
              }
              onKeyUp={
                publicKeyUp
              }
              slotProps={{
                root: {
                  onKeyUp:
                    slotKeyUp,
                },
              }}
            >
              Pressable
            </Pressable>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );


        dispatchKey(
          target,
          "keydown",
          " ",
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          true,
        );


        dispatchKey(
          target,
          "keyup",
          " ",
        );


        expect(
          publicKeyUp,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotKeyUp,
        ).not.toHaveBeenCalled();

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          false,
        );

        expect(
          onPress,
        ).not.toHaveBeenCalled();
      },
    );


    it(
      "runs cleanup after slot keyup preventDefault without activating",
      () => {
        const onPress =
          vi.fn();

        const publicKeyUp =
          vi.fn();

        const slotKeyUp =
          vi.fn(
            (
              event:
                React.KeyboardEvent,
            ) => {
              event.preventDefault();
            },
          );


        const container =
          renderDOM(
            <Pressable
              as="div"
              data-testid="target"
              onPress={
                onPress
              }
              onKeyUp={
                publicKeyUp
              }
              slotProps={{
                root: {
                  onKeyUp:
                    slotKeyUp,
                },
              }}
            >
              Pressable
            </Pressable>,
          );

        const target =
          getByTestId(
            container,
            "target",
          );


        dispatchKey(
          target,
          "keydown",
          " ",
        );

        expect(
          target.hasAttribute(
            "data-pressed",
          ),
        ).toBe(
          true,
        );


        dispatchKey(
          target,
          "keyup",
          " ",
        );


        expect(
          publicKeyUp,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotKeyUp,
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

        expect(
          onPress,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
