import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  defineSlotRecipe,
  resolveLayeredSlot,
  resolveMergedSlot,
  resolveSlot,
} from "../../src/helpers/css";


type TestSlot =
  | "root"
  | "item"
  | "activeItem"
  | "directActiveItem";


describe(
  "defineSlotRecipe deterministic precedence",
  () => {
    it(
      "does not depend on the property order of the input object",
      () => {
        const recipe =
          defineSlotRecipe<
            "root",
            {
              variant:
                "solid" | "outline";

              size:
                "sm" | "lg";
            }
          >({
            base: {
              root: {
                display:
                  "block",
              },
            },

            variants: {
              variant: {
                solid: {
                  root: {
                    color:
                      "red",
                  },
                },

                outline: {
                  root: {
                    color:
                      "blue",
                  },
                },
              },

              size: {
                sm: {
                  root: {
                    padding:
                      "4px",
                  },
                },

                lg: {
                  root: {
                    padding:
                      "12px",
                  },
                },
              },
            },
          });


        const firstInput = {
          variant:
            "solid" as const,

          size:
            "lg" as const,
        };


        const secondInput = {
          size:
            "lg" as const,

          variant:
            "solid" as const,
        };


        expect(
          recipe(
            firstInput,
          ),
        ).toEqual(
          recipe(
            secondInput,
          ),
        );
      },
    );


    it(
      "applies variants in their declaration order",
      () => {
        const recipe =
          defineSlotRecipe<
            "root",
            {
              variant:
                "primary";

              size:
                "large";
            }
          >({
            variants: {
              variant: {
                primary: {
                  root: {
                    color:
                      "red",

                    padding:
                      "4px",
                  },
                },
              },

              size: {
                large: {
                  root: {
                    color:
                      "blue",

                    margin:
                      "8px",
                  },
                },
              },
            },
          });


        const result =
          recipe({
            size:
              "large",

            variant:
              "primary",
          });


        expect(
          result.root,
        ).toMatchObject({
          color:
            "blue",

          padding:
            "4px",

          margin:
            "8px",
        });
      },
    );


    it(
      "applies resolve after base and variants",
      () => {
        const recipe =
          defineSlotRecipe<
            "root",
            {
              variant:
                "active";
            },
            {
              pressed:
                boolean;
            }
          >({
            base: {
              root: {
                color:
                  "black",

                opacity:
                  0.5,
              },
            },

            variants: {
              variant: {
                active: {
                  root: {
                    color:
                      "blue",

                    opacity:
                      0.75,
                  },
                },
              },
            },

            resolve: ({
              pressed,
            }) =>
              pressed
                ? {
                    root: {
                      color:
                        "green",

                      opacity:
                        1,
                    },
                  }
                : undefined,
          });


        const result =
          recipe({
            variant:
              "active",

            pressed:
              true,
          });


        expect(
          result.root,
        ).toMatchObject({
          color:
            "green",

          opacity:
            1,
        });
      },
    );
  },
);


describe(
  "resolveMergedSlot",
  () => {
    it(
      "uses left-to-right slot precedence",
      () => {
        const result =
          resolveMergedSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            styles: {
              item: {
                color:
                  "red",

                padding:
                  "4px",
              },

              activeItem: {
                color:
                  "blue",
              },
            },
          });


        expect(
          result.style,
        ).toMatchObject({
          color:
            "blue",

          padding:
            "4px",
        });
      },
    );


    it(
      "supports three accumulated slots with the last slot winning",
      () => {
        const result =
          resolveMergedSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
              "directActiveItem",
            ],

            styles: {
              item: {
                color:
                  "red",
              },

              activeItem: {
                color:
                  "blue",
              },

              directActiveItem: {
                color:
                  "green",
              },
            },
          });


        expect(
          result.style?.color,
        ).toBe(
          "green",
        );
      },
    );


    it(
      "applies all slotProps styles after all declared styles",
      () => {
        const result =
          resolveMergedSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            styles: {
              item: {
                color:
                  "red",
              },

              activeItem: {
                color:
                  "blue",

                background:
                  "black",
              },
            },

            slotProps: {
              item: {
                style: {
                  color:
                    "green",
                },
              },

              activeItem: {
                style: {
                  background:
                    "white",
                },
              },
            },
          });


        expect(
          result.style,
        ).toMatchObject({
          color:
            "green",

          background:
            "white",
        });
      },
    );


    it(
      "concatenates classes following slot order",
      () => {
        const result =
          resolveMergedSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
              "directActiveItem",
            ],

            slotProps: {
              item: {
                className:
                  "item-class",
              },

              activeItem: {
                className:
                  "active-class",
              },

              directActiveItem: {
                className:
                  "direct-active-class",
              },
            },
          });


        expect(
          result.className,
        ).toBe(
          "item-class active-class direct-active-class",
        );
      },
    );
  },
);


