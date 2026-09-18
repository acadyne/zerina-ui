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
  composeTriggerEvent,
} from "../../src/core/interaction/trigger/TriggerRuntime";


interface TestEvent {
  defaultPrevented:
    boolean;

  preventDefault:
    () => void;
}

type TestHandler =
  (
    event:
      TestEvent
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


function composeMatrix({
  child,
  local,
  inherited,
  internal,
}: {
  child?:
    TestHandler;

  local?:
    TestHandler;

  inherited?:
    TestHandler;

  internal?:
    TestHandler;
}) {
  return composeTriggerEvent<TestEvent>({
    childHandler:
      child,

    layers: [
      local
        ? createLayer(
            local,
          )
        : undefined,

      inherited
        ? createLayer(
            inherited,
          )
        : undefined,
    ],

    getLayerHandler:
      (
        layer,
      ) =>
        layer.onClick as unknown as
          | TestHandler
          | undefined,

    internalHandler:
      internal,
  });
}


describe(
  "TriggerRuntime progressive cancellation",
  () => {
    it(
      "runs child -> local -> inherited -> internal when nobody cancels",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeMatrix({
            child: () => {
              calls.push(
                "child",
              );
            },

            local: () => {
              calls.push(
                "local",
              );
            },

            inherited: () => {
              calls.push(
                "inherited",
              );
            },

            internal: () => {
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
          "inherited",
          "internal",
        ]);
      },
    );


    it(
      "lets the child cancel every later layer",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeMatrix({
            child: (
              event,
            ) => {
              calls.push(
                "child",
              );

              event.preventDefault();
            },

            local: () => {
              calls.push(
                "local",
              );
            },

            inherited: () => {
              calls.push(
                "inherited",
              );
            },

            internal: () => {
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
        ]);
      },
    );


    it(
      "lets the local layer cancel inherited and internal behavior",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeMatrix({
            child: () => {
              calls.push(
                "child",
              );
            },

            local: (
              event,
            ) => {
              calls.push(
                "local",
              );

              event.preventDefault();
            },

            inherited: () => {
              calls.push(
                "inherited",
              );
            },

            internal: () => {
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
      "lets the inherited layer cancel only the internal behavior",
      () => {
        const calls:
          string[] = [];

        const composed =
          composeMatrix({
            child: () => {
              calls.push(
                "child",
              );
            },

            local: () => {
              calls.push(
                "local",
              );
            },

            inherited: (
              event,
            ) => {
              calls.push(
                "inherited",
              );

              event.preventDefault();
            },

            internal: () => {
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
          "inherited",
        ]);
      },
    );
  },
);
