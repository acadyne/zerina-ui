import React from "react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  act,
} from "react";

import {
  createRoot,
  type Root,
} from "react-dom/client";

import {
  ScreenState,
} from "../../src/patterns/scaffold/screen-state/ScreenState";


const mountedRoots:
  Array<{
    root:
      Root;

    container:
      HTMLDivElement;
  }> = [];


async function mount(
  element:
    React.ReactElement,
): Promise<HTMLDivElement> {
  const container =
    document.createElement(
      "div",
    );


  document.body.appendChild(
    container,
  );


  const root =
    createRoot(
      container,
    );


  await act(async () => {
    root.render(
      element,
    );
  });


  mountedRoots.push({
    root,
    container,
  });


  return container;
}


afterEach(async () => {
  for (
    const mounted of
    mountedRoots.splice(
      0,
    )
  ) {
    await act(async () => {
      mounted.root.unmount();
    });


    mounted.container.remove();
  }
});


describe(
  "ScreenState success slot resolution",
  () => {
    it(
      "combines root and success through left-to-right slot precedence",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              styles={{
                root: {
                  color:
                    "red",

                  padding:
                    "4px",
                },

                success: {
                  color:
                    "blue",

                  margin:
                    "8px",
                },
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root,
        ).not.toBeNull();


        expect(
          root?.style.color,
        ).toBe(
          "blue",
        );


        expect(
          root?.style.padding,
        ).toBe(
          "4px",
        );


        expect(
          root?.style.margin,
        ).toBe(
          "8px",
        );
      },
    );


    it(
      "applies slotProps styles after all root and success styles",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              styles={{
                root: {
                  color:
                    "red",
                },

                success: {
                  color:
                    "blue",

                  background:
                    "black",
                },
              }}
              slotProps={{
                root: {
                  style: {
                    color:
                      "green",
                  },
                },

                success: {
                  style: {
                    background:
                      "white",
                  },
                },
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root?.style.color,
        ).toBe(
          "green",
        );


        expect(
          root?.style.background,
        ).toBe(
          "white",
        );
      },
    );


    it(
      "applies direct style after root and success customization",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              styles={{
                root: {
                  color:
                    "red",
                },

                success: {
                  color:
                    "blue",
                },
              }}
              slotProps={{
                root: {
                  style: {
                    color:
                      "green",
                  },
                },

                success: {
                  style: {
                    color:
                      "orange",
                  },
                },
              }}
              style={{
                color:
                  "purple",
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root?.style.color,
        ).toBe(
          "purple",
        );
      },
    );


    it(
      "concatenates root, success and direct classes in order",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              className="direct-class"
              slotProps={{
                root: {
                  className:
                    "root-class",
                },

                success: {
                  className:
                    "success-class",
                },
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root?.className,
        ).toBe(
          "root-class success-class direct-class",
        );
      },
    );


    it(
      "lets the success slot override normal props from the root slot",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              slotProps={{
                root: {
                  "aria-label":
                    "root-label",

                  "data-slot-value":
                    "root-value",
                },

                success: {
                  "aria-label":
                    "success-label",

                  "data-slot-value":
                    "success-value",
                },
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root?.getAttribute(
            "aria-label",
          ),
        ).toBe(
          "success-label",
        );


        expect(
          root?.getAttribute(
            "data-slot-value",
          ),
        ).toBe(
          "success-value",
        );
      },
    );


    it(
      "does not let undefined in the success slot erase a root prop",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
              slotProps={{
                root: {
                  "aria-label":
                    "root-label",
                },

                success: {
                  "aria-label":
                    undefined,
                },
              }}
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state-success]",
          );


        expect(
          root?.getAttribute(
            "aria-label",
          ),
        ).toBe(
          "root-label",
        );
      },
    );


    it(
      "preserves all structural success attributes",
      async () => {
        const container =
          await mount(
            <ScreenState
              status="success"
            >
              Success content
            </ScreenState>,
          );


        const root =
          container.querySelector<HTMLElement>(
            "[data-ui-screen-state]",
          );


        expect(
          root,
        ).not.toBeNull();


        expect(
          root?.getAttribute(
            "data-ui-screen-state-status",
          ),
        ).toBe(
          "success",
        );


        expect(
          root?.hasAttribute(
            "data-ui-screen-state-success",
          ),
        ).toBe(
          true,
        );


        expect(
          root?.textContent,
        ).toContain(
          "Success content",
        );
      },
    );
  },
);