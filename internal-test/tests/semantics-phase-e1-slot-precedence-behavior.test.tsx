import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Input,
  Popover,
  PopoverTrigger,
} from "zerina-ui";

import {
  resolveContextualSlot,
  resolveSlotLayers,
} from "../../src/helpers/css";

import {
  clickElement,
  focusElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


type TestSlot =
  "root";


describe(
  "Phase E1 slot precedence behavior",
  () => {
    it(
      "merges context and local slot maps granularly while local values win collisions",
      () => {
        const contextClick =
          vi.fn();

        const localClick =
          vi.fn();


        const result =
          resolveContextualSlot<TestSlot>({
            slot:
              "root",

            baseStyle: {
              display:
                "block",

              color:
                "black",
            },

            baseProps: {
              className:
                "base",

              "data-base":
                "yes",
            },

            contextStyles: {
              root: {
                color:
                  "red",

                padding:
                  "4px",
              },
            },

            contextSlotProps: {
              root: {
                className:
                  "context",

                "data-context":
                  "yes",

                onClick:
                  contextClick,
              },
            },

            styles: {
              root: {
                color:
                  "blue",
              },
            },

            slotProps: {
              root: {
                className:
                  "local",

                "data-local":
                  "yes",

                onClick:
                  localClick,
              },
            },

            className:
              "direct",

            style: {
              margin:
                "8px",
            },
          });


        expect(
          result.className,
        ).toBe(
          "base context local direct",
        );

        expect(
          result.style,
        ).toMatchObject({
          display:
            "block",

          color:
            "blue",

          padding:
            "4px",

          margin:
            "8px",
        });

        expect(
          result[
            "data-base"
          ],
        ).toBe(
          "yes",
        );

        expect(
          result[
            "data-context"
          ],
        ).toBe(
          "yes",
        );

        expect(
          result[
            "data-local"
          ],
        ).toBe(
          "yes",
        );


        result.onClick?.(
          {} as never,
        );


        expect(
          localClick,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          contextClick,
        ).not.toHaveBeenCalled();
      },
    );



    it(
      "resolves nested compound layers from broad context to item to local",
      () => {
        const result =
          resolveSlotLayers<TestSlot>({
            slots: [
              "root",
            ],

            layers: [
              {
                styles: {
                  root: {
                    color:
                      "red",

                    padding:
                      "2px",
                  },
                },

                slotProps: {
                  root: {
                    "data-context":
                      "yes",
                  },
                },
              },
              {
                styles: {
                  root: {
                    color:
                      "orange",

                    margin:
                      "3px",
                  },
                },

                slotProps: {
                  root: {
                    "data-item":
                      "yes",
                  },
                },
              },
              {
                styles: {
                  root: {
                    color:
                      "blue",
                  },
                },

                slotProps: {
                  root: {
                    "data-local":
                      "yes",
                  },
                },
              },
            ],
          });


        expect(
          result.style,
        ).toMatchObject({
          color:
            "blue",

          padding:
            "2px",

          margin:
            "3px",
        });

        expect(
          result[
            "data-context"
          ],
        ).toBe(
          "yes",
        );

        expect(
          result[
            "data-item"
          ],
        ).toBe(
          "yes",
        );

        expect(
          result[
            "data-local"
          ],
        ).toBe(
          "yes",
        );
      },
    );


    it(
      "runs text-control focus as public then local slot before internal state",
      () => {
        const order:
          string[] = [];


        const container =
          renderDOM(
            <Input
              data-testid="input"

              onFocus={() => {
                order.push(
                  "public",
                );
              }}

              slotProps={{
                root: {
                  onFocus: () => {
                    order.push(
                      "local",
                    );
                  },
                },
              }}
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "input",
          );


        focusElement(
          input,
        );


        expect(
          order,
        ).toEqual([
          "public",
          "local",
        ]);

        expect(
          input.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          true,
        );
      },
    );


    it(
      "lets a public text-control handler cancel local slot and internal focus state",
      () => {
        const localFocus =
          vi.fn();


        const container =
          renderDOM(
            <Input
              data-testid="input"

              onFocus={(
                event,
              ) => {
                event.preventDefault();
              }}

              slotProps={{
                root: {
                  onFocus:
                    localFocus,
                },
              }}
            />,
          );


        const input =
          getByTestId<HTMLInputElement>(
            container,
            "input",
          );


        focusElement(
          input,
        );


        expect(
          localFocus,
        ).not.toHaveBeenCalled();

        expect(
          input.hasAttribute(
            "data-focused",
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "runs Popover trigger handlers as child public then local slot then context slot then internal",
      () => {
        const order:
          string[] = [];


        const container =
          renderDOM(
            <Popover
              open={
                false
              }

              onOpenChange={() => {
                order.push(
                  "internal",
                );
              }}

              slotProps={{
                trigger: {
                  onClick: () => {
                    order.push(
                      "context",
                    );
                  },
                },
              }}
            >
              <PopoverTrigger
                slotProps={{
                  trigger: {
                    onClick: () => {
                      order.push(
                        "local",
                      );
                    },
                  },
                }}
              >
                <button
                  type="button"
                  data-testid="trigger"
                  onClick={() => {
                    order.push(
                      "public",
                    );
                  }}
                >
                  Open
                </button>
              </PopoverTrigger>
            </Popover>,
          );


        clickElement(
          getByTestId(
            container,
            "trigger",
          ),
        );


        expect(
          order,
        ).toEqual([
          "public",
          "local",
          "context",
          "internal",
        ]);
      },
    );


    it(
      "lets a local Popover trigger handler cancel context and internal behavior",
      () => {
        const contextClick =
          vi.fn();

        const onOpenChange =
          vi.fn();


        const container =
          renderDOM(
            <Popover
              open={
                false
              }

              onOpenChange={
                onOpenChange
              }

              slotProps={{
                trigger: {
                  onClick:
                    contextClick,
                },
              }}
            >
              <PopoverTrigger
                slotProps={{
                  trigger: {
                    onClick: (
                      event,
                    ) => {
                      event.preventDefault();
                    },
                  },
                }}
              >
                <button
                  type="button"
                  data-testid="trigger"
                >
                  Open
                </button>
              </PopoverTrigger>
            </Popover>,
          );


        clickElement(
          getByTestId(
            container,
            "trigger",
          ),
        );


        expect(
          contextClick,
        ).not.toHaveBeenCalled();

        expect(
          onOpenChange,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
