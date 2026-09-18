import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MotionPresence,
  MotionSwitch,
} from "zerina-ui";

import {
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase D3 shared motion frame behavior",
  () => {
    it(
      "lets MotionPresence omit the frame when not present",
      () => {
        const container =
          renderDOM(
            <MotionPresence
              present={
                false
              }

              preset="none"
            >
              <span
                data-testid="child"
              >
                Hidden
              </span>
            </MotionPresence>,
          );


        expect(
          container.querySelector(
            '[data-testid="child"]',
          ),
        ).toBeNull();

        expect(
          container.firstElementChild,
        ).toBeNull();
      },
    );


    it(
      "forwards MotionPresence host props through the shared frame",
      () => {
        const container =
          renderDOM(
            <MotionPresence
              present

              preset="none"

              data-testid="frame"

              className="presence-frame"

              style={{
                width:
                  "12px",
              }}
            >
              <span>
                Present
              </span>
            </MotionPresence>,
          );

        const frame =
          container.querySelector<HTMLElement>(
            '[data-testid="frame"]',
          );


        expect(
          frame,
        ).not.toBeNull();

        expect(
          frame?.className,
        ).toContain(
          "presence-frame",
        );

        expect(
          frame?.style.width,
        ).toBe(
          "12px",
        );

        expect(
          frame?.textContent,
        ).toBe(
          "Present",
        );
      },
    );


    it(
      "always renders the MotionSwitch frame",
      () => {
        const container =
          renderDOM(
            <MotionSwitch
              motionKey="screen-a"

              preset="none"

              data-testid="frame"
            >
              <span>
                Screen A
              </span>
            </MotionSwitch>,
          );


        const frame =
          container.querySelector(
            '[data-testid="frame"]',
          );


        expect(
          frame,
        ).not.toBeNull();

        expect(
          frame?.textContent,
        ).toBe(
          "Screen A",
        );
      },
    );
  },
);
