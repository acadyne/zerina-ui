// @vitest-environment node

import type {
  HTMLAttributes,
  MouseEventHandler,
} from "react";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  composeEventHandlerChain,
  composeEventHandlers,
} from "../../src/core/interaction/events/composeEventHandlers";

import {
  composeTriggerEvent,
} from "../../src/core/interaction/trigger/TriggerRuntime";

import {
  composeMenuExternalHandlers,
} from "../../src/primitives/overlay/menu/menu.utils";


interface TestEvent {
  defaultPrevented:
    boolean;

  preventDefault:
    () => void;
}


type TestHandler =
  (
    event:
      TestEvent,
  ) => void;


function createEvent():
  TestEvent {
  const event:
    TestEvent = {
    defaultPrevented:
      false,

    preventDefault:
      () => {
        event.defaultPrevented =
          true;
      },
  };

  return event;
}


function createLayer(
  handler:
    TestHandler,
): HTMLAttributes<HTMLElement> {
  return {
    onClick:
      handler as unknown as
        MouseEventHandler<HTMLElement>,
  };
}


describe(
  "progressive event-layer cancellation",
  () => {
    it(
      "central chain stops after the first layer that prevents default",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeEventHandlerChain<TestEvent>(
            () => {
              calls.push(
                "first",
              );
            },

            (
              event,
            ) => {
              calls.push(
                "second",
              );

              event.preventDefault();
            },

            () => {
              calls.push(
                "third",
              );
            },
          );


        composed?.(
          createEvent(),
        );


        expect(
          calls,
        ).toEqual([
          "first",
          "second",
        ]);
      },
    );


    it(
      "TriggerRuntime delegates child/local/inherited/internal ordering to the same rule",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeTriggerEvent<TestEvent>({
            childHandler: () => {
              calls.push(
                "child",
              );
            },

            layers: [
              createLayer(
                (
                  event,
                ) => {
                  calls.push(
                    "local",
                  );

                  event.preventDefault();
                },
              ),

              createLayer(
                () => {
                  calls.push(
                    "inherited",
                  );
                },
              ),
            ],

            getLayerHandler:
              (
                layer,
              ) =>
                layer.onClick as unknown as
                  | TestHandler
                  | undefined,

            internalHandler: () => {
              calls.push(
                "internal",
              );
            },
          });


        composed?.(
          createEvent(),
        );


        expect(
          calls,
        ).toEqual([
          "child",
          "local",
        ]);
      },
    );


    it(
      "Menu stops local/context layers when the public prop cancels",
      () => {
        const calls:
          string[] = [];

        const external =
          composeMenuExternalHandlers<TestEvent>(
            (
              event,
            ) => {
              calls.push(
                "public",
              );

              event.preventDefault();
            },

            () => {
              calls.push(
                "local",
              );
            },

            () => {
              calls.push(
                "context",
              );
            },
          );


        const composed =
          composeEventHandlers(
            external,
            () => {
              calls.push(
                "internal",
              );
            },
          );


        composed(
          createEvent(),
        );


        expect(
          calls,
        ).toEqual([
          "public",
        ]);
      },
    );


    it(
      "Menu lets a local layer cancel context and internal behavior",
      () => {
        const calls:
          string[] = [];

        const external =
          composeMenuExternalHandlers<TestEvent>(
            () => {
              calls.push(
                "public",
              );
            },

            (
              event,
            ) => {
              calls.push(
                "local",
              );

              event.preventDefault();
            },

            () => {
              calls.push(
                "context",
              );
            },
          );


        const composed =
          composeEventHandlers(
            external,
            () => {
              calls.push(
                "internal",
              );
            },
          );


        composed(
          createEvent(),
        );


        expect(
          calls,
        ).toEqual([
          "public",
          "local",
        ]);
      },
    );


    it(
      "keeps cleanup composition opt-out explicit",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeEventHandlers<TestEvent>(
            (
              event,
            ) => {
              calls.push(
                "external",
              );

              event.preventDefault();
            },

            () => {
              calls.push(
                "cleanup",
              );
            },

            {
              checkDefaultPrevented:
                false,
            },
          );


        composed(
          createEvent(),
        );


        expect(
          calls,
        ).toEqual([
          "external",
          "cleanup",
        ]);
      },
    );
  },
);