describe(
  "resolveLayeredSlot",
  () => {
    it(
      "applies local styles after context styles",
      () => {
        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            contextStyles: {
              item: {
                color:
                  "red",

                padding:
                  "4px",
              },

              activeItem: {
                background:
                  "black",
              },
            },

            styles: {
              item: {
                color:
                  "blue",
              },

              activeItem: {
                background:
                  "white",
              },
            },
          });


        expect(
          result.style,
        ).toMatchObject({
          color:
            "blue",

          padding:
            "4px",

          background:
            "white",
        });
      },
    );


    it(
      "applies direct style after base, context and local layers",
      () => {
        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "root",
            ],

            baseStyle: {
              color:
                "black",

              padding:
                "2px",
            },

            baseProps: {
              style: {
                color:
                  "gray",

                margin:
                  "1px",
              },
            },

            contextStyles: {
              root: {
                color:
                  "red",
              },
            },

            contextSlotProps: {
              root: {
                style: {
                  color:
                    "orange",
                },
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
                style: {
                  color:
                    "green",
                },
              },
            },

            style: {
              color:
                "purple",
            },
          });


        expect(
          result.style,
        ).toMatchObject({
          color:
            "purple",

          padding:
            "2px",

          margin:
            "1px",
        });
      },
    );


    it(
      "places direct className after base, context and local classes",
      () => {
        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            baseProps: {
              className:
                "base-class",
            },

            contextSlotProps: {
              item: {
                className:
                  "context-item",
              },

              activeItem: {
                className:
                  "context-active",
              },
            },

            slotProps: {
              item: {
                className:
                  "local-item",
              },

              activeItem: {
                className:
                  "local-active",
              },
            },

            className:
              "direct-class",
          });


        expect(
          result.className,
        ).toBe(
          "base-class context-item context-active local-item local-active direct-class",
        );
      },
    );


    it(
      "applies normal props using base, context and local precedence",
      () => {
        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            baseProps: {
              "data-priority":
                "base",

              "aria-label":
                "base-label",
            },

            contextSlotProps: {
              item: {
                "data-priority":
                  "context-item",
              },

              activeItem: {
                "aria-label":
                  "context-active",
              },
            },

            slotProps: {
              item: {
                "data-priority":
                  "local-item",
              },

              activeItem: {
                "data-priority":
                  "local-active",

                "aria-label":
                  "local-active-label",
              },
            },
          });


        expect(
          result[
            "data-priority"
          ],
        ).toBe(
          "local-active",
        );


        expect(
          result[
            "aria-label"
          ],
        ).toBe(
          "local-active-label",
        );
      },
    );


    it(
      "does not let undefined remove an earlier normal prop",
      () => {
        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "item",
              "activeItem",
            ],

            baseProps: {
              "data-value":
                "base",
            },

            contextSlotProps: {
              item: {
                "data-value":
                  "context",
              },
            },

            slotProps: {
              item: {
                "data-value":
                  "local",
              },

              activeItem: {
                "data-value":
                  undefined,
              },
            },
          });


        expect(
          result[
            "data-value"
          ],
        ).toBe(
          "local",
        );
      },
    );


    it(
      "treats false, zero and empty string as explicit values",
      () => {
        const falseResult =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "root",
            ],

            baseProps: {
              "data-value":
                "base",
            },

            slotProps: {
              root: {
                "data-value":
                  false,
              },
            },
          });


        const zeroResult =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "root",
            ],

            baseProps: {
              "data-value":
                "base",
            },

            slotProps: {
              root: {
                "data-value":
                  0,
              },
            },
          });


        const emptyResult =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "root",
            ],

            baseProps: {
              "data-value":
                "base",
            },

            slotProps: {
              root: {
                "data-value":
                  "",
              },
            },
          });


        expect(
          falseResult[
            "data-value"
          ],
        ).toBe(
          false,
        );


        expect(
          zeroResult[
            "data-value"
          ],
        ).toBe(
          0,
        );


        expect(
          emptyResult[
            "data-value"
          ],
        ).toBe(
          "",
        );
      },
    );


    it(
      "replaces event handlers instead of composing them",
      () => {
        const baseHandler =
          vi.fn();


        const contextHandler =
          vi.fn();


        const localHandler =
          vi.fn();


        const result =
          resolveLayeredSlot<TestSlot>({
            slots: [
              "root",
            ],

            baseProps: {
              onClick:
                baseHandler,
            },

            contextSlotProps: {
              root: {
                onClick:
                  contextHandler,
              },
            },

            slotProps: {
              root: {
                onClick:
                  localHandler,
              },
            },
          });


        expect(
          result.onClick,
        ).toBe(
          localHandler,
        );


        result.onClick?.(
          {} as React.MouseEvent<HTMLElement>,
        );


        expect(
          localHandler,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          contextHandler,
        ).not.toHaveBeenCalled();


        expect(
          baseHandler,
        ).not.toHaveBeenCalled();
      },
    );
  },
);


describe(
  "resolver entry points",
  () => {
    it(
      "resolveSlot follows the same base and local precedence model",
      () => {
        const result =
          resolveSlot<TestSlot>({
            slot:
              "root",

            baseStyle: {
              color:
                "black",
            },

            baseProps: {
              className:
                "base",

              style: {
                color:
                  "gray",
              },

              "data-value":
                "base",
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

                style: {
                  color:
                    "green",
                },

                "data-value":
                  "local",
              },
            },

            className:
              "direct",

            style: {
              color:
                "purple",
            },
          });


        expect(
          result.className,
        ).toBe(
          "base local direct",
        );


        expect(
          result.style?.color,
        ).toBe(
          "purple",
        );


        expect(
          result[
            "data-value"
          ],
        ).toBe(
          "local",
        );
      },
    );
  },
);